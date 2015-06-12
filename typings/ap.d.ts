/// <reference path="tsd.d.ts" />
declare module ap {
	interface ILookupCacheService {
		cacheEntityByLookupId(listItem: ap.IListItem<any>, propertyArray: string[]): void;
		cacheSingleLookup(listItem: ap.IListItem<any>, propertyName: string, listId: string): void;
		getPropertyCache<T>(propertyName: string, listId: string): { [key: number]: ap.IIndexedCache<T> };
		removeEntityFromLookupCaches(listItem: ap.IListItem<any>, propertyArray: string[]): void;
		removeEntityFromSingleLookupCache(listItem: ap.IListItem<any>, propertyName: string, listId: string): void;
        retrieveLookupCacheById<T>(propertyName: string, listId: string, cacheId: number): ap.IIndexedCache<T>;
        retrieveLookupCacheById<T>(propertyName: string, listId: string, cacheId: number, asObject?: boolean): T[];
    }
}