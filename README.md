# angular-point-lookup-cache
Service used to create caches for specified lookup fields to eliminate the need to iterate over the entire list to find related items.


Register On Model
---------

      let lookupFieldsToCache = ['project'];

      class ProjectTask{
           constructor(obj) {
               super();
               _.assign(this, obj);

               //Only cache list items saved to server so verify an id is available
               if(this.id) {

                   // Store in cached object so we can reference from lookup reference
                   apLookupCacheService.cacheEntityByLookupId(this, lookupFieldsToCache);
               }
           }

           //...other methods on constructor class
      }

      export class ProjectTasksModel extends ap.Model {
           constructor($injector: ng.auto.IInjectorService) {

               super({
                   factory: ProjectTask,
                   getChildren: getChildren,
                   list: {
                       // Maps to the offline XML file in dev folder (no spaces)
                       title: 'ProjectTask',
                       /// List GUID can be found in list properties in SharePoint designer
                       environments: {
                           production: '{C72C44A2-DC40-4308-BEFF-3FF418D14022}',
                           test: '{DAD8689C-8B9E-4088-BEC5-9F273CAAE104}'
                       },
                       customFields: [
                           // Array of objects mapping each SharePoint field to a property on a list item object
                           {staticName: 'Title', objectType: 'Text', mappedName: 'title', cols: 3, readOnly: false},
                           {staticName: 'Project', objectType: 'Lookup', mappedName: 'project', readOnly: false}
                           ...
                       ]
                   }
               });

               //Expose service to ProjectTask class and we know it's already loaded because it's loaded before
               //project files
               apLookupCacheService = $injector.get('apLookupCacheService');

               //Patch save and delete on class prototype to allow us to cleanup cache before each event
               apLookupCacheService.manageChangeEvents(Muster, lookupFieldsToCache);

           }
           getProjectTasks(projectId: number, asObject: boolean) {
              return lookupCacheService.retrieveLookupCacheById('project', this.list.getListId(), projectId, asObject);
           }

           //...other methods on model

      }




Using Cached Value From Project Object
---------

      /** On the project model **/
      class Project{
           constructor(obj) {
               super();
               _.assign(this, obj);
           }
           /** Project tasks are now directly available from a given project */
           getProjectTasks(asObject = false) {
               return projectTasksModel.getProjectTasks(this.id, asObject);
           }

           //...other methods on constructor class
      }

     //Returns an array containing all project tasks
     var projectTasks = myProject.getProjectTasks();

     //Returns an indexed cache object that hasn't been converted into an array, keys=id and val=list item
     var projectTasks = myProject.getProjectTasks(true);

