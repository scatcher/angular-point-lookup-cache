/// <reference path="../typings/tsd.d.ts" />
var ap;
(function (ap) {
    var lookupCache;
    (function (lookupCache_1) {
        'use strict';
        var service, apIndexedCacheFactory;
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
         * var lookupFieldsToCache = ['project'];
         *
         * function ProjectTask(obj) {
         *     var self = this;
         *     _.extend(self, obj);
         *
         *     if (self.id) {
         *         // Store in cached object so we can reference from lookup reference
         *         lookupCacheService.cacheEntityByLookupId(self, lookupFieldsToCache);
         *     }
         * }
         *
         * //Monkey Patch save and delete to allow us to cleanup cache
         * ProjectTask.prototype._deleteItem = SpecificationRequirement.prototype.deleteItem;
         * ProjectTask.prototype.deleteItem = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, lookupFieldsToCache);
         *     }
         *     return this._deleteItem(arguments);
         * }
         * ProjectTask.prototype._saveChanges = SpecificationRequirement.prototype.saveChanges;
         * ProjectTask.prototype.saveChanges = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, lookupFieldsToCache);
         *     }
         *     return this._saveChanges(arguments);
         * }
         *
         * var model = apModelFactory.create({
         *     factory: ProjectTask,
         *     getChildren: getChildren,
         *     list: {
         *         // Maps to the offline XML file in dev folder (no spaces)
         *         title: 'ProjectTask',
         *         /// List GUID can be found in list properties in SharePoint designer
         *         environments: {
         *             production: '{C72C44A2-DC40-4308-BEFF-3FF418D14022}',
         *             test: '{DAD8689C-8B9E-4088-BEC5-9F273CAAE104}'
         *         },
         *         customFields: [
         *             // Array of objects mapping each SharePoint field to a property on a list item object
         *             {staticName: 'Title', objectType: 'Text', mappedName: 'title', cols: 3, readOnly: false},
         *             {staticName: 'Project', objectType: 'Lookup', mappedName: 'project', readOnly: false}
         *             ...
         *         ]
         *     }
         * });
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
         *     return lookupCacheService.retrieveLookupCacheById('project', model.list.getListId(), projectId, asObject);
         * }
         * </pre>
         *
         *
         * Using Cached Value From Project Object
         * <pre>
         * // On the project model
         * function Project(obj) {
         *     var self = this;
         *     _.assign(self, obj);
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
        var LookupCacheService = (function () {
            function LookupCacheService(_apIndexedCacheFactory_) {
                this.backup = {};
                this.lookupCache = {};
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
            LookupCacheService.prototype.cacheEntityByLookupId = function (listItem, propertyArray) {
                if (listItem.id) {
                    /** GUID of the list definition on the model */
                    var listId = listItem.getListId();
                    /** Only cache entities saved to server */
                    _.each(propertyArray, function (propertyName) {
                        service.cacheSingleLookup(listItem, propertyName, listId);
                        service.backupLookupValue(listItem, propertyName, listId);
                    });
                }
            };
            LookupCacheService.prototype.getPropertyCache = function (propertyName, listId) {
                this.lookupCache[listId] = this.lookupCache[listId] || {};
                this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
                return this.lookupCache[listId][propertyName];
            };
            LookupCacheService.prototype.removeEntityFromLookupCaches = function (listItem, propertyArray) {
                if (listItem.id) {
                    var listId = listItem.getListId();
                    /** Only cache entities saved to server */
                    _.each(propertyArray, function (propertyName) {
                        service.removeEntityFromSingleLookupCache(listItem, propertyName, listId);
                    });
                }
            };
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
            LookupCacheService.prototype.retrieveLookupCacheById = function (propertyName, listId, cacheId, asObject) {
                var cache = service.getPropertyCache(propertyName, listId);
                if (asObject) {
                    cache[cacheId] = cache[cacheId] || apIndexedCacheFactory.create();
                    return cache[cacheId];
                }
                else {
                    return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
                }
            };
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
            LookupCacheService.prototype.backupLookupValue = function (listItem, propertyName, listId) {
                this.backup[listId] = this.backup[listId] || {};
                this.backup[listId][listItem.id] = this.backup[listId][listItem.id] || {};
                this.backup[listId][listItem.id][propertyName] = _.clone(listItem[propertyName]);
            };
            LookupCacheService.prototype.cacheSingleLookup = function (listItem, propertyName, listId) {
                /** Handle single and multiple lookups by only dealing with an Lookup[] */
                var lookups = _.isArray(listItem[propertyName]) ? listItem[propertyName] : [listItem[propertyName]];
                _.each(lookups, function (lookup) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = service.getPropertyCache(propertyName, listId);
                        propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || apIndexedCacheFactory.create();
                        var lookupCache = propertyCache[lookup.lookupId];
                        lookupCache.addEntity(listItem);
                    }
                    else {
                        throw new Error("A valid lookup was not found.");
                    }
                });
            };
            LookupCacheService.prototype.removeEntityFromSingleLookupCache = function (listItem, propertyName, listId) {
                /** Handle single and multiple lookups by only dealing with an Lookup[] */
                var backedUpLookupValues = this.backup[listId][listItem.id];
                var lookups = _.isArray(backedUpLookupValues[propertyName]) ? backedUpLookupValues[propertyName] : [backedUpLookupValues[propertyName]];
                _.each(lookups, function (lookup) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = service.getPropertyCache(propertyName, listId);
                        if (propertyCache[lookup.lookupId]) {
                            var lookupCache = propertyCache[lookup.lookupId];
                            lookupCache.removeEntity(listItem);
                        }
                    }
                    else {
                        throw new Error("A valid lookup was not found.");
                    }
                });
            };
            LookupCacheService.$inject = ['apIndexedCacheFactory'];
            return LookupCacheService;
        })();
        lookupCache_1.LookupCacheService = LookupCacheService;
    })(lookupCache = ap.lookupCache || (ap.lookupCache = {}));
})(ap || (ap = {}));

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="angular-point-lookup-cache" />
var ap;
(function (ap) {
    var lookupCache;
    (function (lookupCache) {
        'use strict';
        angular.module('apLookupCache', ['angularPoint'])
            .service('apLookupCacheService', lookupCache.LookupCacheService);
    })(lookupCache = ap.lookupCache || (ap.lookupCache = {}));
})(ap || (ap = {}));

//# sourceMappingURL=angular-point-lookup-cache.js.map