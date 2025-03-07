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

    /**
     * Initializes the InfoScreen scene with provided data.
     * 
     * @param data - An object containing initialization data for the scene.
     * @param data.title - The title to be displayed on the info screen.
     * @param data.message - The main message content to be shown on the info screen.
     * @param data.scene - The name of the scene to transition to after this info screen.
     */
    init(data: { title: string; message: string, scene: string }){
        this.title = data.title;
        this.message = data.message;
        this.followingScene = data.scene;
    }


    

    /**
     * Creates and sets up the InfoScreen scene.
     * This method initializes the visual elements of the InfoScreen, including the background,
     * title text, main message text, and a blinking prompt. It also sets up the input handling
     * for transitioning to the next scene.
     * 
     * @returns {void} This method doesn't return a value.
     */
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
            if(this.followingScene == '#InfoScreen'){
                this.scene.start('InfoScreen', {
                    title: 'Dirty Desk',
                    message: 'Super, Sie haben einen Übergangsausweis gefälscht.\n\nDamit kommen Sie an dem Sicherheitspersonal vorbei ins Bürogebäude.\n\nWelche Informationen können Sie hier finden, die es Ihnen erlaubt eine personalisierte Phishing-Email an einen Mitarbeiter zu senden?',
                    scene: 'Game'});
            }
            else{
                this.scene.start(this.followingScene);
            }
        });
    }

}