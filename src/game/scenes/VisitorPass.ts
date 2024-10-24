import { Scene } from "phaser";


export class VisitorPass extends Scene {
    constructor() {
        super({ key: 'VisitorPass' });
    }

    preload(){
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }
    
    create() {
        this.add.image(0,0,'desk').setOrigin(0,0).setDepth(0);
        const config = {
            type: 'text',                // Typ des Eingabefelds
            placeholder: '[Hier tippen]',       // Standardtext
            fontSize: '20px',            // Schriftgröße
            color: '#000000',            // Textfarbe
            backgroundColor: '#FFFFFF7F',  // Hintergrundfarbe
            align: 'left',             // Textausrichtung
            borderRadius: '5px',        // Abgerundete Ecken
            fontFamily: 'Segoe Script',
        };
        const number = this.add.rexInputText(800, 110, 150, 30, config).setOrigin(0,0);
        const name = this.add.rexInputText(800,110 + 1 * 38,150,30,config).setOrigin(0,0);
        const firstname = this.add.rexInputText(800,110 + 2 * 38,150,30,config).setOrigin(0,0);
        const mail = this.add.rexInputText(800,110 + 3 * 38,150,30,config).setOrigin(0,0);
        const valid = this.add.rexInputText(800,110 + 4 * 38,150,30,config).setOrigin(0,0);

        const vpbutton = this.add.rectangle(500,325,500,100).setOrigin(0,0).setInteractive({ useHandCursor: true });
        const cvbutton = this.add.rectangle(500,442,500,100).setOrigin(0,0).setInteractive({ useHandCursor: true });
        const confirmbutton = this.add.rectangle(500,630,500,100).setOrigin(0,0).setInteractive({ useHandCursor: true });

        vpbutton.on('pointerdown',() => this.loadImage('visitor_pass'));
        cvbutton.on('pointerdown',() => this.loadImage('cv'));
        confirmbutton.on('pointerdown',() => this.confirm(number.text,name.text,firstname.text,mail.text,valid.text));
    }

    confirm(number:string,name:string,firstname:string,mail:string,valid:string){
        if(number != 'JF-331116' ){
            //number wrong
            this.wrongInput(" der Nummer");
        }else if(name != 'Federer'){
            //name wrong
            this.wrongInput(" dem Nachnamen");
        }else if(firstname != 'Jonas'){
            //firstname wrong
            this.wrongInput(" dem Vornamen");
        }else if(mail != 'jonas.federer@pdg.de'){
            //mail wrong
            this.wrongInput(" der Mail");
        }else if(valid != '16.11.2033'){
            //valid wrong
            this.wrongInput(" dem Datum");
        }else{
            //Everything right!!
            console.log('All right')
            this.wrongInput(" keinem Element. Alles richtig!! Glückwunsch.")
        }
    }

    loadImage(key: string){
        // Hintergrund erstellen
        const background = this.add.rectangle(0, 0, 1024, 768, 0x0, 0.3).setOrigin(0, 0);
        
        // Bild in der Mitte anzeigen
        const image = this.add.image(1024 / 2, 768 / 2, key);
    
        // Button-Koordinaten berechnen (unterhalb des Bildes)
        const buttonx = image.x - 80; // Zentriere den Button horizontal, daher -50
        const buttony = image.y + image.height / 2 + 50; // 50px unter dem Bild
    
        // Graphics-Objekt für den Button erstellen
        const closeButton = this.add.graphics()
            .fillStyle(0xFF5252, 1)
            .fillRoundedRect(buttonx, buttony, 160, 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(buttonx, buttony, 160, 50, 15);
    
        // Button-Text hinzufügen und zentrieren
        const buttonText = this.add.text(buttonx + 80, buttony + 25, 'Schließen', {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5, 0.5);
    
        // Add fake rectangele
        const buttonContainer = this.add.rectangle(buttonx,buttony,160,50).setOrigin(0,0).setInteractive({ useHandCursor: true });
        // Button Klick-Event
        buttonContainer.on('pointerdown', () => {
            console.log("Close Button Clicked")
            image.setVisible(false);
            image.destroy();
            background.setVisible(false);
            background.destroy()
            buttonContainer.setVisible(false);
            buttonText.setVisible(false);
            closeButton.setVisible(false);
            closeButton.destroy();
            buttonContainer.destroy();
            buttonText.destroy();
        });
    }

    wrongInput(input: string){
        // Hintergrund erstellen
        const background = this.add.rectangle(0, 0, 1024, 768, 0x0, 0.3).setOrigin(0, 0);
        const middlex = 1024/2;
        const middley = 768/2;

        const infotext = this.add.text(middlex, middley, 'Fehler bei' + input, {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5, 0.5).setDepth(2);

        // Graphics-Objekt für den Button erstellen
        const rectangle = this.add.graphics()
            .fillStyle(0xFF5252, 1)
            .fillRoundedRect(middlex - infotext.width / 2 - 25, middley - 25, infotext.width + 50, 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(middlex - infotext.width /2 - 25, middley - 25, infotext.width + 50, 50, 15);
    
        // Button-Text hinzufügen und zentrieren
        
    
        // Button Klick-Event
        this.time.delayedCall(3000, () => {
            console.log("Close Button Clicked")
            background.setVisible(false);
            background.destroy()
            infotext.setVisible(false);
            rectangle.setVisible(false);
            rectangle.destroy();
            infotext.destroy();
        });
    }
}