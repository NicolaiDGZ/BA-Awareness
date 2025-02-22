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

    

    create() {
        // Set terminal-style background
        this.cameras.main.setBackgroundColor('#001100');

        // Title Text
        this.titleText = this.add.text(512, 100, `> ${this.title}`, {
            fontFamily: 'Courier New',
            fontSize: 48,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Main Text
        this.maintext = this.add.text(512, 400, `> ${this.message}`, {
            fontFamily: 'Courier New',
            fontSize: 24,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            align: 'left',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(100);

        // Info text
        this.infotext = this.add.text(512, 650, '[PRESS ENTER]', {
            fontFamily: 'Courier New',
            fontSize: 24,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        // Blinking animation
        this.tweens.add({
            targets: this.infotext,
            alpha: { from: 0.2, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input handling
        const enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        enterKey.on('down', () => {
            this.scene.start(this.followingScene);
        });
    }
}