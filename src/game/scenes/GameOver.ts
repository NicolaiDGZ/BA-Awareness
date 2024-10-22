import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    title:string;
    message: string;
    followingScene: string;
    infotext: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    init(data: { title: string; message: string, scene: string }){
        this.title = data.title;
        this.message = data.message;
        this.followingScene = data.scene;
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 100, this.title, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(512, 384, this.message, {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center', wordWrap: { width: 800, useAdvancedWrap: true}
        }).setOrigin(0.5).setDepth(100);

        this.infotext = this.add.text(1024/2, 768-50, 'Drücke die Leertaste um Fortzufahern', { font: '24px Arial', color: '#fff' })
        .setDepth(100).setOrigin(0.5);

        this.tweens.add({
            targets: this.infotext,
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        const spaceBar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => this.scene.start('Game'));

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
