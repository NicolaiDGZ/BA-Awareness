import { Scene } from "phaser";


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
        // Set terminal-style background
        this.cameras.main.setBackgroundColor('#001100');

        // Title
        this.add.text(512, 30, '> MITARBEITERKARTE FÄLSCHEN', {
            fontFamily: 'Courier New',
            fontSize: '38px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5)
            .on('pointerdown', () => this.scene.start('RecapScene'));

        // Keynotes
        this.add.text(100, 60, 
            '> Notizen:\n' +
            '- gefundene Dokumente:  x Besucherausweis     x Bewerbungsunterlagen\n' +
            '- aus dem Gespräch\n  - Mitarbeiter fängt Montag (16.11.2033) an\n  - Aussehen ist Kollegen unbekannt\n' +
            '- weiteres Vorgehen\n  - Mitarbeiterkarte fälschen\n  - sich am Montag als neuer Mitarbeiter ausgeben\n' + 
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

        // Document Options
        const options = ['Visum anzeigen', 'Lebenslauf anzeigen'];
        let yPos = 320;
        
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
            .on('pointerdown', () => this.loadImage(index === 0 ? 'visitor_pass' : 'cv'));

            yPos += 50;
        });

        this.add.text(100, 410, 
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
            placeholder: 'eingabe...',
            fontSize: '20px',
            color: '#00ff00',
            backgroundColor: '#001100',
            borderColor: '#00ff00',
            borderWidth: 2,
            fontFamily: 'Courier New',
            padding: { left: 10, right: 10 }
        };

        const labels = ['Nummer:', 'Nachname:', 'Vorname:', 'E-Mail:', 'Gültig bis:'];
        yPos = 460;
        
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
        }else if(this.inputFields[3].text != 'jonas.federer@pdg.de'){
            //mail wrong
            this.wrongInput(this.WIMail);
            this.WIMail = "Fehler bei der Mail\nHinweis: Schaue nochmal, ob du die Email-Adresse schon irgendwo gefunden hast.";
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
        this.inputFields.forEach(field => field.setVisible(false));
        // Dark overlay
        const overlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setInteractive();

        // Image display
        const image = this.add.image(512, 384, key)
            .setDepth(1);

        // Close button
        const closeButton = this.add.text(512, 650, '> SCHLIEßEN', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => closeButton.setColor('#00ffff'))
        .on('pointerout', () => closeButton.setColor('#00ff00'))
        .on('pointerdown', () => {
            overlay.destroy();
            image.destroy();
            closeButton.destroy();
            this.inputFields.forEach(field => field.setVisible(true));
        });
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

        this.time.delayedCall(3000, () => {
            overlay.destroy();
            errorBox.destroy();
            this.inputFields.forEach(field => field.setVisible(true));
        });
    }

    private nextScene(){
        this.registry.set('canGoIndoor', true);
        this.scene.start('QuizScene');
        this.scene.stop('VisitorPass');
    }
}