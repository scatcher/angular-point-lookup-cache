/// <reference path="../typings/tsd.d.ts" />

module ap.lookupCache {
    'use strict';

    var service: LookupCacheService, apIndexedCacheFactory;

    interface ILookupCacheService {
        cacheEntityByLookupId(listItem: ap.ListItem<any>, propertyArray: string[]): void;
        getPropertyCache<T extends ap.ListItem<any>>(propertyName: string, listId: string): { [key: number]: ap.IndexedCache<T> };
        removeEntityFromLookupCaches(listItem: ap.ListItem<any>, propertyArray: string[]): void;
        retrieveLookupCacheById<T extends ap.ListItem<any>>(propertyName: string, listId: string, cacheId: number): ap.IndexedCache<T>;
        retrieveLookupCacheById<T extends ap.ListItem<any>>(propertyName: string, listId: string, cacheId: number, asObject?: boolean): T[];
    }


    /**
     * @ngdoc service
     * @name apLookupCacheService
     * @description
     * Service to create a reverse lookup cache that stores a list item in key/val map based on lookup id so the remote
     * moddle can call service to find all related list items already stored in the cache.  Only need to process on list
     * item instantiation and then prune references when a list item is saved/deleted.
     *
     *
     * @example
     * <pre>
     * //Register On Model
     * let apLookupCacheService: ap.lookupCache.LookupCacheService;
     * let lookupFieldsToCache = ['project'];
     *
     * class ProjectTask{
     *      constructor(obj) {
     *          super();
     *          _.assign(this, obj);
     *
     *          //Only cache list items saved to server so verify an id is available
     *          if(this.id) {
     *
     *              // Store in cached object so we can reference from lookup reference
     *              apLookupCacheService.cacheEntityByLookupId(this, lookupFieldsToCache);
     *          }
     *      }
     *
     *      //...other methods on constructor class
     * }
     *
     * export class ProjectTasksModel extends ap.Model {
     *      constructor($injector: ng.auto.IInjectorService) {
     *
     *          super({
     *              factory: ProjectTask,
     *              getChildren: getChildren,
     *              list: {
     *                  // Maps to the offline XML file in dev folder (no spaces)
     *                  title: 'ProjectTask',
     *                  /// List GUID can be found in list properties in SharePoint designer
     *                  environments: {
     *                      production: '{C72C44A2-DC40-4308-BEFF-3FF418D14022}',
     *                      test: '{DAD8689C-8B9E-4088-BEC5-9F273CAAE104}'
     *                  },
     *                  customFields: [
     *                      // Array of objects mapping each SharePoint field to a property on a list item object
     *                      {staticName: 'Title', objectType: 'Text', mappedName: 'title', cols: 3, readOnly: false},
     *                      {staticName: 'Project', objectType: 'Lookup', mappedName: 'project', readOnly: false}
     *                      ...
     *                  ]
     *              }
     *          });
     *
     *          //Expose service to ProjectTask class and we know it's already loaded because it's loaded before
     *          //project files
     *          apLookupCacheService = $injector.get('apLookupCacheService');
     *
     *          //Patch save and delete on class prototype to allow us to cleanup cache before each event
     *          apLookupCacheService.manageChangeEvents(Muster, lookupFieldsToCache);
     *
     *      }
     *
     *      //...other methods on model
     *
     * }
     * </pre>
     */

     /**
     *
     * @ngdoc function
     * @name ProjectTask:getProjectTasks
     * @methodOf ProjectTask
     * @param {number} projectId ID of project to use as key for task lookups.
     * @param {boolean} [asObject=false]  Optionally prevent conversion to an array.
     * @description
     * Find all project tasks that reference a given project.
     * @returns {object} Keys of spec id's and value of the spec objects if "asObject=true" otherwise ProjectTask[]
     * function getProjectTasks(projectId, asObject) {
     *     return lookupCacheService.retrieveLookupCacheById<ProjectTask>('project', model.list.getListId(), projectId, asObject);
     * }
     * </pre>
     *
     *
     * Using Cached Value From Project Object
     * <pre>
     * // On the project model
     * function Project(obj) {
     *     _.assign(this, obj);
     * }
     *
     * Project.prototype.getProjectTasks = function() {
     *     return projectTasksModel.getProjectTasks(this.id);
     * }
     *
     * // Project tasks are now directly available from a given project
     *
     * //Returns an array containing all project tasks
     * var projectTasks = myProject.getProjectTasks();
     *
     * //Returns an indexed cache object that hasn't been converted into an array, keys=id and val=list item
     * var projectTasks = myProject.getProjectTasks(true);
     * </pre>
     */
    export class LookupCacheService implements ILookupCacheService {
        backup: { [key: string]: { [key: number]: {} } } = {};
        lookupCache = {};
        static $inject = ['apIndexedCacheFactory'];

        constructor(_apIndexedCacheFactory_) {
            apIndexedCacheFactory = _apIndexedCacheFactory_;
            service = this;
        }

        /**
         * @ngdoc function
         * @name apLookupCacheService:cacheEntityByLookupId
         * @methodOf apLookupCacheService
         * @param {ListItem} listItem List item to index.
         * @param {string[]} propertyArray Array of the lookup properties to index by lookupId.
         */
        cacheEntityByLookupId(listItem: ap.ListItem<any>, propertyArray: string[]): void {
            if (listItem.id) {
                /** GUID of the list definition on the model */
                var listId = listItem.getListId();
                /** Only cache entities saved to server */
                _.each(propertyArray, (propertyName) => {
                    service.cacheSingleLookup(listItem, propertyName, listId);
                    service.backupLookupValue(listItem, propertyName, listId);
                });
            }
        }

        getPropertyCache<T extends ap.ListItem<any>>(propertyName: string, listId: string): { [key: number]: ap.IndexedCache<T> } {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        }

        /**
         * @ngdoc function
         * @name apLookupCacheService:manageChangeEvents
         * @methodOf apLookupCacheService
         * @param {ListItem} listItemConstructor List item class.
         * @param {string[]} propertyArray Array of the lookup properties being cached.
         * @description Attaches preSave and preDelete actions to the list item prototype for a given model.
         * Cleans up local cache prior to list item save or delete.  When saved, the newly returned
         * list item is then added back into the cache and when deleted we prune the list item from all cache objects.
         *
         * @example
         * <pre>
         * //...inside the model constructor
         * //New way with use of helper method
         * apLookupCacheService.manageChangeEvents(MyListItemFactoryClass, MyLookupFieldNamesArrayToCache);
         *
         * //vs. Old Way
         *
         * //...somewhere below the ListItemFactoryClass definition
         * //Monkey Patch save and delete to allow us to cleanup cache
         * MyListItemFactoryClass.prototype._deleteItem = MyListItemFactoryClass.prototype.deleteItem;
         * MyListItemFactoryClass.prototype.deleteItem = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, MyLookupFieldNamesArrayToCache);
         *     }
         *     return this._deleteItem(arguments);
         * }
         * MyListItemFactoryClass.prototype._saveChanges = MyListItemFactoryClass.prototype.saveChanges;
         * MyListItemFactoryClass.prototype.saveChanges = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, MyLookupFieldNamesArrayToCache);
         *     }
         *     return this._saveChanges(arguments);
         * }
         *
         * </pre>
         */
        manageChangeEvents(listItemConstructor: ap.ListItem<any>, propertyArray: string[]) {
            var unSubscribeOnChange = function() {
                if (this.id) {
                    service.removeEntityFromLookupCaches(this, propertyArray);
                }
                //Need to return true otherwise it means validation failed and save/delete event is prevented
                return true;
            }
            listItemConstructor.prototype.registerPreDeleteAction(unSubscribeOnChange);
            listItemConstructor.prototype.registerPreSaveAction(unSubscribeOnChange);
        }

        removeEntityFromLookupCaches(listItem: ap.ListItem<any>, propertyArray: string[]): void {
            if (listItem.id) {
                var listId = listItem.getListId();
                /** Only cache entities saved to server and we know because they'd have an id */
                _.each(propertyArray, function(propertyName) {
                    service.removeEntityFromSingleLookupCache(listItem, propertyName, listId);
                });
            }
        }

        /**
         * @ngdoc function
         * @name apLookupCacheService:retrieveLookupCacheById
         * @methodOf apLookupCacheService
         * @param {string} propertyName Cache name - name of property on cached entity.
         * @param {number} cacheId ID of the cache.  The entity.property.lookupId.
         * @param {string} listId GUID of the list definition on the model.
         * @param {boolean} [asObject=false] Defaults to return as an array but if set to false returns the cache object
         * instead.
         * @returns {object} Keys of entity id and value of entity.
         */
        retrieveLookupCacheById<T extends ap.ListItem<any>>(propertyName: string, listId: string, cacheId: number, asObject: boolean = false) {
            var cache = service.getPropertyCache(propertyName, listId);
            if (asObject) {
                cache[cacheId] = cache[cacheId] || apIndexedCacheFactory.create<T>();
                return cache[cacheId];
            } else {
                return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
            }
        }

        /**
         * @ngdoc function
         * @name apLookupCacheService:backupLookupValue
         * @methodOf apLookupCacheService
         * @param {ListItem} listItem List item to index.
         * @param {string} propertyName Cache name - name of property on cached entity.
         * @param {string} listId GUID of the list definition on the model.
         * @description Stores a copy of the initial lookup value so in the event that the lookup value is changed we can
         * remove cached references prior to saving.
         */
        private backupLookupValue(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            this.backup[listId] = this.backup[listId] || {};
            this.backup[listId][listItem.id] = this.backup[listId][listItem.id] || {};
            this.backup[listId][listItem.id][propertyName] = _.clone(listItem[propertyName]);
        }


        private cacheSingleLookup(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            if (listItem[propertyName]) {
                /** Handle single and multiple lookups by only dealing with an Lookup[] */
                var lookups = _.isArray(listItem[propertyName]) ? listItem[propertyName] : [listItem[propertyName]];
                _.each(lookups, function(lookup: ap.ILookup<any>) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = service.getPropertyCache(propertyName, listId);
                        propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || apIndexedCacheFactory.create();
                        var lookupCache = propertyCache[lookup.lookupId];
                        lookupCache.set(listItem.id, listItem);
                    } else {
                        throw new Error("A valid lookup was not found.");
                    }
                });
            }
        }

        private removeEntityFromSingleLookupCache(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var backedUpLookupValues = this.backup[listId][listItem.id];

            // Don't look at curent list item value in casee user changed it, look at the original backed up value that we stored so we can unregister
            // what was originally registered.
            if (backedUpLookupValues && backedUpLookupValues[propertyName]) {
                var lookups = _.isArray(backedUpLookupValues[propertyName]) ? backedUpLookupValues[propertyName] : [backedUpLookupValues[propertyName]];
                _.each(lookups, function(lookup: ap.ILookup<any>) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = service.getPropertyCache(propertyName, listId);
                        if (propertyCache[lookup.lookupId]) {
                            var lookupCache = propertyCache[lookup.lookupId];
                            lookupCache.delete(listItem.id);
                        }
                    } else {
                        throw new Error("A valid lookup was not found.");
                    }

                });
            }
        }

    }

}