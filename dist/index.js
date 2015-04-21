//Remove Initial slash to get typings
/// <reference path="../typings/tsd.d.ts" />
var ap;
(function (ap) {
    var LookupCache;
    (function (LookupCache) {
        'use strict';
        /**
         * @ngdoc service
         * @name apLookupCacheService
         * @description
         */
        var LookupCacheService = (function () {
            function LookupCacheService(apIndexedCacheFactory) {
                this.apIndexedCacheFactory = apIndexedCacheFactory;
                this.lookupCache = {};
            }
            /**
             * @ngdoc function
             * @name apLookupCacheService:cacheEntityByLookupId
             * @methodOf apLookupCacheService
             * @param {ListItem} entity List item to index.
             * @param {string[]} propertyArray Array of the lookup properties to index by lookupId.
             */
            LookupCacheService.prototype.cacheEntityByLookupId = function (entity, propertyArray) {
                var self = this;
                if (entity.id) {
                    /** GUID of the list definition on the model */
                    var listId = entity.getListId();
                    /** Only cache entities saved to server */
                    _.each(propertyArray, function (propertyName) {
                        self.cacheSingleLookup(entity, propertyName, listId);
                    });
                }
            };
            LookupCacheService.prototype.removeEntityFromLookupCaches = function (entity, propertyArray) {
                var self = this;
                if (entity.id) {
                    var listId = entity.getListId();
                    /** Only cache entities saved to server */
                    _.each(propertyArray, function (propertyName) {
                        self.removeEntityFromSingleLookupCache(entity, propertyName, listId);
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
                var self = this;
                var cache = self.getPropertyCache(propertyName, listId);
                if (asObject) {
                    cache[cacheId] = cache[cacheId] || self.apIndexedCacheFactory.create();
                    return cache[cacheId];
                }
                else {
                    return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
                }
            };
            LookupCacheService.prototype.cacheSingleLookup = function (entity, propertyName, listId) {
                var self = this;
                /** Handle single and multiple lookups by only dealing with an Lookup[] */
                var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
                _.each(lookups, function (lookup) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = self.getPropertyCache(propertyName, listId);
                        propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || self.apIndexedCacheFactory.create();
                        var lookupCache = propertyCache[lookup.lookupId];
                        lookupCache.addEntity(entity);
                    }
                });
            };
            LookupCacheService.prototype.removeEntityFromSingleLookupCache = function (entity, propertyName, listId) {
                var self = this;
                /** Handle single and multiple lookups by only dealing with an Lookup[] */
                var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
                _.each(lookups, function (lookup) {
                    if (lookup && lookup.lookupId) {
                        var propertyCache = self.getPropertyCache(propertyName, listId);
                        if (propertyCache[lookup.lookupId]) {
                            var lookupCache = propertyCache[lookup.lookupId];
                            lookupCache.removeEntity(entity);
                        }
                    }
                });
            };
            LookupCacheService.prototype.getPropertyCache = function (propertyName, listId) {
                this.lookupCache[listId] = this.lookupCache[listId] || {};
                this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
                return this.lookupCache[listId][propertyName];
            };
            return LookupCacheService;
        })();
        LookupCache.LookupCacheService = LookupCacheService;
        angular.module('angularPoint').service('apLookupCacheService', LookupCacheService);
    })(LookupCache = ap.LookupCache || (ap.LookupCache = {}));
})(ap || (ap = {}));
