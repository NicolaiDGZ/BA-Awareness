import { Scene } from 'phaser';

export class ThankYouScreen extends Scene {
    titleText: Phaser.GameObjects.Text;
    messageText: Phaser.GameObjects.Text;
    evalButton: Phaser.GameObjects.Text;

    constructor() {
        super('ThankYouScreen');
    }

    create() {
        this.cameras.main.setBackgroundColor('#001100');

        // Titeltext
        this.titleText = this.add.text(512, 100, '> DANKE!!', {
            fontFamily: 'Courier New',
            fontSize: 42,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Dankesnachricht
        this.messageText = this.add.text(512, 400,
            'Vielen Dank, dass du dir die Zeit genommen hast, bis zum Ende zu spielen.\n\n' +
            'Ich hoffe es hat dir Spaß gemacht und du konntest etwas mitnehmen.\n\n' +
            'Fülle im Anschluss bitte einen kurzen Evaluationsbogen aus.',
            {
                fontFamily: 'Courier New',
                fontSize: 24,
                color: '#00ff00',
                stroke: '#003300',
                strokeThickness: 2,
                align: 'center',
                wordWrap: { width: 800, useAdvancedWrap: true }
            }
        ).setOrigin(0.5);

        // Evaluationsbutton
        this.evalButton = this.add.text(512, 700, '[ Zur Evaluation ]', {
            fontFamily: 'Courier New',
            fontSize: 28,
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 3
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = 'https://example.com'; // Link zur Evaluation
        })
        .on('pointerover', () => this.evalButton.setColor('#ffffff'))
        .on('pointerout', () => this.evalButton.setColor('#00ff00'));

        // Tween für sanftes Skalieren
        this.tweens.add({
            targets: this.evalButton,
            scale: { from: 1, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

export default ThankYouScreen;
