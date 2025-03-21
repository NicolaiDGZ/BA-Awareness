import { sceneManager } from "./components/SceneManager";

export class SpearPhishingScene extends Phaser.Scene {
    private leftColumnSnippets: Phaser.GameObjects.Text[] = [];
    private rightColumnSnippets: Phaser.GameObjects.Text[] = [];

    constructor() {
        super({ key: 'SpearPhishingScene' });
    }

    preload() {
        // Icons laden
        this.load.image('check', 'assets/check.png');
        this.load.image('cross', 'assets/cross.png');
        this.load.image('arrow', 'assets/arrow.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#001100');
        const scanline = this.add.image(0,0,'scanlines').setDepth(200).setAlpha(0.05);
        this.tweens.add({
            targets: scanline,
            alpha: { from: 0.01, to: 0.02 },
            scale: { from: 0.99, to: 1.01 },
            x: { from: -5, to: 0 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });


        const screenWidth = 1024;
        const screenHeight = 768;
        //this.cameras.main.setBackgroundColor('#000000');
        const textStyle = { fontSize: '16px', fontFamily: 'monospace', color: '#0f0' };
        
        // Email-Editor Container
        const emailBox = this.add.rectangle(
            screenWidth/2, 
            screenHeight/2, 
            400, 
            700,
            0x111111
        ).setStrokeStyle(2, 0x00ff00);
        
        this.add.text(
            screenWidth/2, 
            80, 
            'Email-Editor', 
            { ...textStyle, fontSize: '32px' }
        ).setOrigin(0.5);
        // Drop-Zones definieren
        const zones = [
            { name: 'Von:', x: screenWidth/2, y: 120, height: 30, single: true },
            { name: 'An:', x: screenWidth/2, y: 170, height: 30, single: true },
            { name: 'Betreff:', x: screenWidth/2, y: 220, height: 30, single: true },
            { name: '', x: screenWidth/2, y: 270, height: 400, single: false }
        ];
        const zoneWidth = 350;
        zones.forEach(zone => {
            const dropZone = this.add.zone(zone.x, zone.y + zone.height/2, zoneWidth, zone.height)
                .setRectangleDropZone(500, zone.height);
            this.add.rectangle(zone.x - zoneWidth/2, zone.y, zoneWidth, zone.height, 0x222222)
                .setStrokeStyle(2, 0x00ff00).setOrigin(0);
            this.add.text(zone.x - zoneWidth /2 + 5, zone.y+5, zone.name, { ...textStyle, fontSize: '18px' });
            dropZone.setData('snippets', []);
            dropZone.setData('single', zone.single);
            switch(zone.name){
                case 'Von:':{
                    dropZone.setData('name','from');
                    break;
                }
                case 'An:':{
                    dropZone.setData('name','to');
                    break;
                }
                case 'Betreff:':{
                    dropZone.setData('name','subject');
                    break;
                }
                case '':{
                    dropZone.setData('name','content');
                    break;
                }
            }
        });

        // Snippets erstellen
        const phase = this.registry.get('phase');
        let snippets = [{ text: 'hans.dull@g-neric.de', column: 'right' ,position:-1, points:-1, zone: 'to'}];
        if(phase == 2){
            snippets = [
                { text: 'hans.dull@g-neric.de', column: 'right' ,position:-1, points:-1, zone: 'to'},
                { text: 'diktat@g-neric.de', column: 'right', position:-1, points:-10, zone: 'to'},
                { text: 'wettbewerb@stadtplanung.nrw', column: 'right' ,position:0, points:10, zone: 'from'},
                { text: 'wettbewerb@photo.de-xyz.ru', column: 'right',position:-1, points:-10, zone: 'from' },
                { text: 'dominik.diktat@g-neric.de', column: 'right' ,position:0, points:15, zone: 'to'},
                { text: 'Einladung Fotowettbewerb \'33', column: 'left' ,position:0, points:10, zone: 'subject'},
                { text: 'Anmeldeschluss ist der 21.11.33.', column: 'right',position:8, points:5, zone: 'content' },
                { text: 'Senden Sie Ihre Bankdaten.', column: 'right',position:-1, points:-10, zone: 'content' },
                { text: 'Ihr Zugang läuft ab. Erneuern?', column: 'right',position:-1, points:-10, zone: 'content' },
                { text: 'Bitte senden Sie uns Ihr Passwort.', column: 'left' ,position:-1, points:-10, zone: 'content'},
                { text: 'Wir freuen uns auf Ihre Teilnahme.', column: 'left' ,position:9, points:10, zone: 'content'},
                { text: 'Jetzt hier klicken für Preis!', column: 'right' ,position:-1, points:-10, zone: 'content'},
                { text: '2028 laden wir Sie ein zum:', column: 'left' ,position:2, points:10, zone: 'content'},
                { text: 'Sie haben 1 Milion gewonnen!', column: 'left',position:-1, points:-15, zone: 'content' },
                { text: '📎Anmeldeformular.pdf', column: 'left' ,position:11, points:10, zone: 'content'},
                { text: 'Ihr Konto wurde gespertt!', column: 'left' ,position:-1, points:-5, zone: 'content'},
                { text: 'Sehr geehrter Herr Diktat,', column: 'right' ,position:0, points:15, zone: 'content'},
                { text: 'als Gewinner des Fotowettbewerbs', column: 'right',position:1, points:5, zone: 'content' },
                { text: 'Zu Gewinnen gibt es dieses Jahr:', column: 'left' ,position:4, points:10, zone: 'content'},
                { text: 'Zur Anmeldung schicken Sie bitte', column: 'right' ,position:6, points:-5, zone: 'content'},
                { text: 'Wir freuen uns auf deine Teilname.', column: 'left' ,position:-1, points:-15, zone: 'content'},
                { text: 'Team Öffentlichkeitsarbeit NRW', column: 'right' ,position:10, points:5, zone: 'content'},
                { text: 'Singles in Ihrer Nähe', column: 'left', position: -1, points:-10, zone: 'content'},
                { text: 'Fotowettbewerb Architektur 2033.', column: 'left' ,position:3, points:5, zone: 'content'},
                { text: 'das Formular im Anhang zurück.', column: 'left',position:7, points: -5, zone: 'content' },
                { text: 'Ein Objektiv der Marke Nonac!', column: 'left',position:5, points:10, zone: 'content' },
            ];
        }else{
            snippets = [
                { text: 'hans.dull@g-neric.de', column: 'right' ,position:0, points:-1, zone: 'to'},
                { text: 'tina.tippt@g-neric.de', column: 'right', position:-1, points:-10, zone: 'to'},
                { text: 'dominik.diktat@g-neric.de', column: 'right' ,position:0, points:10, zone: 'from'},
                { text: 'mirian.günter@g-neric.de', column: 'right',position:-1, points:-10, zone: 'from' },
                { text: 'Wichtig: Server-Update', column: 'left' ,position:0, points:15, zone: 'subject'},
                { text: 'Meeting 12 Uhr', column: 'left' ,position:-1, points:10, zone: 'subject'},
                { text: 'Melde dich bitte ASAP', column: 'right',position:9, points:5, zone: 'content' },
                { text: '"IT-Spezialist Breite"', column: 'right',position:-1, points:-10, zone: 'content' },
                { text: 'Techniker der Firma', column: 'right',position:3, points:-10, zone: 'content' },
                { text: '"admin" jetzt direkt.', column: 'left' ,position:-1, points:-10, zone: 'content'},
                { text: 'aufkommen, brauche ich', column: 'left' ,position:6, points:10, zone: 'content'},
                { text: 'Hallo Tina,', column: 'right' ,position:-1, points:-10, zone: 'content'},
                { text: 'wie du ja weißt, kommt', column: 'left' ,position:1, points:10, zone: 'content'},
                { text: 'LG Tina Tippt', column: 'left',position:-1, points:-15, zone: 'content' },
                { text: '📎ServerPasswort', column: 'left' ,position:-1, points:10, zone: 'content'},
                { text: 'das Passwort des Accounts', column: 'left' ,position:7, points:-5, zone: 'content'},
                { text: 'Sehr geehrter Herr Diktat,', column: 'right' ,position:-1, points:15, zone: 'content'},
                { text: 'schon morgen der', column: 'right',position:2, points:5, zone: 'content' },
                { text: '"GenericCorpMainServer".', column: 'left' ,position:8, points:10, zone: 'content'},
                { text: 'Virus-Warnung!', column: 'right' ,position:-1, points:-5, zone: 'content'},
                { text: 'Hallo Hans,', column: 'left' ,position:0, points:-15, zone: 'content'},
                { text: '"MainServerGenericCorp"', column: 'right' ,position:-1, points:5, zone: 'content'},
                { text: 'Damit keine Probleme', column: 'left', position: 5, points:-10, zone: 'content'},
                { text: '"Band & Breite GmbH"', column: 'left' ,position:-1, points:5, zone: 'content'},
                { text: '"Security made Easy".', column: 'left',position:4, points: -5, zone: 'content' },
                { text: 'LG Dominik Diktat', column: 'right',position:10, points:10, zone: 'content' },
            ];
        }
        

        // Snippets in den Spalten positionieren
        let leftIndex = 0;
        let rightIndex = 0;
        
        snippets.forEach(snippet => {
            const columnX = snippet.column === 'left' ? 150 : screenWidth - 150;
            const columnYStart = 100;
            const yPos = columnYStart + (snippet.column === 'left' ? leftIndex : rightIndex) * 50;
            
            const textObj = this.add.text(columnX, yPos, snippet.text, textStyle)
                .setInteractive()
                .setOrigin(0.5, 0.5)
                .setBackgroundColor('#222222')
                .setData({
                    originalColumn: snippet.column,
                    columnIndex: snippet.column === 'left' ? leftIndex : rightIndex,
                    points: snippet.points,
                    position: snippet.position,
                    zone: snippet.zone
                });
            
            if (snippet.column === 'left') {
                this.leftColumnSnippets.push(textObj);
                leftIndex++;
            } else {
                this.rightColumnSnippets.push(textObj);
                rightIndex++;
            }
            
            this.input.setDraggable(textObj);
        });

        // Input-Handling
        this.input.on('drag', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer: any, gameObject: any, dropped: boolean) => {
            if (!dropped) {
                this.returnToColumn(gameObject);
                gameObject.setBackgroundColor('#222222');
            }
        });

        this.input.on('drop', (_pointer: any, gameObject: any, dropZone: any) => {
            const snippetsInZone = dropZone.getData('snippets');
            const isSingle = dropZone.getData('single');
            gameObject.setBackgroundColor('#222222');
            if (isSingle && snippetsInZone.length > 0) { //Single zone already full
                this.returnToColumn(gameObject);
                return;
            }

            const currentZone = gameObject.getData('currentZone');
            if (currentZone) { //deleting from old zone
                const currentSnippets = currentZone.getData('snippets').filter((s: any) => s !== gameObject);
                currentZone.setData('snippets', currentSnippets);
                this.arrangeSnippets(currentZone);
                const icon = currentZone.getData('icon-' + gameObject.text);
                if (icon) {
                    icon.destroy();
                }
            }

            gameObject.setData('currentZone', dropZone);
            dropZone.setData('snippets', [...snippetsInZone, gameObject]);
            this.arrangeSnippets(dropZone);
            // Icon hinzufügen
            this.addIcon(gameObject, dropZone);
        });

        // Position der Buttons basierend auf der letzten DropZone
        const buttonY = 685; // Unterhalb der letzten DropZone (270 + 400/2 + etwas Abstand)
        const dropdownX = 335;
        const openButtonX = 560;
        const sendButtonX = 650;

        // Send-Button
        const sendButton = this.add.text(sendButtonX, buttonY + 15, '[SEND]', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#f00',
        }).setPadding(10).setInteractive().setOrigin(0.5);

        sendButton.on('pointerdown', () => {
            this.evaluate();
        });
        sendButton.on('pointerover', () => {
            this.tweens.add({ targets: sendButton, scale: 1.1, duration: 100 });
        });
        sendButton.on('pointerout', () => {
            this.tweens.add({ targets: sendButton, scale: 1, duration: 100 });
        });
        
        this.createDropdownMenu(dropdownX, buttonY, openButtonX);
        this.createHelpButton();
    }
    createHelpButton() {
        const textStyle = { fontSize: '24px', fontFamily: 'monospace', color: '#f00'};
        let helpText = this.add.text(665,50,'[HELP]',textStyle).setInteractive().setOrigin(0.5);
        helpText.on('pointerdown', () => {
            const screenWidth = 1024;
            const screenHeight = 768;
        
            // Erstelle einen dunklen Hintergrund für die Konsolenmeldung
            const background = this.add.rectangle(
                screenWidth / 2, 
                screenHeight / 2, 
                600, 
                350, 
                0x111111
            ).setStrokeStyle(2, 0x00ff00);
        
            const textStyle = { fontSize: '20px', fontFamily: 'monospace', color: '#0f0', wordWrap: { width: 560, useAdvancedWrap: true } };
        
            // Erfolgs- oder Fehlermeldung setzen
            const phase = this.registry.get('phase');
            
            const message = phase==2 ? 'Ziehe die Textbausteine in die entsprechenden Felder. \n\nStruktur der Nachricht:\nBegrüßung, "Wissensabgleich", Aufforderung, Nachdruck, Verabschiedung.\n\nGrüner Haken: richtige Position, gelber Pfeil: falsche Position, rotes Kreuz: falsch\n\nDu kannst dir die gefundenen Dokumente über die Auswahl im unteren Bereich erneut anzeigen lassen. \n\n Drücke [Enter] zum Verlassen' : 'Ziehe die Textbausteine in die entsprechenden Felder. \n\nStruktur der Nachricht:\nBegrüßung, Einladung, Preis, Anmeldung, Verabschiedung, Anhang.\n\nGrüner Haken: richtige Position, gelber Pfeil: falsche Position, rotes Kreuz: falsch\n\nDu kannst dir die gefundenen Dokumente über die Auswahl im unteren Bereich erneut anzeigen lassen. \n\n Drücke [Enter] zum Verlassen';
        
            const resultText = this.add.text(screenWidth / 2 - 280, screenHeight / 2 - 160, message, textStyle);
            const blinkingCursor = this.add.text(screenWidth / 2 - 280, screenHeight / 2 + 130, "_", textStyle);
        
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
            });
        });
        helpText.on('pointerover', () => {
            this.tweens.add({ targets: helpText, scale: 1.1, duration: 100 });
        });
        helpText.on('pointerout', () => {
            this.tweens.add({ targets: helpText, scale: 1, duration: 100 });
        });
        
    }

    createDropdownMenu(dropdownX: number, buttonY: number, openButtonX: number) {
        const options = [
            { text: 'Architekturband', key: 'architecture', scale: 0.5 },
            { text: 'Notiz Server 1', key: 'serverName', scale: 1.5 },
            { text: 'Notiz Server 2', key: 'serverNote', scale: 1.5 },
            { text: 'Sudoku', key: 'sudoku', scale: 0.5 },
            { text: 'Foto Urkunde', key: 'photoCertificate', scale: 0.22 },
            { text: 'Bildschirm Vorgesetzter', key: 'cameraShop', scale: 0.8 },
            { text: 'Organigramm', key: 'organigramm', scale: 0.8 },
            { text: 'Kreuzworträtsel', key: 'crossword', scale: 0.75 },
            { text: 'Sommerfest', key: 'summerparty', scale: 0.3 },
            { text: 'Besucherliste', key: 'visitorlist', scale: 0.8 },
        ];
    
        let selectedKey = options[0].key;
        let scale = options[0].scale;
        
        const dropdownWidth = 175;
        const dropdown = this.add.text(dropdownX, buttonY, options[0].text, {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#0f0',
            backgroundColor: '#222',
            wordWrap: { width: dropdownWidth - 30, useAdvancedWrap: true },
            lineSpacing: 20
        }).setPadding(5).setFixedSize(dropdownWidth, 30).setInteractive();
        
        const arrow = this.add.text(dropdownX + dropdownWidth - 15, buttonY + 15, '▼', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#f00',
            backgroundColor: '#222'
        }).setOrigin(0.5, 0.5);
        
        const dropdownOptions: Phaser.GameObjects.Text[] = [];
    
        dropdown.on('pointerdown', () => {
            dropdownOptions.forEach(option => option.setVisible(!option.visible));
        });
    
        options.forEach((option, index) => {
            const optionText = this.add.text(dropdownX, buttonY - (index + 1) * 32, option.text, {
                fontSize: '16px',
                fontFamily: 'monospace',
                color: '#0f0',
                backgroundColor: '#333',
                wordWrap: { width: dropdownWidth - 20, useAdvancedWrap: true },
                lineSpacing:20
            }).setPadding(5).setFixedSize(dropdownWidth, 30).setInteractive().setVisible(false);
    
            optionText.on('pointerdown', () => {
                scale = option.scale;
                selectedKey = option.key;
                dropdown.setText(option.text);
                dropdownOptions.forEach(opt => opt.setVisible(false));
            });
    
            dropdownOptions.push(optionText);
        });
    
        const openButton = this.add.text(openButtonX, buttonY + 15, '[OPEN]', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#f00',
        }).setInteractive().setOrigin(0.5);
    
        openButton.on('pointerdown', () => {
            console.log('Launching Scene ' + selectedKey);
            this.scene.launch("PopupScene", { 
                imageKey: selectedKey, 
                imageScale: scale, 
                returnScene: "SpearPhishingScene" 
            });
            this.scene.bringToTop('PopupScene');
            this.scene.pause();
        });
        openButton.on('pointerover', () => {
            this.tweens.add({ targets: openButton, scale: 1.1, duration: 100 });
        });
        openButton.on('pointerout', () => {
            this.tweens.add({ targets: openButton, scale: 1, duration: 100 });
        });
    }
    
    

    private returnToColumn(gameObject: any) {
        const column = gameObject.getData('originalColumn');
        const index = gameObject.getData('columnIndex');
        const columnX = column === 'left' ? 150 : 874;
        const columnYStart = 100;
        const previousZone = gameObject.getData('currentZone');

        if (previousZone) {
            const prevSnippets = previousZone.getData('snippets')
                .filter((s: any) => s !== gameObject);
            previousZone.setData('snippets', prevSnippets);
            this.arrangeSnippets(previousZone);
            // Icon entfernen
            const icon = previousZone.getData('icon-' + gameObject.text);
            if (icon) {
                icon.destroy();
            }
        }

        gameObject.x = columnX;
        gameObject.y = columnYStart + index * 50;
        gameObject.setData('currentZone', null);
    }

    evaluate() {
        let isCorrect = true;
    
        // Erwartete Snippets nach Zone gruppieren
        const expectedSnippets: Record<string, string[]> = {};
        this.children.list.forEach((child: any) => {
            if (child instanceof Phaser.GameObjects.Text) {
                const zoneName = child.getData('zone');
                const position = child.getData('position');
                if(position >= 0){
                    if (!expectedSnippets[zoneName]) {
                        expectedSnippets[zoneName] = [];
                    }
                    expectedSnippets[zoneName].push(child.text);
                }
                
            }
        });
    
        // Durch alle Drop-Zonen iterieren
        this.children.list.forEach((child: any) => {
            if (child instanceof Phaser.GameObjects.Zone) {
                const zoneName = child.getData('name');
                const snippets = child.getData('snippets').map((s: any) => s.text);
                const isSingle = child.getData('single');

                console.log(zoneName + ' | ' + snippets.length + ' | ' + expectedSnippets[zoneName].length)
                if(snippets.length != expectedSnippets[zoneName].length) isCorrect = false;
    
                // Prüfen, ob alle erwarteten Snippets in der Zone sind
                if (expectedSnippets[zoneName]) {
                    const missingSnippets = expectedSnippets[zoneName].filter(sn => !snippets.includes(sn));
                    console.log(missingSnippets);
                    if (missingSnippets.length > 0) {
                        isCorrect = false;
                    }
                }
            }
        });
    
        console.log(`Bewertung abgeschlossen.`);
        console.log(`Ergebnis: ${isCorrect ? 'Richtig' : 'Falsch'}`);
       this.showEvaluationResult(isCorrect);
    }

    private showEvaluationResult(success: boolean) {
        const screenWidth = 1024;
        const screenHeight = 768;
    
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
            ? "> Das sieht täuschend echt aus! Drücke ENTER, um fortzufahren." 
            : "> Das wirkt noch nicht plausibel! Drücke ENTER, um an der Mail weiter zu arbeitem.";
    
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
    
            if (success) {
                const nextScene = sceneManager.getNextScene();
                this.scene.start(nextScene?.key, nextScene?.data);
            }
        });
    }
    
    
    

    private arrangeSnippets(zone: any) {
        const snippets = zone.getData('snippets');
        const isSingle = zone.getData('single');
        const startY = zone.y - (zone.height/2) + 15;

        snippets.forEach((snippet: any, index: number) => {
            if (isSingle) {
                snippet.x = zone.x  + zone.width/2-5 - snippet.width/2;
                snippet.y = zone.y;
            } else {
                snippet.x = zone.x - zone.width/2+5 + snippet.width/2 + 30;
                snippet.y = startY + (index * 30);
            }
        });
    }

    private addIcon(snippet: any, dropZone: any) {
        const position = snippet.getData('position');
        const zone = snippet.getData('zone');
        let iconKey = '';
        let offsetX = 15;
        const isSingle = dropZone.getData('single');
        if (position === -1) {
            iconKey = 'cross';
        } else if (snippet.getData('zone') === dropZone.getData('name')) {
            if (position === dropZone.getData('snippets').indexOf(snippet)) {
                iconKey = 'check';
            } else {
                iconKey = 'arrow';
            }
        } else {
            iconKey = 'cross';
        }

        if (iconKey && !isSingle) {
            const icon = this.add.image(dropZone.x - dropZone.width / 2 + offsetX, snippet.y, iconKey)
                .setOrigin(0.5, 0.5).setScale(0.8);
            dropZone.setData('icon-' + snippet.text, icon);
        }else if(isSingle && iconKey == 'cross'){
            snippet.setBackgroundColor('#ff4141');
            
        }
    }
}