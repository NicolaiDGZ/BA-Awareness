import { GameObjects, Scene } from 'phaser';

export class MainMenu extends Scene {
    private background: GameObjects.Image;
    private title: GameObjects.Text;
    private buttons: GameObjects.Text[];

    constructor() {
        super('MainMenu');
    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createButtons();
    }

    private createBackground() {
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        this.background.setDisplaySize(this.scale.width, this.scale.height);
    }

    private createTitle() {
        this.title = this.add.text(this.scale.width / 2, 100, 'Main Menu', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.title,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    private createButtons() {
        const buttonData = [
            { text: 'Play', scene: 'Game' },
            { text: 'Controls', scene: 'ControlsScene' },
            { text: 'Credits', scene: 'CreditsScene' }
        ];

        this.buttons = buttonData.map((data, index) => {
            const button = this.add.text(this.scale.width / 2, 250 + index * 100, data.text, {
                fontFamily: 'Arial Black',
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            this.addButtonEffects(button);

            button.on('pointerdown', () => {
                console.log(`${data.text} button clicked`);
                // Only start the Game scene for now
                if (data.scene === 'Game') {
                    this.scene.start(data.scene);
                }
            });

            return button;
        });
    }

    private addButtonEffects(button: GameObjects.Text) {
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: 1.1,
                duration: 100
            });
            button.setStyle({ fill: '#ffff00' });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: 1,
                duration: 100
            });
            button.setStyle({ fill: '#ffffff' });
        });
    }
}