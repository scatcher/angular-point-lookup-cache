/// <reference path="../typings/ap.d.ts" />
var ap;
(function (ap) {
    'use strict';
    var service, apIndexedCacheFactory;
    /**
     * @ngdoc service
     * @name apLookupCacheService
     * @description
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
            });
        };
        LookupCacheService.prototype.getPropertyCache = function (propertyName, listId) {
            this.lookupCache[listId] = this.lookupCache[listId] || {};
            this.lookupCache[listId][propertyName] = this.lookupCache[listId][propertyName] || {};
            return this.lookupCache[listId][propertyName];
        };
        LookupCacheService.$inject = ['apIndexedCacheFactory'];
        return LookupCacheService;
    })();
    ap.LookupCacheService = LookupCacheService;
    angular
        .module('angularPoint')
        .service('apLookupCacheService', LookupCacheService);
})(ap || (ap = {}));

//# sourceMappingURL=angular-point-lookup-cache.js.map