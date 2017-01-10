(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular-point"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["angular-point", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["angular-point-lookup-cache"] = factory(require("angular-point"), require("lodash"));
	else
		root["angular-point-lookup-cache"] = factory(root["angular-point"], root["lodash"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return LookupCacheService; });

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
 * let apLookupCacheService: lookupCache.LookupCacheService;
 * let lookupFieldsToCache = ['project'];
 *
 * class ProjectTask{
     *      constructor(obj) {
     *          super();
     *          _.assign(this, obj);
     *
     *          //Only cache list items saved to server so verify an id is available
     *          if(this.id) {
     *
     *              // Store in cached object so we can reference from lookup reference
     *              apLookupCacheService.cacheEntityByLookupId(this, lookupFieldsToCache);
     *          }
     *      }
     *
     *      //...other methods on constructor class
     * }
 *
 * export class ProjectTasksModel extends Model {
     *      constructor($injector: ng.auto.IInjectorService) {
     *
     *          super({
     *              factory: ProjectTask,
     *              getChildren: getChildren,
     *              list: {
     *                  // Maps to the offline XML file in dev folder (no spaces)
     *                  title: 'ProjectTask',
     *                  /// List GUID can be found in list properties in SharePoint designer
     *                  environments: {
     *                      production: '{C72C44A2-DC40-4308-BEFF-3FF418D14022}',
     *                      test: '{DAD8689C-8B9E-4088-BEC5-9F273CAAE104}'
     *                  },
     *                  customFields: [
     *                      // Array of objects mapping each SharePoint field to a property on a list item object
     *                      {staticName: 'Title', objectType: 'Text', mappedName: 'title', cols: 3, readOnly: false},
     *                      {staticName: 'Project', objectType: 'Lookup', mappedName: 'project', readOnly: false}
     *                      ...
     *                  ]
     *              }
     *          });
     *
     *          //Expose service to ProjectTask class and we know it's already loaded because it's loaded before
     *          //project files
     *          apLookupCacheService = $injector.get('apLookupCacheService');
     *
     *          //Patch save and delete on class prototype to allow us to cleanup cache before each event
     *          apLookupCacheService.manageChangeEvents(Muster, lookupFieldsToCache);
     *
     *      }
     *
     *      //...other methods on model
     *
     * }
 * </pre>
 */
/**
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
     *     return lookupCacheService.retrieveLookupCacheById<ProjectTask>('project', model.list.getListId(), projectId, asObject);
     * }
 * </pre>
 *
 *
 * Using Cached Value From Project Object
 * <pre>
 * // On the project model
 * function Project(obj) {
     *     _.assign(this, obj);
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
            __WEBPACK_IMPORTED_MODULE_0_lodash__["each"](propertyArray, function (propertyName) {
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
    /**
     * @ngdoc function
     * @name apLookupCacheService:manageChangeEvents
     * @methodOf apLookupCacheService
     * @param {ListItem} listItemConstructor List item class.
     * @param {string[]} propertyArray Array of the lookup properties being cached.
     * @description Attaches preSave and preDelete actions to the list item prototype for a given model.
     * Cleans up local cache prior to list item save or delete.  When saved, the newly returned
     * list item is then added back into the cache and when deleted we prune the list item from all cache objects.
     *
     * @example
     * <pre>
     * //...inside the model constructor
     * //New way with use of helper method
     * apLookupCacheService.manageChangeEvents(MyListItemFactoryClass, MyLookupFieldNamesArrayToCache);
     *
     * //vs. Old Way
     *
     * //...somewhere below the ListItemFactoryClass definition
     * //Monkey Patch save and delete to allow us to cleanup cache
     * MyListItemFactoryClass.prototype._deleteItem = MyListItemFactoryClass.prototype.deleteItem;
     * MyListItemFactoryClass.prototype.deleteItem = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, MyLookupFieldNamesArrayToCache);
         *     }
         *     return this._deleteItem(arguments);
         * }
     * MyListItemFactoryClass.prototype._saveChanges = MyListItemFactoryClass.prototype.saveChanges;
     * MyListItemFactoryClass.prototype.saveChanges = function () {
         *     if (this.id) {
         *         apLookupCacheService.removeEntityFromLookupCaches(this, MyLookupFieldNamesArrayToCache);
         *     }
         *     return this._saveChanges(arguments);
         * }
     *
     * </pre>
     */
    LookupCacheService.prototype.manageChangeEvents = function (listItemConstructor, propertyArray) {
        var unSubscribeOnChange = function () {
            if (this.id) {
                service.removeEntityFromLookupCaches(this, propertyArray);
            }
            //Need to return true otherwise it means validation failed and save/delete event is prevented
            return true;
        };
        listItemConstructor.prototype.registerPreDeleteAction(unSubscribeOnChange);
        listItemConstructor.prototype.registerPreSaveAction(unSubscribeOnChange);
    };
    LookupCacheService.prototype.removeEntityFromLookupCaches = function (listItem, propertyArray) {
        if (listItem.id) {
            var listId = listItem.getListId();
            /** Only cache entities saved to server and we know because they'd have an id */
            __WEBPACK_IMPORTED_MODULE_0_lodash__["each"](propertyArray, function (propertyName) {
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
        if (asObject === void 0) { asObject = false; }
        var cache = service.getPropertyCache(propertyName, listId);
        if (asObject) {
            cache[cacheId] = cache[cacheId] || apIndexedCacheFactory.create();
            return cache[cacheId];
        }
        else {
            return cache[cacheId] ? __WEBPACK_IMPORTED_MODULE_0_lodash__["toArray"](cache[cacheId]) : [];
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
        this.backup[listId][listItem.id][propertyName] = __WEBPACK_IMPORTED_MODULE_0_lodash__["cloneDeep"](listItem[propertyName]);
    };
    LookupCacheService.prototype.cacheSingleLookup = function (listItem, propertyName, listId) {
        if (listItem[propertyName]) {
            /** Handle single and multiple lookups by only dealing with an Lookup[] */
            var lookups = __WEBPACK_IMPORTED_MODULE_0_lodash__["isArray"](listItem[propertyName]) ? listItem[propertyName] : [listItem[propertyName]];
            __WEBPACK_IMPORTED_MODULE_0_lodash__["each"](lookups, function (lookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = service.getPropertyCache(propertyName, listId);
                    propertyCache[lookup.lookupId] = propertyCache[lookup.lookupId] || apIndexedCacheFactory.create();
                    var lookupCache = propertyCache[lookup.lookupId];
                    lookupCache.set(listItem.id, listItem);
                }
                else {
                    throw new Error("A valid lookup was not found.");
                }
            });
        }
    };
    LookupCacheService.prototype.removeEntityFromSingleLookupCache = function (listItem, propertyName, listId) {
        /** Handle single and multiple lookups by only dealing with an Lookup[] */
        var backedUpLookupValues = this.backup[listId][listItem.id];
        // Don't look at curent list item value in casee user changed it, look at the original backed up value that we stored so we can unregister
        // what was originally registered.
        if (backedUpLookupValues && backedUpLookupValues[propertyName]) {
            var lookups = __WEBPACK_IMPORTED_MODULE_0_lodash__["isArray"](backedUpLookupValues[propertyName]) ? backedUpLookupValues[propertyName] : [backedUpLookupValues[propertyName]];
            __WEBPACK_IMPORTED_MODULE_0_lodash__["each"](lookups, function (lookup) {
                if (lookup && lookup.lookupId) {
                    var propertyCache = service.getPropertyCache(propertyName, listId);
                    if (propertyCache[lookup.lookupId]) {
                        var lookupCache = propertyCache[lookup.lookupId];
                        lookupCache.delete(listItem.id);
                    }
                }
                else {
                    throw new Error("A valid lookup was not found.");
                }
            });
        }
    };
    return LookupCacheService;
}());

LookupCacheService.$inject = ['apIndexedCacheFactory'];


/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("angular-point");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("lodash");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_point_lookup_cache__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_point___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_point__);


__WEBPACK_IMPORTED_MODULE_1_angular_point__["AngularPointModule"]
    .service('apLookupCacheService', __WEBPACK_IMPORTED_MODULE_0__angular_point_lookup_cache__["a" /* LookupCacheService */]);


/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiZDQ0OTUzZWI0Nzk1Nzk5ZjYwMSIsIndlYnBhY2s6Ly8vLi9zcmMvYW5ndWxhci1wb2ludC1sb29rdXAtY2FjaGUudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYW5ndWxhci1wb2ludFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaFwiIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7QUM5RDRCO0FBSTVCLElBQUksT0FBMkIsRUFBRSxxQkFBcUIsQ0FBQztBQUd2RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1FRztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1DRztBQUNIO0lBS0ksNEJBQVksdUJBQXVCO1FBSm5DLFdBQU0sR0FBeUMsRUFBRSxD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USxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDbkUsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLElBQUksV0FBVyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2pELFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO1lBRUwsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVMLHlCQUFDO0FBQUQsQ0FBQzs7QUF6S1UsMEJBQU8sR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Ozs7Ozs7QUNuSC9DLDBDOzs7Ozs7QUNBQSxtQzs7Ozs7Ozs7OztBQ0FnRTtBQUNmO0FBRWpELGlFQUFrQjtLQUNULE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSx1RkFBa0IsQ0FBQyxDQUFDIiwiZmlsZSI6ImFuZ3VsYXItcG9pbnQtbG9va3VwLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhci1wb2ludFwiKSwgcmVxdWlyZShcImxvZGFzaFwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhbmd1bGFyLXBvaW50XCIsIFwibG9kYXNoXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFuZ3VsYXItcG9pbnQtbG9va3VwLWNhY2hlXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhci1wb2ludFwiKSwgcmVxdWlyZShcImxvZGFzaFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiYW5ndWxhci1wb2ludC1sb29rdXAtY2FjaGVcIl0gPSBmYWN0b3J5KHJvb3RbXCJhbmd1bGFyLXBvaW50XCJdLCByb290W1wibG9kYXNoXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9yeSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb3J5IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJkNDQ5NTNlYjQ3OTU3OTlmNjAxIiwiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtMaXN0SXRlbSwgSW5kZXhlZENhY2hlLCBJTG9va3VwfSBmcm9tICdhbmd1bGFyLXBvaW50JztcblxuXG52YXIgc2VydmljZTogTG9va3VwQ2FjaGVTZXJ2aWNlLCBhcEluZGV4ZWRDYWNoZUZhY3Rvcnk7XG5cblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgYXBMb29rdXBDYWNoZVNlcnZpY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZSB0byBjcmVhdGUgYSByZXZlcnNlIGxvb2t1cCBjYWNoZSB0aGF0IHN0b3JlcyBhIGxpc3QgaXRlbSBpbiBrZXkvdmFsIG1hcCBiYXNlZCBvbiBsb29rdXAgaWQgc28gdGhlIHJlbW90ZVxuICogbW9kZGxlIGNhbiBjYWxsIHNlcnZpY2UgdG8gZmluZCBhbGwgcmVsYXRlZCBsaXN0IGl0ZW1zIGFscmVhZHkgc3RvcmVkIGluIHRoZSBjYWNoZS4gIE9ubHkgbmVlZCB0byBwcm9jZXNzIG9uIGxpc3RcbiAqIGl0ZW0gaW5zdGFudGlhdGlvbiBhbmQgdGhlbiBwcnVuZSByZWZlcmVuY2VzIHdoZW4gYSBsaXN0IGl0ZW0gaXMgc2F2ZWQvZGVsZXRlZC5cbiAqXG4gKlxuICogQGV4YW1wbGVcbiAqIDxwcmU+XG4gKiAvL1JlZ2lzdGVyIE9uIE1vZGVsXG4gKiBsZXQgYXBMb29rdXBDYWNoZVNlcnZpY2U6IGxvb2t1cENhY2hlLkxvb2t1cENhY2hlU2VydmljZTtcbiAqIGxldCBsb29rdXBGaWVsZHNUb0NhY2hlID0gWydwcm9qZWN0J107XG4gKlxuICogY2xhc3MgUHJvamVjdFRhc2t7XG4gICAgICogICAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgKiAgICAgICAgICBzdXBlcigpO1xuICAgICAqICAgICAgICAgIF8uYXNzaWduKHRoaXMsIG9iaik7XG4gICAgICpcbiAgICAgKiAgICAgICAgICAvL09ubHkgY2FjaGUgbGlzdCBpdGVtcyBzYXZlZCB0byBzZXJ2ZXIgc28gdmVyaWZ5IGFuIGlkIGlzIGF2YWlsYWJsZVxuICAgICAqICAgICAgICAgIGlmKHRoaXMuaWQpIHtcbiAgICAgKlxuICAgICAqICAgICAgICAgICAgICAvLyBTdG9yZSBpbiBjYWNoZWQgb2JqZWN0IHNvIHdlIGNhbiByZWZlcmVuY2UgZnJvbSBsb29rdXAgcmVmZXJlbmNlXG4gICAgICogICAgICAgICAgICAgIGFwTG9va3VwQ2FjaGVTZXJ2aWNlLmNhY2hlRW50aXR5QnlMb29rdXBJZCh0aGlzLCBsb29rdXBGaWVsZHNUb0NhY2hlKTtcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9XG4gICAgICpcbiAgICAgKiAgICAgIC8vLi4ub3RoZXIgbWV0aG9kcyBvbiBjb25zdHJ1Y3RvciBjbGFzc1xuICAgICAqIH1cbiAqXG4gKiBleHBvcnQgY2xhc3MgUHJvamVjdFRhc2tzTW9kZWwgZXh0ZW5kcyBNb2RlbCB7XG4gICAgICogICAgICBjb25zdHJ1Y3RvcigkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZSkge1xuICAgICAqXG4gICAgICogICAgICAgICAgc3VwZXIoe1xuICAgICAqICAgICAgICAgICAgICBmYWN0b3J5OiBQcm9qZWN0VGFzayxcbiAgICAgKiAgICAgICAgICAgICAgZ2V0Q2hpbGRyZW46IGdldENoaWxkcmVuLFxuICAgICAqICAgICAgICAgICAgICBsaXN0OiB7XG4gICAgICogICAgICAgICAgICAgICAgICAvLyBNYXBzIHRvIHRoZSBvZmZsaW5lIFhNTCBmaWxlIGluIGRldiBmb2xkZXIgKG5vIHNwYWNlcylcbiAgICAgKiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJvamVjdFRhc2snLFxuICAgICAqICAgICAgICAgICAgICAgICAgLy8vIExpc3QgR1VJRCBjYW4gYmUgZm91bmQgaW4gbGlzdCBwcm9wZXJ0aWVzIGluIFNoYXJlUG9pbnQgZGVzaWduZXJcbiAgICAgKiAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50czoge1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3Rpb246ICd7QzcyQzQ0QTItREM0MC00MzA4LUJFRkYtM0ZGNDE4RDE0MDIyfScsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgdGVzdDogJ3tEQUQ4Njg5Qy04QjlFLTQwODgtQkVDNS05RjI3M0NBQUUxMDR9J1xuICAgICAqICAgICAgICAgICAgICAgICAgfSxcbiAgICAgKiAgICAgICAgICAgICAgICAgIGN1c3RvbUZpZWxkczogW1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgIC8vIEFycmF5IG9mIG9iamVjdHMgbWFwcGluZyBlYWNoIFNoYXJlUG9pbnQgZmllbGQgdG8gYSBwcm9wZXJ0eSBvbiBhIGxpc3QgaXRlbSBvYmplY3RcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICB7c3RhdGljTmFtZTogJ1RpdGxlJywgb2JqZWN0VHlwZTogJ1RleHQnLCBtYXBwZWROYW1lOiAndGl0bGUnLCBjb2xzOiAzLCByZWFkT25seTogZmFsc2V9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIHtzdGF0aWNOYW1lOiAnUHJvamVjdCcsIG9iamVjdFR5cGU6ICdMb29rdXAnLCBtYXBwZWROYW1lOiAncHJvamVjdCcsIHJlYWRPbmx5OiBmYWxzZX1cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAuLi5cbiAgICAgKiAgICAgICAgICAgICAgICAgIF1cbiAgICAgKiAgICAgICAgICAgICAgfVxuICAgICAqICAgICAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICAgICAgLy9FeHBvc2Ugc2VydmljZSB0byBQcm9qZWN0VGFzayBjbGFzcyBhbmQgd2Uga25vdyBpdCdzIGFscmVhZHkgbG9hZGVkIGJlY2F1c2UgaXQncyBsb2FkZWQgYmVmb3JlXG4gICAgICogICAgICAgICAgLy9wcm9qZWN0IGZpbGVzXG4gICAgICogICAgICAgICAgYXBMb29rdXBDYWNoZVNlcnZpY2UgPSAkaW5qZWN0b3IuZ2V0KCdhcExvb2t1cENhY2hlU2VydmljZScpO1xuICAgICAqXG4gICAgICogICAgICAgICAgLy9QYXRjaCBzYXZlIGFuZCBkZWxldGUgb24gY2xhc3MgcHJvdG90eXBlIHRvIGFsbG93IHVzIHRvIGNsZWFudXAgY2FjaGUgYmVmb3JlIGVhY2ggZXZlbnRcbiAgICAgKiAgICAgICAgICBhcExvb2t1cENhY2hlU2VydmljZS5tYW5hZ2VDaGFuZ2VFdmVudHMoTXVzdGVyLCBsb29rdXBGaWVsZHNUb0NhY2hlKTtcbiAgICAgKlxuICAgICAqICAgICAgfVxuICAgICAqXG4gICAgICogICAgICAvLy4uLm90aGVyIG1ldGhvZHMgb24gbW9kZWxcbiAgICAgKlxuICAgICAqIH1cbiAqIDwvcHJlPlxuICovXG5cbi8qKlxuICpcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgUHJvamVjdFRhc2s6Z2V0UHJvamVjdFRhc2tzXG4gKiBAbWV0aG9kT2YgUHJvamVjdFRhc2tcbiAqIEBwYXJhbSB7bnVtYmVyfSBwcm9qZWN0SWQgSUQgb2YgcHJvamVjdCB0byB1c2UgYXMga2V5IGZvciB0YXNrIGxvb2t1cHMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFthc09iamVjdD1mYWxzZV0gIE9wdGlvbmFsbHkgcHJldmVudCBjb252ZXJzaW9uIHRvIGFuIGFycmF5LlxuICogQGRlc2NyaXB0aW9uXG4gKiBGaW5kIGFsbCBwcm9qZWN0IHRhc2tzIHRoYXQgcmVmZXJlbmNlIGEgZ2l2ZW4gcHJvamVjdC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IEtleXMgb2Ygc3BlYyBpZCdzIGFuZCB2YWx1ZSBvZiB0aGUgc3BlYyBvYmplY3RzIGlmIFwiYXNPYmplY3Q9dHJ1ZVwiIG90aGVyd2lzZSBQcm9qZWN0VGFza1tdXG4gKiBmdW5jdGlvbiBnZXRQcm9qZWN0VGFza3MocHJvamVjdElkLCBhc09iamVjdCkge1xuICAgICAqICAgICByZXR1cm4gbG9va3VwQ2FjaGVTZXJ2aWNlLnJldHJpZXZlTG9va3VwQ2FjaGVCeUlkPFByb2plY3RUYXNrPigncHJvamVjdCcsIG1vZGVsLmxpc3QuZ2V0TGlzdElkKCksIHByb2plY3RJZCwgYXNPYmplY3QpO1xuICAgICAqIH1cbiAqIDwvcHJlPlxuICpcbiAqXG4gKiBVc2luZyBDYWNoZWQgVmFsdWUgRnJvbSBQcm9qZWN0IE9iamVjdFxuICogPHByZT5cbiAqIC8vIE9uIHRoZSBwcm9qZWN0IG1vZGVsXG4gKiBmdW5jdGlvbiBQcm9qZWN0KG9iaikge1xuICAgICAqICAgICBfLmFzc2lnbih0aGlzLCBvYmopO1xuICAgICAqIH1cbiAqXG4gKiBQcm9qZWN0LnByb3RvdHlwZS5nZXRQcm9qZWN0VGFza3MgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgcmV0dXJuIHByb2plY3RUYXNrc01vZGVsLmdldFByb2plY3RUYXNrcyh0aGlzLmlkKTtcbiAgICAgKiB9XG4gKlxuICogLy8gUHJvamVjdCB0YXNrcyBhcmUgbm93IGRpcmVjdGx5IGF2YWlsYWJsZSBmcm9tIGEgZ2l2ZW4gcHJvamVjdFxuICpcbiAqIC8vUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBwcm9qZWN0IHRhc2tzXG4gKiB2YXIgcHJvamVjdFRhc2tzID0gbXlQcm9qZWN0LmdldFByb2plY3RUYXNrcygpO1xuICpcbiAqIC8vUmV0dXJucyBhbiBpbmRleGVkIGNhY2hlIG9iamVjdCB0aGF0IGhhc24ndCBiZWVuIGNvbnZlcnRlZCBpbnRvIGFuIGFycmF5LCBrZXlzPWlkIGFuZCB2YWw9bGlzdCBpdGVtXG4gKiB2YXIgcHJvamVjdFRhc2tzID0gbXlQcm9qZWN0LmdldFByb2plY3RUYXNrcyh0cnVlKTtcbiAqIDwvcHJlPlxuICovXG5leHBvcnQgY2xhc3MgTG9va3VwQ2FjaGVTZXJ2aWNlIHtcbiAgICBiYWNrdXA6IHtba2V5OiBzdHJpbmddOiB7W2tleTogbnVtYmVyXToge319fSA9IHt9O1xuICAgIGxvb2t1cENhY2hlID0ge307XG4gICAgc3RhdGljICRpbmplY3QgPSBbJ2FwSW5kZXhlZENhY2hlRmFjdG9yeSddO1xuXG4gICAgY29uc3RydWN0b3IoX2FwSW5kZXhlZENhY2hlRmFjdG9yeV8pIHtcbiAgICAgICAgYXBJbmRleGVkQ2FjaGVGYWN0b3J5ID0gX2FwSW5kZXhlZENhY2hlRmFjdG9yeV87XG4gICAgICAgIHNlcnZpY2UgPSB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFwTG9va3VwQ2FjaGVTZXJ2aWNlOmNhY2hlRW50aXR5QnlMb29rdXBJZFxuICAgICAqIEBtZXRob2RPZiBhcExvb2t1cENhY2hlU2VydmljZVxuICAgICAqIEBwYXJhbSB7TGlzdEl0ZW19IGxpc3RJdGVtIExpc3QgaXRlbSB0byBpbmRleC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBwcm9wZXJ0eUFycmF5IEFycmF5IG9mIHRoZSBsb29rdXAgcHJvcGVydGllcyB0byBpbmRleCBieSBsb29rdXBJZC5cbiAgICAgKi9cbiAgICBjYWNoZUVudGl0eUJ5TG9va3VwSWQobGlzdEl0ZW06IExpc3RJdGVtPGFueT4sIHByb3BlcnR5QXJyYXk6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIGlmIChsaXN0SXRlbS5pZCkge1xuICAgICAgICAgICAgLyoqIEdVSUQgb2YgdGhlIGxpc3QgZGVmaW5pdGlvbiBvbiB0aGUgbW9kZWwgKi9cbiAgICAgICAgICAgIHZhciBsaXN0SWQgPSBsaXN0SXRlbS5nZXRMaXN0SWQoKTtcbiAgICAgICAgICAgIC8qKiBPbmx5IGNhY2hlIGVudGl0aWVzIHNhdmVkIHRvIHNlcnZlciAqL1xuICAgICAgICAgICAgXy5lYWNoKHByb3BlcnR5QXJyYXksIChwcm9wZXJ0eU5hbWUpID0+IHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmNhY2hlU2luZ2xlTG9va3VwKGxpc3RJdGVtLCBwcm9wZXJ0eU5hbWUsIGxpc3RJZCk7XG4gICAgICAgICAgICAgICAgc2VydmljZS5iYWNrdXBMb29rdXBWYWx1ZShsaXN0SXRlbSwgcHJvcGVydHlOYW1lLCBsaXN0SWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRQcm9wZXJ0eUNhY2hlPFQgZXh0ZW5kcyBMaXN0SXRlbTxhbnk+Pihwcm9wZXJ0eU5hbWU6IHN0cmluZywgbGlzdElkOiBzdHJpbmcpOiB7W2tleTogbnVtYmVyXTogSW5kZXhlZENhY2hlPFQ+fSB7XG4gICAgICAgIHRoaXMubG9va3VwQ2FjaGVbbGlzdElkXSA9IHRoaXMubG9va3VwQ2FjaGVbbGlzdElkXSB8fCB7fTtcbiAgICAgICAgdGhpcy5sb29rdXBDYWNoZVtsaXN0SWRdW3Byb3BlcnR5TmFtZV0gPSB0aGlzLmxvb2t1cENhY2hlW2xpc3RJZF1bcHJvcGVydHlOYW1lXSB8fCB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va3VwQ2FjaGVbbGlzdElkXVtwcm9wZXJ0eU5hbWVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFwTG9va3VwQ2FjaGVTZXJ2aWNlOm1hbmFnZUNoYW5nZUV2ZW50c1xuICAgICAqIEBtZXRob2RPZiBhcExvb2t1cENhY2hlU2VydmljZVxuICAgICAqIEBwYXJhbSB7TGlzdEl0ZW19IGxpc3RJdGVtQ29uc3RydWN0b3IgTGlzdCBpdGVtIGNsYXNzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHByb3BlcnR5QXJyYXkgQXJyYXkgb2YgdGhlIGxvb2t1cCBwcm9wZXJ0aWVzIGJlaW5nIGNhY2hlZC5cbiAgICAgKiBAZGVzY3JpcHRpb24gQXR0YWNoZXMgcHJlU2F2ZSBhbmQgcHJlRGVsZXRlIGFjdGlvbnMgdG8gdGhlIGxpc3QgaXRlbSBwcm90b3R5cGUgZm9yIGEgZ2l2ZW4gbW9kZWwuXG4gICAgICogQ2xlYW5zIHVwIGxvY2FsIGNhY2hlIHByaW9yIHRvIGxpc3QgaXRlbSBzYXZlIG9yIGRlbGV0ZS4gIFdoZW4gc2F2ZWQsIHRoZSBuZXdseSByZXR1cm5lZFxuICAgICAqIGxpc3QgaXRlbSBpcyB0aGVuIGFkZGVkIGJhY2sgaW50byB0aGUgY2FjaGUgYW5kIHdoZW4gZGVsZXRlZCB3ZSBwcnVuZSB0aGUgbGlzdCBpdGVtIGZyb20gYWxsIGNhY2hlIG9iamVjdHMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogLy8uLi5pbnNpZGUgdGhlIG1vZGVsIGNvbnN0cnVjdG9yXG4gICAgICogLy9OZXcgd2F5IHdpdGggdXNlIG9mIGhlbHBlciBtZXRob2RcbiAgICAgKiBhcExvb2t1cENhY2hlU2VydmljZS5tYW5hZ2VDaGFuZ2VFdmVudHMoTXlMaXN0SXRlbUZhY3RvcnlDbGFzcywgTXlMb29rdXBGaWVsZE5hbWVzQXJyYXlUb0NhY2hlKTtcbiAgICAgKlxuICAgICAqIC8vdnMuIE9sZCBXYXlcbiAgICAgKlxuICAgICAqIC8vLi4uc29tZXdoZXJlIGJlbG93IHRoZSBMaXN0SXRlbUZhY3RvcnlDbGFzcyBkZWZpbml0aW9uXG4gICAgICogLy9Nb25rZXkgUGF0Y2ggc2F2ZSBhbmQgZGVsZXRlIHRvIGFsbG93IHVzIHRvIGNsZWFudXAgY2FjaGVcbiAgICAgKiBNeUxpc3RJdGVtRmFjdG9yeUNsYXNzLnByb3RvdHlwZS5fZGVsZXRlSXRlbSA9IE15TGlzdEl0ZW1GYWN0b3J5Q2xhc3MucHJvdG90eXBlLmRlbGV0ZUl0ZW07XG4gICAgICogTXlMaXN0SXRlbUZhY3RvcnlDbGFzcy5wcm90b3R5cGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICogICAgIGlmICh0aGlzLmlkKSB7XG4gICAgICAgICAqICAgICAgICAgYXBMb29rdXBDYWNoZVNlcnZpY2UucmVtb3ZlRW50aXR5RnJvbUxvb2t1cENhY2hlcyh0aGlzLCBNeUxvb2t1cEZpZWxkTmFtZXNBcnJheVRvQ2FjaGUpO1xuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKiAgICAgcmV0dXJuIHRoaXMuX2RlbGV0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgICAgICAgICogfVxuICAgICAqIE15TGlzdEl0ZW1GYWN0b3J5Q2xhc3MucHJvdG90eXBlLl9zYXZlQ2hhbmdlcyA9IE15TGlzdEl0ZW1GYWN0b3J5Q2xhc3MucHJvdG90eXBlLnNhdmVDaGFuZ2VzO1xuICAgICAqIE15TGlzdEl0ZW1GYWN0b3J5Q2xhc3MucHJvdG90eXBlLnNhdmVDaGFuZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgKiAgICAgaWYgKHRoaXMuaWQpIHtcbiAgICAgICAgICogICAgICAgICBhcExvb2t1cENhY2hlU2VydmljZS5yZW1vdmVFbnRpdHlGcm9tTG9va3VwQ2FjaGVzKHRoaXMsIE15TG9va3VwRmllbGROYW1lc0FycmF5VG9DYWNoZSk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqICAgICByZXR1cm4gdGhpcy5fc2F2ZUNoYW5nZXMoYXJndW1lbnRzKTtcbiAgICAgICAgICogfVxuICAgICAqXG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgbWFuYWdlQ2hhbmdlRXZlbnRzKGxpc3RJdGVtQ29uc3RydWN0b3I6IGFueSwgcHJvcGVydHlBcnJheTogc3RyaW5nW10pIHtcbiAgICAgICAgdmFyIHVuU3Vic2NyaWJlT25DaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pZCkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UucmVtb3ZlRW50aXR5RnJvbUxvb2t1cENhY2hlcyh0aGlzLCBwcm9wZXJ0eUFycmF5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vTmVlZCB0byByZXR1cm4gdHJ1ZSBvdGhlcndpc2UgaXQgbWVhbnMgdmFsaWRhdGlvbiBmYWlsZWQgYW5kIHNhdmUvZGVsZXRlIGV2ZW50IGlzIHByZXZlbnRlZFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdEl0ZW1Db25zdHJ1Y3Rvci5wcm90b3R5cGUucmVnaXN0ZXJQcmVEZWxldGVBY3Rpb24odW5TdWJzY3JpYmVPbkNoYW5nZSk7XG4gICAgICAgIGxpc3RJdGVtQ29uc3RydWN0b3IucHJvdG90eXBlLnJlZ2lzdGVyUHJlU2F2ZUFjdGlvbih1blN1YnNjcmliZU9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICByZW1vdmVFbnRpdHlGcm9tTG9va3VwQ2FjaGVzKGxpc3RJdGVtOiBMaXN0SXRlbTxhbnk+LCBwcm9wZXJ0eUFycmF5OiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBpZiAobGlzdEl0ZW0uaWQpIHtcbiAgICAgICAgICAgIHZhciBsaXN0SWQgPSBsaXN0SXRlbS5nZXRMaXN0SWQoKTtcbiAgICAgICAgICAgIC8qKiBPbmx5IGNhY2hlIGVudGl0aWVzIHNhdmVkIHRvIHNlcnZlciBhbmQgd2Uga25vdyBiZWNhdXNlIHRoZXknZCBoYXZlIGFuIGlkICovXG4gICAgICAgICAgICBfLmVhY2gocHJvcGVydHlBcnJheSwgZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgICAgIHNlcnZpY2UucmVtb3ZlRW50aXR5RnJvbVNpbmdsZUxvb2t1cENhY2hlKGxpc3RJdGVtLCBwcm9wZXJ0eU5hbWUsIGxpc3RJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFwTG9va3VwQ2FjaGVTZXJ2aWNlOnJldHJpZXZlTG9va3VwQ2FjaGVCeUlkXG4gICAgICogQG1ldGhvZE9mIGFwTG9va3VwQ2FjaGVTZXJ2aWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5TmFtZSBDYWNoZSBuYW1lIC0gbmFtZSBvZiBwcm9wZXJ0eSBvbiBjYWNoZWQgZW50aXR5LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjYWNoZUlkIElEIG9mIHRoZSBjYWNoZS4gIFRoZSBlbnRpdHkucHJvcGVydHkubG9va3VwSWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RJZCBHVUlEIG9mIHRoZSBsaXN0IGRlZmluaXRpb24gb24gdGhlIG1vZGVsLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FzT2JqZWN0PWZhbHNlXSBEZWZhdWx0cyB0byByZXR1cm4gYXMgYW4gYXJyYXkgYnV0IGlmIHNldCB0byBmYWxzZSByZXR1cm5zIHRoZSBjYWNoZSBvYmplY3RcbiAgICAgKiBpbnN0ZWFkLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IEtleXMgb2YgZW50aXR5IGlkIGFuZCB2YWx1ZSBvZiBlbnRpdHkuXG4gICAgICovXG4gICAgcmV0cmlldmVMb29rdXBDYWNoZUJ5SWQ8VCBleHRlbmRzIExpc3RJdGVtPGFueT4+KHByb3BlcnR5TmFtZTogc3RyaW5nLCBsaXN0SWQ6IHN0cmluZywgY2FjaGVJZDogbnVtYmVyLCBhc09iamVjdDogYm9vbGVhbiA9IGZhbHNlKTogSW5kZXhlZENhY2hlPFQ+IHwgVFtdIHtcbiAgICAgICAgdmFyIGNhY2hlID0gc2VydmljZS5nZXRQcm9wZXJ0eUNhY2hlKHByb3BlcnR5TmFtZSwgbGlzdElkKTtcbiAgICAgICAgaWYgKGFzT2JqZWN0KSB7XG4gICAgICAgICAgICBjYWNoZVtjYWNoZUlkXSA9IGNhY2hlW2NhY2hlSWRdIHx8IGFwSW5kZXhlZENhY2hlRmFjdG9yeS5jcmVhdGUoKTtcbiAgICAgICAgICAgIHJldHVybiA8SW5kZXhlZENhY2hlPFQ+PiBjYWNoZVtjYWNoZUlkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZVtjYWNoZUlkXSA/IF8udG9BcnJheTxUPihjYWNoZVtjYWNoZUlkXSkgOiBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFwTG9va3VwQ2FjaGVTZXJ2aWNlOmJhY2t1cExvb2t1cFZhbHVlXG4gICAgICogQG1ldGhvZE9mIGFwTG9va3VwQ2FjaGVTZXJ2aWNlXG4gICAgICogQHBhcmFtIHtMaXN0SXRlbX0gbGlzdEl0ZW0gTGlzdCBpdGVtIHRvIGluZGV4LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eU5hbWUgQ2FjaGUgbmFtZSAtIG5hbWUgb2YgcHJvcGVydHkgb24gY2FjaGVkIGVudGl0eS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdElkIEdVSUQgb2YgdGhlIGxpc3QgZGVmaW5pdGlvbiBvbiB0aGUgbW9kZWwuXG4gICAgICogQGRlc2NyaXB0aW9uIFN0b3JlcyBhIGNvcHkgb2YgdGhlIGluaXRpYWwgbG9va3VwIHZhbHVlIHNvIGluIHRoZSBldmVudCB0aGF0IHRoZSBsb29rdXAgdmFsdWUgaXMgY2hhbmdlZCB3ZSBjYW5cbiAgICAgKiByZW1vdmUgY2FjaGVkIHJlZmVyZW5jZXMgcHJpb3IgdG8gc2F2aW5nLlxuICAgICAqL1xuICAgIHByaXZhdGUgYmFja3VwTG9va3VwVmFsdWUobGlzdEl0ZW06IExpc3RJdGVtPGFueT4sIHByb3BlcnR5TmFtZTogc3RyaW5nLCBsaXN0SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmJhY2t1cFtsaXN0SWRdID0gdGhpcy5iYWNrdXBbbGlzdElkXSB8fCB7fTtcbiAgICAgICAgdGhpcy5iYWNrdXBbbGlzdElkXVtsaXN0SXRlbS5pZF0gPSB0aGlzLmJhY2t1cFtsaXN0SWRdW2xpc3RJdGVtLmlkXSB8fCB7fTtcbiAgICAgICAgdGhpcy5iYWNrdXBbbGlzdElkXVtsaXN0SXRlbS5pZF1bcHJvcGVydHlOYW1lXSA9IF8uY2xvbmVEZWVwKGxpc3RJdGVtW3Byb3BlcnR5TmFtZV0pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBjYWNoZVNpbmdsZUxvb2t1cChsaXN0SXRlbTogTGlzdEl0ZW08YW55PiwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGxpc3RJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChsaXN0SXRlbVtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgICAvKiogSGFuZGxlIHNpbmdsZSBhbmQgbXVsdGlwbGUgbG9va3VwcyBieSBvbmx5IGRlYWxpbmcgd2l0aCBhbiBMb29rdXBbXSAqL1xuICAgICAgICAgICAgdmFyIGxvb2t1cHMgPSBfLmlzQXJyYXkobGlzdEl0ZW1bcHJvcGVydHlOYW1lXSkgPyBsaXN0SXRlbVtwcm9wZXJ0eU5hbWVdIDogW2xpc3RJdGVtW3Byb3BlcnR5TmFtZV1dO1xuICAgICAgICAgICAgXy5lYWNoKGxvb2t1cHMsIGZ1bmN0aW9uIChsb29rdXA6IElMb29rdXA8YW55Pikge1xuICAgICAgICAgICAgICAgIGlmIChsb29rdXAgJiYgbG9va3VwLmxvb2t1cElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eUNhY2hlID0gc2VydmljZS5nZXRQcm9wZXJ0eUNhY2hlKHByb3BlcnR5TmFtZSwgbGlzdElkKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlDYWNoZVtsb29rdXAubG9va3VwSWRdID0gcHJvcGVydHlDYWNoZVtsb29rdXAubG9va3VwSWRdIHx8IGFwSW5kZXhlZENhY2hlRmFjdG9yeS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvb2t1cENhY2hlID0gcHJvcGVydHlDYWNoZVtsb29rdXAubG9va3VwSWRdO1xuICAgICAgICAgICAgICAgICAgICBsb29rdXBDYWNoZS5zZXQobGlzdEl0ZW0uaWQsIGxpc3RJdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHZhbGlkIGxvb2t1cCB3YXMgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlRW50aXR5RnJvbVNpbmdsZUxvb2t1cENhY2hlKGxpc3RJdGVtOiBMaXN0SXRlbTxhbnk+LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgbGlzdElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgLyoqIEhhbmRsZSBzaW5nbGUgYW5kIG11bHRpcGxlIGxvb2t1cHMgYnkgb25seSBkZWFsaW5nIHdpdGggYW4gTG9va3VwW10gKi9cbiAgICAgICAgdmFyIGJhY2tlZFVwTG9va3VwVmFsdWVzID0gdGhpcy5iYWNrdXBbbGlzdElkXVtsaXN0SXRlbS5pZF07XG5cbiAgICAgICAgLy8gRG9uJ3QgbG9vayBhdCBjdXJlbnQgbGlzdCBpdGVtIHZhbHVlIGluIGNhc2VlIHVzZXIgY2hhbmdlZCBpdCwgbG9vayBhdCB0aGUgb3JpZ2luYWwgYmFja2VkIHVwIHZhbHVlIHRoYXQgd2Ugc3RvcmVkIHNvIHdlIGNhbiB1bnJlZ2lzdGVyXG4gICAgICAgIC8vIHdoYXQgd2FzIG9yaWdpbmFsbHkgcmVnaXN0ZXJlZC5cbiAgICAgICAgaWYgKGJhY2tlZFVwTG9va3VwVmFsdWVzICYmIGJhY2tlZFVwTG9va3VwVmFsdWVzW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICAgIHZhciBsb29rdXBzID0gXy5pc0FycmF5KGJhY2tlZFVwTG9va3VwVmFsdWVzW3Byb3BlcnR5TmFtZV0pID8gYmFja2VkVXBMb29rdXBWYWx1ZXNbcHJvcGVydHlOYW1lXSA6IFtiYWNrZWRVcExvb2t1cFZhbHVlc1twcm9wZXJ0eU5hbWVdXTtcbiAgICAgICAgICAgIF8uZWFjaChsb29rdXBzLCBmdW5jdGlvbiAobG9va3VwOiBJTG9va3VwPGFueT4pIHtcbiAgICAgICAgICAgICAgICBpZiAobG9va3VwICYmIGxvb2t1cC5sb29rdXBJZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlDYWNoZSA9IHNlcnZpY2UuZ2V0UHJvcGVydHlDYWNoZShwcm9wZXJ0eU5hbWUsIGxpc3RJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNhY2hlW2xvb2t1cC5sb29rdXBJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb29rdXBDYWNoZSA9IHByb3BlcnR5Q2FjaGVbbG9va3VwLmxvb2t1cElkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cENhY2hlLmRlbGV0ZShsaXN0SXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHZhbGlkIGxvb2t1cCB3YXMgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hbmd1bGFyLXBvaW50LWxvb2t1cC1jYWNoZS50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFuZ3VsYXItcG9pbnRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJhbmd1bGFyLXBvaW50XCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibG9kYXNoXCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtMb29rdXBDYWNoZVNlcnZpY2V9IGZyb20gJy4vYW5ndWxhci1wb2ludC1sb29rdXAtY2FjaGUnO1xuaW1wb3J0IHtBbmd1bGFyUG9pbnRNb2R1bGV9IGZyb20gJ2FuZ3VsYXItcG9pbnQnO1xuXG5Bbmd1bGFyUG9pbnRNb2R1bGVcbiAgICAgICAgLnNlcnZpY2UoJ2FwTG9va3VwQ2FjaGVTZXJ2aWNlJywgTG9va3VwQ2FjaGVTZXJ2aWNlKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==