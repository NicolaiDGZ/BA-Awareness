import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class InfoScreen extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    titleText : Phaser.GameObjects.Text;
    title:string;
    message: string;
    followingScene: string;
    infotext: Phaser.GameObjects.Text;
    maintext: import("phaser").GameObjects.Text;

    constructor ()
    {
        super('InfoScreen');
    }

    init(data: { title: string; message: string, scene: string }){
        this.title = data.title;
        this.message = data.message;
        this.followingScene = data.scene;
    }

    create ()
    {
        console.log("InfoScreen created.");
        this.camera = this.cameras.main
        this.add.rectangle(0,0,1024,768,0x369ea6,1).setOrigin(0,0);
        //Title Text
        this.titleText = this.add.text(512, 100, this.title, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        //Title Box
        const titlerectangle = this.add.graphics()
            .fillStyle(0xe9ddaf, 1)
            .fillRoundedRect(this.titleText.x - this.titleText.width / 2 - 25, this.titleText.y - this.titleText.height / 2 - 25, this.titleText.width + 50, this.titleText.height + 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(this.titleText.x - this.titleText.width / 2 - 25, this.titleText.y - this.titleText.height / 2 - 25, this.titleText.width + 50, this.titleText.height + 50, 15);

        //Main Text
        this.maintext = this.add.text(512, 384, this.message, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center', wordWrap: { width: 800, useAdvancedWrap: true}
        }).setOrigin(0.5).setDepth(100);
        //Main Box
        const mainrectangle = this.add.graphics()
            .fillStyle(0xe9ddaf, 1)
            .fillRoundedRect(this.maintext.x - this.maintext.width / 2 - 25, this.maintext.y - this.maintext.height / 2 - 25, this.maintext.width + 50, this.maintext.height + 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(this.maintext.x - this.maintext.width / 2 - 25, this.maintext.y - this.maintext.height / 2 - 25, this.maintext.width + 50, this.maintext.height + 50, 15);
        //Infotext
        this.infotext = this.add.text(1024/2, 768-50, 'Drücke die Leertaste um Fortzufahern', { font: '24px Arial', color: '#fff' })
        .setDepth(100).setOrigin(0.5);
        //Animation Infotext
        this.tweens.add({
            targets: this.infotext,
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
        //Event
        const spaceBar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => this.scene.start('Game'));
   
    }
}
