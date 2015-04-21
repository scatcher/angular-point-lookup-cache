//Remove Initial slash to get typings
//// <reference path="../typings/tsd.d.ts" />

module ap.LookupCache {
    'use strict';

    interface ILookupCacheService{
        retrieveLookupCacheById<T>(propertyName:string, listId:string, cacheId:number) : ap.IIndexedCache<T>;
        retrieveLookupCacheById<T>(propertyName:string, listId:string, cacheId:number, asObject?:boolean) : T[];

    }

    /**
     * @ngdoc service
     * @name apLookupCacheService
     * @description
     */
    export class LookupCacheService implements ILookupCacheService{
        lookupCache = {};

        constructor(private apIndexedCacheFactory) {

        }

        /**
         * @ngdoc function
         * @name apLookupCacheService:cacheEntityByLookupId
         * @methodOf apLookupCacheService
         * @param {ListItem} entity List item to index.
         * @param {string[]} propertyArray Array of the lookup properties to index by lookupId.
         */
        cacheEntityByLookupId(entity:ap.IListItem, propertyArray:string[]):void {
            var self = this;
            if (entity.id) {
                /** GUID of the list definition on the model */
                var listId = entity.getListId();
                /** Only cache entities saved to server */
                _.each(propertyArray, (propertyName) => {
                    self.cacheSingleLookup(entity, propertyName, listId);
                });
            }
        }

        removeEntityFromLookupCaches(entity:ap.IListItem, propertyArray:string[]):void {
            var self = this;
            if (entity.id) {
                var listId = entity.getListId();
                /** Only cache entities saved to server */
                _.each(propertyArray, function (propertyName) {
                    self.removeEntityFromSingleLookupCache(entity, propertyName, listId);
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
        retrieveLookupCacheById<T>(propertyName:string, listId:string, cacheId:number, asObject?:boolean) {
            var self = this;
            var cache = self.getPropertyCache(propertyName, listId);
            if (asObject) {
                cache[cacheId] = cache[cacheId] || self.apIndexedCacheFactory.create();
                return cache[cacheId];
            } else {
                return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
            }
        }


        cacheSingleLookup(entity:ap.IListItem, propertyName:string, listId:string) : void {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup:ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = self.getPropertyCache(propertyName, listId);
                    propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || self.apIndexedCacheFactory.create();
                    var lookupCache:ap.IIndexedCache<ap.IListItem> = propertyCache[lookup.lookupId];
                    lookupCache.addEntity(entity);
                }
            });
        }

        removeEntityFromSingleLookupCache(entity:ap.IListItem, propertyName:string, listId:string) : void {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup:ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = self.getPropertyCache(propertyName, listId);
                    if (propertyCache[lookup.lookupId]) {
                        var lookupCache:ap.IIndexedCache<ap.IListItem> = propertyCache[lookup.lookupId];
                        lookupCache.removeEntity(entity);
                    }
                }
            });
        }

        getPropertyCache<T>(propertyName:string, listId:string):{ [key:number] : ap.IIndexedCache<T> } {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        }

    }

    angular
        .module('angularPoint')
        .service('apLookupCacheService', LookupCacheService);

}