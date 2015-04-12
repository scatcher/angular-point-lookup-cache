/// <reference path="../typings/tsd.d.ts" />

module ap.LookupCache {
    'use strict';


    /**
     * @ngdoc service
     * @name apLookupCacheService
     * @description
     */
    export class LookupCacheService {
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
        cacheEntityByLookupId(entity:ap.IListItem, propertyArray:string[]) {
            var self = this;
            if (entity.id) {
                /** GUID of the list definition on the model */
                var listId = entity.getListId();
                /** Only cache entities saved to server */
                _.each(propertyArray, function (propertyName) {
                    self.cacheSingleLookup(entity, propertyName, listId);
                });
            }
        }

        removeEntityFromLookupCaches(entity:ap.IListItem, propertyArray:string[]) {
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
        retrieveLookupCacheById(propertyName:string, listId:string, cacheId:number, asObject:[boolean]) {
            var self = this;
            var cache = self.getLookupCache(propertyName, listId);
            if (asObject) {
                return cache[cacheId] ? cache[cacheId] : {};
            } else {
                return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
            }
        }


        cacheSingleLookup(entity:ap.IListItem, propertyName:string, listId:string) {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup:ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var lookupCache = self.getLookupCache(propertyName, listId);
                    lookupCache[lookup.lookupId] = lookupCache[lookup.lookupId] || self.apIndexedCacheFactory.create();
                    lookupCache[lookup.lookupId].addEntity(entity);
                }
            });
        }

        removeEntityFromSingleLookupCache(entity:ap.IListItem, propertyName:string, listId:string) {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup:ap.ILookup) {
                if (lookup && lookup.lookupId) {
                    var lookupCache = self.getLookupCache(propertyName, listId);
                    if (lookupCache[lookup.lookupId]) {
                        lookupCache[lookup.lookupId].removeEntity(entity);
                    }
                }
            });
        }

        getLookupCache(propertyName:string, listId:string) {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        }

    }

    angular
        .module('angularPoint')
        .service('apLookupCacheService', LookupCacheService);

}