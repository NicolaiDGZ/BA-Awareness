import { Scene } from "phaser";
import { sceneManager } from "./components/SceneManager";
import { customEmitter, TASK_EVENTS } from "./components/events";

export class FreeTextScene extends Scene {
    userText = "";
    title: string;
    textArea: any;
    nextButton: import("phaser").GameObjects.Text;
    
    constructor() {
        super({ key: 'FreeTextScene' });
    }
    
    init(data: { text: string, title: string}){
        this.userText = data?.text || "";
        this.title = data.title || 'WIE WÜRDEST DU VORGEHEN?'
    }
    
    create() {
        // Set terminal-style background
        this.cameras.main.setBackgroundColor('#001100');

        // Title
        this.add.text(512, 50, '> ' + this.title, {
            fontFamily: 'Courier New',
            fontSize: '38px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Text 
        const maintext = this.add.text(512, 150, this.userText, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            wordWrap: { width: 780, useAdvancedWrap: true }
        }).setOrigin(0.5);


        this.input.keyboard?.clearCaptures();
        
        // Large Input Field
        this.textArea = this.add.rexInputText(100, maintext.y + maintext.height/2 + 50, 800, 650 - (maintext.y + maintext.height/2 + 50), {
            type: 'textarea',
            placeholder: 'Hier eingeben',
            fontSize: '20px',
            color: '#00ff00',
            backgroundColor: '#001100',
            borderColor: '#00ff00',
            border: 2,
            fontFamily: 'Courier New',
            paddingBottom: '10',
        }).setOrigin(0, 0);

        // Next Scene Button
        this.nextButton = this.add.text(512, 700, '> WEITER', {
            fontFamily: 'Courier New',
            fontSize: '28px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => this.nextButton.setColor('#00ffff'))
        .on('pointerout', () => this.nextButton.setColor('#00ff00'))
        .on('pointerdown', () => {
            console.log('Weiter clicked' + this.textArea.text.length);
            this.nextButton.setVisible(false);
            this.continue(this.textArea.text.length > 20);
        });

        this.tweens.add({
            targets: this.nextButton,
            scale: { from: 0.95, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    private continue(success: boolean) {
        const screenWidth = 1024;
        const screenHeight = 768;
        this.textArea.setVisible(false);
        // Erstelle einen dunklen Hintergrund für die Konsolenmeldung
        const background = this.add.rectangle(
            screenWidth / 2, 
            screenHeight / 2, 
            600, 
            200, 
            0x111111
        ).setStrokeStyle(2, success ? 0x00ff00 : 0xff0000);
    
        const textStyle = { fontSize: '20px', fontFamily: 'monospace', color: '#0f0', wordWrap: { width: 560, useAdvancedWrap: true } };
    
        // Erfolgs- oder Fehlermeldung setzen
        const message = success 
            ? "> Für den Anfang gar nicht so schlecht. \n\n Drücke Enter, um zu erfahren, wie Hackie Chan die Situation löst." 
            : "> Bitte beschreibe deine Gedanken etwas ausführlicher.\n\nDrücke Enter, um fortzufahren";
    
        const resultText = this.add.text(screenWidth / 2 - 280, screenHeight / 2 - 50, message, textStyle);
        const blinkingCursor = this.add.text(screenWidth / 2 - 280, screenHeight / 2, "_", textStyle);
    
        // Blinken der Konsole simulieren
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                blinkingCursor.visible = !blinkingCursor.visible;
            }
        });
    
        // Enter-Taste abfangen
        this.input.keyboard?.once('keydown-ENTER', () => {
            background.destroy();
            resultText.destroy();
            blinkingCursor.destroy();
            this.nextButton.setVisible(true);
            if (success) {
                const nextScene = sceneManager.getNextScene();
                this.scene.start(nextScene?.key, nextScene?.data);
            }
            
            this.textArea.setVisible(true);
        });
    }
}
