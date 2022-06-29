import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';
import getAllTasks from '@salesforce/apex/TodoappController.getALLTasks';
import insertTasks from '@salesforce/apex/TodoappController.insertTasks';
import deleteTask from '@salesforce/apex/TodoappController.deleteTask';
import updateTask from '@salesforce/apex/TodoappController.updateTask';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';


import {
    refreshApex
} from '@salesforce/apex';
export default class Crud_app extends LightningElement {


    @track
    tasks = [];
    newTask = '';
    allTasks = '';
    todoTaskRes;
    isModalOpen = false;
    recordIdToUpdate;
    isLoaded = false;
    /*
        connectedCallback(){
            getAllTasks()
            .then(data =>{
                data.forEach(task => {
                    this.tasks.push({
                        Id : this.tasks.length+1,
                        Name : task.Name,
                        recordId : task.Id
                    })
                });
                console.log(this.tasks);
                
            })
            .catch(err=>{
                console.log(err);
            })
        }
    */

    createNewTask(event) {
        this.newTask = event.target.value;
        console.log(this.newTask);
    }

    @wire(getAllTasks)
    // tasks;
    getTodoApplistRecord(res) {
        this.tasks = [];
        this.todoTaskRes = res;
        let data = res.data;
        let err = res.error;

        if (data) {
            console.log('data :', data);
            data.forEach(task => {
                this.tasks.push({
                    Id: this.tasks.length + 1,
                    Name: task.Name,
                    recordId: task.Id
                })
            });
            console.log(this.tasks);
        } else {
            console.log('err :', err);
        }
    }

    handleClick() {
        if (this.newTask == '') {
            console.log('please enter a task');
            alert('please enter a task');
        }
        this.isLoaded = true

        insertTasks({
                taskName: this.newTask
            })
            .then(res => {
                console.log('task length :', this.tasks.length);
                this.tasks.push({
                    Id: this.tasks[this.tasks.length - 1] ? this.tasks[this.tasks.length - 1].id + 1 : 0,
                    Name: this.newTask,
                    recordId: res.Id
                });
                this.newTask = '';
                this.isLoaded = false;
                console.log(JSON.stringify(this.tasks));
            })
            .catch(err => {
                console.log(err);
            })


    }
    deleteTask(event) {
        alert('are you sure You want to delete ??');
        console.log('event ID', event.target.name);
        this.isLoaded = true;
        let eventID = event.target.name;
        let deletedID;
        let recordIdToDelete;
        for (let i = 0; i < this.tasks.length; i++) {
            if (eventID == this.tasks[i].Id) {
                deletedID = i;
                console.log('deleted ID : ', deletedID);
            }
        }
        recordIdToDelete = this.tasks[deletedID].recordId;
        console.log('rec to delete : ', recordIdToDelete);
        deleteTask({
                recordId: recordIdToDelete
            })
            .then(res => {
                this.isLoaded = false;
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        this.tasks.splice(deletedID, 1);
        const evt = new ShowToastEvent({
            title: 'Record is deleted',
            message: recordIdToDelete,
            variant: 'warning',
        });
        this.dispatchEvent(evt);
    }

    closeAfterUpdate() {
        this.isModalOpen = false;
    }

    updatedTask(event) {

        this.isModalOpen = true;
        console.log('event ID', event.target.name);
        let eventID = event.target.name;
        let updateID;
        for (let i = 0; i < this.tasks.length; i++) {
            if (eventID == this.tasks[i].Id) {
                updateID = i;
                console.log('updated ID : ', updateID);
            }
        }
        this.recordIdToUpdate = this.tasks[updateID].recordId;
        console.log('test recod id : ' , this.recordIdToUpdate);
        console.log('record Name', this.tasks[updateID].Name);

        
    }

    saveRecord() {
        this.isLoaded = true;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.recordIdToUpdate == this.tasks[i].recordId) {
                this.tasks[i].Name = this.newTask;
                console.log('updated ID : ', this.tasks[i].Name);
            }
        }
        if (this.newTask != '') {
            updateTask({
                    recordId: this.recordIdToUpdate,
                    taskName: this.newTask
                })
                .then(res => {
                    this.isLoaded = false;
                    console.log('update rec ', res);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        const evt = new ShowToastEvent({
            title: 'Record is updated',
            message: this.newTask,
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this.newTask = '';
        this.isModalOpen = false;
    }


    refreshTODOApp() {
        refreshApex(this.todoTaskRes);
    }
}