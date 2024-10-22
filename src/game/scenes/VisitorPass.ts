import { Scene } from "phaser";
import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { config } from "process";


export class VisitorPass extends Scene {
    constructor() {
        super({ key: 'VisitorPass' });
    }

    preload(){
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }
    
    create() {
        const x = this.createTextInput(100,100,'Name');
        x.style.visibility = 'false';
        //this.scene.rexUI.add.textBox(config);
        //var textBox = new TextBox(scene,config);

    }

    // Hilfsfunktion zum Erstellen von Texteingabefeldern
    createTextInput(x: number, y: number, labelText: string) : HTMLInputElement {
        // Label für das Eingabefeld erstellen
        let label = this.add.text(x, y - 20, labelText, {
            font: '20px Arial',
            color: '#ffffff'
        });

        // HTML-Eingabefeld erstellen
        let input = document.createElement('input');
        input.type = 'text'; // oder 'password', je nachdem
        input.style.position = 'absolute';

        const canvasBounds = this.game.canvas.getBoundingClientRect();


        input.style.left = `${canvasBounds.left + x}px`;
        input.style.top = `${canvasBounds.top + y}px`;

        input.style.backgroundColor = 'transparent';  // Transparenter Hintergrund
        input.style.border = 'none';                  // Keine Umrandung
        input.style.color = 'white';                  // Textfarbe (weiß)
        input.style.fontSize = '24px';                // Schriftgröße größer setzen
        input.style.outline = 'none';                 // Umrandung beim Klicken entfernen
        input.style.width = '200px';                  // Breite des Eingabefelds
        input.style.padding = '10px';                 // Padding innerhalb des Eingabefelds
        input.style.fontFamily = 'Arial';

        // Eingabefeld zum Body hinzufügen
        document.body.appendChild(input);
        return input;
    }

    // Phaser kümmert sich um die Reinigung der HTML-Elemente, wenn die Szene gestoppt wird
    shutdown() {
        document.querySelectorAll('input').forEach(input => {
            input.remove();
        });
    }
}