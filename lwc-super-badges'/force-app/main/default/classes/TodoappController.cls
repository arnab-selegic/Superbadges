public with sharing class TodoappController {
    @AuraEnabled(cacheable = true)
    public static List<TODO_App__c> getALLTasks(){
        try {
            List<TODO_App__c> todoList = [Select Name From TODO_App__c];
            System.debug('todo list ::' + todoList);
            return todoList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static TODO_App__c insertTasks(String taskName){
        try {
            TODO_App__c todoAppList = new TODO_App__c(
                Name = taskName
            );
            insert todoAppList;
            return todoAppList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean deleteTask(Id recordId) {
        try {
            Database.delete(recordId);
            return true;
        } catch(Exception e) {
            System.debug(e.getMessage());
        }
        return false;
    }
     @AuraEnabled
    public static TODO_App__c updateTask(Id recordId , String taskName) {
        try {
            TODO_App__c todoAppList = [SELECT Name From TODO_App__c Where Id =: recordId];
            todoAppList.Name = taskName;
            update todoAppList;
            return todoAppList;
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}