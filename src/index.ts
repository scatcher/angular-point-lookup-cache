import {LookupCacheService} from './angular-point-lookup-cache';
import {AngularPointModule} from 'angular-point';

AngularPointModule
        .service('apLookupCacheService', LookupCacheService);

export { LookupCacheService };