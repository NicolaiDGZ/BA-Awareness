import { Scene } from "phaser";
import { sceneManager } from "./components/SceneManager";
import { customEmitter, TASK_EVENTS } from "./components/events";
import { AchievementManager } from "./components/AchievementManager";


export class VisitorPass extends Scene {
    WINumber: string = 'Nummer falsch.';
    WIName: string = 'Nachname falsch';
    WIFirstname: string = 'Vorname falsch';
    WIMail: string = 'Mail falsch';
    WIValid: string = 'Datum falsch';
    inputFields: any[] = [];
    constructor() {
        super({ key: 'VisitorPass' });
    }
    
    create() {
        //Visible
        customEmitter.on(TASK_EVENTS.SET_VISIBLE ,() => this.inputFields.forEach(field => field.setVisible(true)));
        // Set terminal-style background
        this.cameras.main.setBackgroundColor('#001100');

        // Title
        this.add.text(512, 50, '> MITARBEITENDENKARTE FÄLSCHEN', {
            fontFamily: 'Courier New',
            fontSize: '38px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5)
            .on('pointerdown', () => this.nextScene());

        // Document Options
        const options = ['Notizen anzeigen','Besucherausweis anzeigen', 'Lebenslauf anzeigen', 'Social Media Post anzeigen'];
        const images = ['notesVisitorPass', 'visitor_pass', 'cv', 'socialMediaPost'];
        let yPos = 130;
        
        options.forEach((option, index) => {
            const optionText = this.add.text(100, yPos, `[ ] ${option}`, {
                fontFamily: 'Courier New',
                fontSize: '24px',
                color: '#00ff00',
                stroke: '#003300',
                strokeThickness: 1,
            })
            .setInteractive()
            .on('pointerover', () => optionText.setText(`[>] ${option}`))
            .on('pointerout', () => optionText.setText(`[ ] ${option}`))
            .on('pointerdown', () => this.loadImage(images[index] || 'nothingtofind'));

            // this.tweens.add({
            //     targets: optionText,
            //     alpha: { from: 0.6, to: 1 },
            //     duration: 800,
            //     yoyo: true,
            //     repeat: -1
            // });

            yPos += 50;
        });

        this.add.text(100, 330, 
            '----------------------------------------------------------------------',
            {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#00ff00',
                stroke: '#003300',
                strokeThickness: 1,
                lineSpacing: 10
            }
        );

        // Input Fields
        const inputConfig = {
            type: 'text',
            placeholder: 'Eingabe...',
            fontSize: '20px',
            color: '#00ff00',
            backgroundColor: '#001100',
            borderColor: '#00ff00',
            borderWidth: 2,
            fontFamily: 'Courier New',
            padding: { left: 10, right: 10 }
        };

        const labels = ['Nummer:', 'Nachname:', 'Vorname:', 'E-Mail:', 'Gültig ab:'];
        yPos = 400;
        
        labels.forEach((label) => {
            this.add.text(100, yPos - 9, label, {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#00ff00'
            });

            const field = this.add.rexInputText(250, yPos, 300, 40, inputConfig)
                .setOrigin(0, 0.5)
                .setText('');
            this.inputFields.push(field);
            
            yPos += 50;
        });

        // Verify Button
        const verifyButton = this.add.text(512, 720, '> ÜBERPRÜFEN', {
            fontFamily: 'Courier New',
            fontSize: '28px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => verifyButton.setColor('#00ffff'))
        .on('pointerout', () => verifyButton.setColor('#00ff00'))
        .on('pointerdown', () => this.confirm());

        this.tweens.add({
            targets: verifyButton,
            scale: { from: 0.95, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    confirm(){
        if(this.inputFields[1].text != 'Federer'){
            //name wrong
            this.wrongInput(this.WIName);
            this.WIName = "Fehler bei dem Nachnamen\nHinweis: Schaue nochmal in die Notizen,\n als welche Person du dich ausgeben möchtest.";
        }else if(this.inputFields[2].text != 'Jonas'){
            //firstname wrong
            this.wrongInput(this.WIFirstname);
            this.WIFirstname = "Fehler bei dem Vornamen\nHinweis: Schaue nochmal in die Notizen,\n als welche Person du dich ausgeben möchtest.";
        }else if(this.inputFields[3].text != 'jonas.federer@g-neric.de'){
            //mail wrong
            this.wrongInput(this.WIMail);
            this.WIMail = "Fehler bei der Mail\nHinweis: Schaue nochmal, ob du eine ähnliche \nUnternehmens-Email-Adresse schon irgendwo gefunden hast.";
        }else if(this.inputFields[4].text != '16.11.2033'){
            //valid wrong
            this.wrongInput(this.WIValid);
            this.WIValid = "Fehler bei dem Datum\nHinweis: Schaue nochmal in den Notizen,\n wann der Mitarbeiter erwartet wird.";
        }else if(this.inputFields[0].text != 'JF-331116' ){
            //number wrong
            this.wrongInput(this.WINumber);
            this.WINumber = "Fehler bei der Nummer\nHinweis: Schaue nochmal in den Besucherausweis,\n wie die Nummer aufgebaut ist.";
        }else{
            //Everything right!!
            this.nextScene();
        }
    }

    private loadImage(key: string) {
        // this.inputFields.forEach(field => field.setVisible(false));
        // // Dark overlay
        // const overlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.8)
        //     .setOrigin(0, 0)
        //     .setInteractive();

        // // Image display
        // const image = this.add.image(512, 384, key)
        //     .setDepth(1);

        // // Close button
        // const closeButton = this.add.text(512, 650, '> SCHLIEßEN', {
        //     fontFamily: 'Courier New',
        //     fontSize: '24px',
        //     color: '#00ff00',
        //     stroke: '#003300',
        //     strokeThickness: 2
        // })
        // .setOrigin(0.5)
        // .setInteractive()
        // .on('pointerover', () => closeButton.setColor('#00ffff'))
        // .on('pointerout', () => closeButton.setColor('#00ff00'))
        // .on('pointerdown', () => {
        //     overlay.destroy();
        //     image.destroy();
        //     closeButton.destroy();
        //     this.inputFields.forEach(field => field.setVisible(true));
        // });
        this.inputFields.forEach(field => field.setVisible(false));
        this.scene.launch("PopupScene", { 
            imageKey: key, 
            imageScale: 1, 
            returnScene: "VisitorPass" 
        });
        this.scene.pause();
    }

    private wrongInput(message: string) {
        this.inputFields.forEach(field => field.setVisible(false));
        const overlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.7)
            .setOrigin(0, 0);

        const errorBox = this.add.text(512, 384, `> FEHLER:\n${message == null? '': message}`, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ff5555',
            stroke: '#330000',
            strokeThickness: 2,
            align: 'center',
            lineSpacing: 15
        })
        .setOrigin(0.5)
        .setDepth(1);

        this.time.delayedCall(5000, () => {
            overlay.destroy();
            errorBox.destroy();
            this.inputFields.forEach(field => field.setVisible(true));
        });
    }

    private nextScene(){
        AchievementManager.unlockAchievement("career_2", this);
        this.registry.set('phase', 1);
        const nextScene = sceneManager.getNextScene();
        this.scene.start(nextScene?.key,nextScene?.data);
    }
}