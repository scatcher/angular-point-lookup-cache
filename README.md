# angular-point-lookup-cache
Service used to create caches for specified lookup fields to eliminate the need to iterate over the entire list to find related items.


Register On Model
---------
        
        var lookupFieldsToCache = ['project'];

        function ProjectTask(obj) {
            var self = this;
            _.extend(self, obj);

            if(self.id) {
                /** Store in cached object so we can reference from lookup reference */
                lookupCacheService.cacheEntityByLookupId(self, lookupFieldsToCache);
                /** Modify prototype delete logic so we can remove from cache prior to actually deleting */
                self._deleteItem = self.deleteItem;
                self.deleteItem = function() {
                    lookupCacheService.removeEntityFromLookupCaches(self, lookupFieldsToCache);
                    return self._deleteItem();
                }
            }
        }
        
        var model = apModelFactory.create({
            factory: ProjectTask,
            getChildren: getChildren,
            list: {
                /**Maps to the offline XML file in dev folder (no spaces) */
                title: 'ProjectTask',
                /**List GUID can be found in list properties in SharePoint designer */
                environments: {
                    production: '{C72C44A2-DC40-4308-BEFF-3FF418D14022}',
                    test: '{DAD8689C-8B9E-4088-BEC5-9F273CAAE104}'
                },
                customFields: [
                /** Array of objects mapping each SharePoint field to a property on a list item object */
                    {staticName: 'Title', objectType: 'Text', mappedName: 'title', cols: 3, readOnly: false},
                    {staticName: 'Project', objectType: 'Lookup', mappedName: 'project', readOnly: false}
                    ...
                ]
            }
        });
        
        /**
         * @ngdoc function
         * @name ProjectTask:getProjectTasks
         * @methodOf ProjectTask
         * @param {number} projectId ID of project to use as key for task lookups.
         * @param {boolean} [asObject=false]  Optionally prevent conversion to an array.
         * @description
         * Find all project tasks that reference a given project.
         * @returns {object} Keys of spec id's and value of the spec objects if "asObject=true" otherwise ProjectTask[]
         */
        function getProjectTasks(projectId, asObject) {
            return lookupCacheService.retrieveLookupCacheById('project', model.list.getListId(), projectId, asObject);
        }



Using Cached Value From Project Object
---------

        /** On the project model **/
        function Project(obj) {
            var self = this;
            _.extend(self, obj);
        }
        
        Project.prototype.getProjectTasks = function() {
            return projectTasksModel.getProjectTasks(this.id);
        }
        
        /** Project tasks are now directly available from a given project */
        
        //Returns an array containing all project tasks
        var projectTasks = myProject.getProjectTasks();
        
        //Returns an indexed cache object that hasn't been converted into an array, keys=id and val=list item
        var projectTasks = myProject.getProjectTasks(true);

