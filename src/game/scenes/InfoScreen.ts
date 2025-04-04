import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { sceneManager } from './components/SceneManager';
import { AchievementManager } from './components/AchievementManager';

export class InfoScreen extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    titleText: Phaser.GameObjects.Text;
    title: string;
    message: string;
    infotext: Phaser.GameObjects.Text;
    maintext: Phaser.GameObjects.Text;
    messageParts: string[];
    currentPartIndex: number;

    constructor() {
        super('InfoScreen');
    }

    init(data: { title: string; message: string;}) {
        this.title = data.title;
        this.message = data.message;
        this.messageParts = this.message.split('{break}');
        this.currentPartIndex = 0;
        if(this.title === 'Quiz'){
            AchievementManager.unlockAchievement("learning_1", this);
        }
        if(this.title === 'Quiz'){
            AchievementManager.unlockAchievement("learning_2", this);
        }
    }

    create() {

        // Check if message contains an image pattern
        const imagePattern = /\{image: (.+?)\}/;
        const match = this.message.match(imagePattern);
        console.log(match);
        if (match) {
            const imageKey = match[1]; // Extract the key inside {image: key}

            // Add image to the center of the screen
            this.add.image(this.scale.width / 2, this.scale.height / 2, imageKey).setOrigin(0.5).setDepth(101);
            this.messageParts = [" "];
        }

        this.cameras.main.setBackgroundColor('#001100');
        const scanline = this.add.image(0, 0, 'scanlines').setDepth(200).setAlpha(0.05);
        this.tweens.add({
            targets: scanline,
            alpha: { from: 0.03, to: 0.05 },
            scale: { from: 0.99, to: 1.01 },
            x: { from: -5, to: 0 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });

        this.titleText = this.add.text(50, 100, `> ${this.title}`, {
            fontFamily: 'Courier New',
            fontSize: 42,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0,0.5).setDepth(100);

        this.maintext = this.add.text(50, 140, '', {
            fontFamily: 'Courier New',
            fontSize: 24,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            align: 'left',
            wordWrap: { width: 900, useAdvancedWrap: true }
        }).setOrigin(0, 0).setDepth(100);

        this.infotext = this.add.text(512, 650, '[PRESS ENTER]', {
            fontFamily: 'Courier New',
            fontSize: 24,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        this.displayNextPart();

        const enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        enterKey.on('down', () => this.handleEnterPress());

        this.events.on('shutdown', () => this.shutdown());
    }

    displayNextPart() {
        console.log(`currentPartIndex: ${this.currentPartIndex}
            length: ${this.messageParts.length}`);
        if (this.currentPartIndex < this.messageParts.length) {
    
            // Falls es mehrere Teile gibt, fügen wir sie schrittweise hinzu
            this.maintext.setText(this.maintext.text + this.messageParts[this.currentPartIndex]);
            this.currentPartIndex++;
        } else {
            const nextScene = sceneManager.getNextScene();
            this.scene.start(nextScene?.key, nextScene?.data);
        }
    }
    

    handleEnterPress() {
        this.displayNextPart();
    }

    shutdown() {
        this.input.keyboard?.clearCaptures();
    }
}

export default InfoScreen;
