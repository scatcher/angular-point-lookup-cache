/// <reference path="../typings/ap.d.ts" />

module ap {
    'use strict';

    var service: LookupCacheService, apIndexedCacheFactory;

    interface ILookupCacheService {
        backupLookupValue(listItem: ap.ListItem<any>, propertyName: string, listId: string): void;
        cacheEntityByLookupId(listItem: ap.ListItem<any>, propertyArray: string[]): void;
        cacheSingleLookup(listItem: ap.ListItem<any>, propertyName: string, listId: string): void;
        getPropertyCache<T>(propertyName: string, listId: string): { [key: number]: ap.IndexedCache<T> };
        removeEntityFromLookupCaches(listItem: ap.ListItem<any>, propertyArray: string[]): void;
        removeEntityFromSingleLookupCache(listItem: ap.ListItem<any>, propertyName: string, listId: string): void;
        retrieveLookupCacheById<T>(propertyName: string, listId: string, cacheId: number): ap.IndexedCache<T>;
        retrieveLookupCacheById<T>(propertyName: string, listId: string, cacheId: number, asObject?: boolean): T[];
    }

    /**
     * @ngdoc service
     * @name apLookupCacheService
     * @description
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

        removeEntityFromLookupCaches(listItem: ap.ListItem<any>, propertyArray: string[]): void {
            if (listItem.id) {
                var listId = listItem.getListId();
                /** Only cache entities saved to server */
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
        retrieveLookupCacheById<T>(propertyName: string, listId: string, cacheId: number, asObject?: boolean) {
            var cache = service.getPropertyCache(propertyName, listId);
            if (asObject) {
                cache[cacheId] = cache[cacheId] || apIndexedCacheFactory.create();
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
        backupLookupValue(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            this.backup[listId] = this.backup[listId] || {};
            this.backup[listId][listItem.id] = this.backup[listId][listItem.id] || {};
            this.backup[listId][listItem.id][propertyName] = _.clone(listItem[propertyName]);
        }        


        cacheSingleLookup(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(listItem[propertyName]) ? listItem[propertyName] : [listItem[propertyName]];
            _.each(lookups, function(lookup: ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = service.getPropertyCache(propertyName, listId);
                    propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || apIndexedCacheFactory.create();
                    var lookupCache = propertyCache[lookup.lookupId];
                    lookupCache.addEntity(listItem);
                }
            });
        }

        removeEntityFromSingleLookupCache(listItem: ap.ListItem<any>, propertyName: string, listId: string): void {
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var backedUpLookupValues = this.backup[listId][listItem.id]
            var lookups = _.isArray(backedUpLookupValues[propertyName]) ? backedUpLookupValues[propertyName] : [backedUpLookupValues[propertyName]];
            _.each(lookups, function(lookup: ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = service.getPropertyCache(propertyName, listId);
                    if (propertyCache[lookup.lookupId]) {
                        var lookupCache = propertyCache[lookup.lookupId];
                        lookupCache.removeEntity(listItem);
                    }
                }
            });
        }

        getPropertyCache<T>(propertyName: string, listId: string): { [key: number]: ap.IndexedCache<T> } {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        }

    }

    angular
        .module('angularPoint')
        .service('apLookupCacheService', LookupCacheService);

}