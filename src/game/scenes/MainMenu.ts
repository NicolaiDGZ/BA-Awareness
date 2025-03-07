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
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'backgroundImage');
        this.background.postFX.addVignette(0.5,0.5,0.8,0.45);
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
        this.title.postFX.addShadow();
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
            { text: 'Spielen', scene: 'InfoScreen' },
            { text: 'Steuerung', scene: 'VisitorPass' },
            { text: 'Credits', scene: 'Credits' },
            { text: 'DevTest', scene: 'Indoor' },
            { text: 'DevTestQuiz', scene: 'QuizScene' },
            { text: 'DevTestPhishing', scene: 'SpearPhishingScene' }
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
                if (data.scene === 'Credits') {
                    this.scene.start('InfoScreen', {
                        title: 'Credits',
                        message: 'Spielkonzept, Programmierung & co:\n\nNicolai Diehl\nnicolai.diehl@tuta.io\n\n\n\nAssets:\n\nLimeZu\nhttps://limezu.itch.io/',
                        scene: 'MainMenu'});
                }else if(data.scene === 'InfoScreen'){
                    this.scene.start(data.scene, {
                        title: 'Informationen sammeln',
                        //message: 'Agent, deine Aufgabe: Sammle unauffällig Informationen bei G-Neric Corp. Als Social Engineer setzt du auf Täuschung statt Technik. Finde nützliche Details – ein Name, ein Passwort, ein Badge – alles kann wertvoll sein. Bleib wachsam, agiere clever, und vor allem: Bleib unsichtbar. Viel Erfolg!',
                        message: 'Als geschickter Social Engineer hast du ein klares Ziel: das Unternehmen G-Neric Corp zu infiltrieren. \nDoch der Zugang zum Firmengebäude ist nicht jedem gewährt – doch du bist bereit, jedes Schlupfloch zu finden. \nMit deinem Bus fährst du zum Gebäude, entschlossen, entscheidende Informationen aufzuspüren, die dir den Weg ins Innere ebnen. \n Viel Erfolg!',
                        scene: 'Game'});
                }else{
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