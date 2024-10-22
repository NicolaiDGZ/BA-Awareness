import { customEmitter, TASK_EVENTS } from "./events";

class TaskBox{
    title: string;
    tasks: {text:string, completed:boolean}[];
    constructor(){
        
    }

    get getTasks():any{
        if(this.tasks == null){
            return null;
        }else{
            return this.tasks;
        }
    }

    addTask(text:string, completed:boolean){
        if(this.tasks == null){
            this.tasks = [{text,completed}];
        }else{
            this.tasks.push({text,completed});
        }
    }

    updateTasks(){
        customEmitter.emit(TASK_EVENTS.UPDATE_TASKS);
        console.log("Event emitted");
    }

    completeTask(index : number){
        if(this.tasks != null && index >= 0 && index <= this.tasks.length){
            this.tasks[index].completed = true;
            this.updateTasks();
        }
    }
}

export const taskBox = new TaskBox();