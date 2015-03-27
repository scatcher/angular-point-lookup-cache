/// <reference path="../.tmp/typings/tsd.d.ts" />
/// <reference path="../angular-point.d.ts" />
var angularPoint;
(function (angularPoint) {
    'use strict';
    /**
     * @ngdoc service
     * @name lookupCacheService
     * @description
     */
    var apLookupCacheService = (function () {
        function apLookupCacheService(apIndexedCacheFactory) {
            this.apIndexedCacheFactory = apIndexedCacheFactory;
        }
        apLookupCacheService.$inject = ['apIndexedCacheFactory'];
        /**
         * @ngdoc function
         * @name RTM.lookupCacheService:cacheEntityByLookupId
         * @methodOf RTM.lookupCacheService
         * @param {ListItem} entity List item to index.
         * @param {string[]} propertyArray Array of the lookup properties to index by lookupId.
         */
        apLookupCacheService.prototype.cacheEntityByLookupId = function (entity, propertyArray) {
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
        apLookupCacheService.prototype.removeEntityFromLookupCaches = function (entity, propertyArray) {
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
         * @name RTM.lookupCacheService:retrieveLookupCacheById
         * @methodOf RTM.lookupCacheService
         * @param {string} propertyName Cache name - name of property on cached entity.
         * @param {number} cacheId ID of the cache.  The entity.property.lookupId.
         * @param {string} listId GUID of the list definition on the model.
         * @param {boolean} [asObject=false] Defaults to return as an array but if set to false returns the cache object
         * instead.
         * @returns {object} Keys of entity id and value of entity.
         */
        apLookupCacheService.prototype.retrieveLookupCacheById = function (propertyName, listId, cacheId, asObject) {
            var self = this;
            var cache = self.getLookupCache(propertyName, listId);
            if (asObject) {
                return cache[cacheId] ? cache[cacheId] : {};
            }
            else {
                return cache[cacheId] ? _.toArray(cache[cacheId]) : [];
            }
        };
        apLookupCacheService.prototype.cacheSingleLookup = function (entity, propertyName, listId) {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup) {
                if (lookup && lookup.lookupId) {
                    var lookupCache = self.getLookupCache(propertyName, listId);
                    lookupCache[lookup.lookupId] = lookupCache[lookup.lookupId] || self.apIndexedCacheFactory.create();
                    lookupCache[lookup.lookupId].addEntity(entity);
                }
            });
        };
        apLookupCacheService.prototype.removeEntityFromSingleLookupCache = function (entity, propertyName, listId) {
            var self = this;
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = _.isArray(entity[propertyName]) ? entity[propertyName] : [entity[propertyName]];
            _.each(lookups, function (lookup) {
                if (lookup && lookup.lookupId) {
                    var lookupCache = self.getLookupCache(propertyName, listId);
                    if (lookupCache[lookup.lookupId]) {
                        lookupCache[lookup.lookupId].removeEntity(entity);
                    }
                }
            });
        };
        apLookupCacheService.prototype.getLookupCache = function (propertyName, listId) {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        };
        return apLookupCacheService;
    })();
    angular.module('angularPoint').service('apLookupCacheService', apLookupCacheService);
})(angularPoint || (angularPoint = {}));
