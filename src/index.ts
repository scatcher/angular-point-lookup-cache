/// <reference path="../typings/tsd.d.ts" />
/// <reference path="angular-point-lookup-cache" />


module ap.lookupCache {
    'use strict';

    angular.module('apLookupCache', ['angularPoint'])
        .service('apLookupCacheService', LookupCacheService);

}