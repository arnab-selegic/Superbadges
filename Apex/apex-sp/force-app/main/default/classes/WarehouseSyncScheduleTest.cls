@isTest
public with sharing class WarehouseSyncScheduleTest {
    public static string CRON_EXP = '0 0 1 * * ?';
    
    // implement scheduled code here
    @isTest 
    public static void ScedulerTest(){
        Test.setMock(HttpCalloutMock.class, new WarehouseCalloutServiceMock());
        Test.startTest();
        String jobId = System.schedule('ss',
                                       CRON_EXP, new WarehouseSyncSchedule());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId]; 
        System.debug('ct ::' + ct.NextFireTime);
        System.assertEquals(0, ct.TimesTriggered);
        System.assertEquals('2023-01-29 01:00:00', String.valueOf(ct.NextFireTime));
        Test.stopTest();
        
    }
}