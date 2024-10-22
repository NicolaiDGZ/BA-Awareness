import { Scene } from 'phaser';
import { taskBox } from './components/taskBox';
import { customEmitter, TASK_EVENTS } from './components/events';

export class InfoBoxScene extends Phaser.Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    constructor() {
        super({key: 'InfoBoxScene'});
    }

    preload() {
        // Falls du Assets oder Bilder laden möchtest
    }

    create() {
        this.setPosition(10,10);
        this.camera = this.cameras.main;
        customEmitter.on(TASK_EVENTS.UPDATE_TASKS,() => this.updateAll());
    }


    updateAll(){
        console.log("Event received");
        // Infobox-Container
        let boxPadding = 20;
        let boxWidth = 300;
        // Beispiel: Aufgaben
        

        let titleText = this.add.text(boxPadding, boxPadding, taskBox.title, {
            fontSize: '20px',
            color: '#000',
            fontFamily: 'Arial'
        });

        let contentY = titleText.y + titleText.height + 10;

        // Aufgaben und Checkboxes hinzufügen
        const allTasks = taskBox.getTasks;

        if(allTasks!=null){
            taskBox.tasks.forEach(task => {
                /**let checkbox = this.add.rectangle(boxPadding, contentY, 20, 20, task.completed ? 0x00FF00 : 0xFF0000)
                    .setStrokeStyle(2, 0x000000)
                    .setOrigin(0, 0)
                    .setDepth(10);
                    */
    
                let checkbox = this.add.image(boxPadding,contentY, task.completed? "cb_true": "cb_false",)
                    .setDepth(10)
                    .setOrigin(0,0);
                let taskText = this.add.text(checkbox.x + checkbox.width + 10, contentY, task.text, {
                    fontSize: '16px',
                    color: '#000',
                    fontFamily: 'Arial',
                    wordWrap: {useAdvancedWrap: true, width: 250}
                })
                    .setDepth(10);
    
                contentY += Math.max(checkbox.height, taskText.height) + boxPadding/2;
            });
        }
        
        

        let box = this.add.graphics()
            .fillStyle(0xE9DDAF,1)
            .fillRoundedRect(5,5,boxWidth,contentY + boxPadding/2,15)
            .lineStyle(5,0x0,1)
            .strokeRoundedRect(5,5,boxWidth,contentY + boxPadding/2,15)
            .setDepth(0);
        titleText.setDepth(10);
    }

    public setPosition(x: number, y: number) {
        this.cameras.main.setViewport(x, y, 3000, 5000);
    }
}