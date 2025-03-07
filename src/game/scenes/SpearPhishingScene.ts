import Phaser from 'phaser';

export class SpearPhishingScene extends Phaser.Scene {
    private leftColumnSnippets: Phaser.GameObjects.Text[] = [];
    private rightColumnSnippets: Phaser.GameObjects.Text[] = [];
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private snippets: Phaser.GameObjects.Text[] = [];

    constructor() {
        super({ key: 'SpearPhishingScene' });
    }

    preload() {
        // Load assets if necessary
    }

    create() {
        const screenWidth = 1024;
        const screenHeight = 768;
        this.cameras.main.setBackgroundColor('#000000');
        const textStyle = { fontSize: '16px', fontFamily: 'monospace', color: '#0f0' };
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, { fontSize: '20px', fontFamily: 'monospace', color: '#fff' });
        // Create email editor container
        const emailBox = this.add.rectangle(
            screenWidth/2, 
            screenHeight/2, 
            400, 
            700,
            0x111111
        ).setStrokeStyle(2, 0x00ff00);
        
        this.add.text(
            screenWidth/2, 
            60, 
            'Email-Editor', 
            { ...textStyle, fontSize: '24px' }
        ).setOrigin(0.5);

        this.add.text(
            screenWidth/2, 
            85, 
            '(Ziehen Sie die Elemente in die Felder.)', 
            { ...textStyle, fontSize: '14px' }
        ).setOrigin(0.5);

        // Define drop zones with more spacing
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

        // Create draggable email snippets in columns
        const snippets = [
            { text: 'hans.dull@g-neric.de', column: 'right' ,position:-1, points:-1, zone: 'to'},
            { text: 'diktat@g-neric.de', column: 'right', position:-1, points:-10, zone: 'to'},
            { text: 'wettbewerb@stadtplanung.nrw', column: 'right' ,position:0, points:10, zone: 'from'},
            { text: 'wettbewerb@photo.de-xyz.ru', column: 'right',position:-1, points:-10, zone: 'from' },
            { text: 'dominik.diktat@g-neric.de', column: 'right' ,position:0, points:15, zone: 'to'},
            { text: 'Einladung Fotowettbewerb \'33', column: 'left' ,position:0, points:10, zone: 'subject'},
            { text: 'Anmeldeschluss ist der 21.11.33.', column: 'right',position:7, points:5, zone: 'content' },
            { text: 'Senden Sie Ihre Bankdaten.', column: 'right',position:-1, points:-10, zone: 'content' },
            { text: 'Ihr Zugang läuft ab. Erneuern?', column: 'right',papositionir:-1, points:-10, zone: 'content' },
            { text: 'Bitte senden Sie uns Ihr Passwort.', column: 'left' ,position:-1, points:-10, zone: 'content'},
            { text: 'Wir freuen uns auf Ihre Teilnahme.', column: 'left' ,position:8, points:10, zone: 'content'},
            { text: 'Jetzt hier klicken für Preis!', column: 'right' ,position:-1, points:-10, zone: 'content'},
            { text: '2028 laden wir Sie ein zum:', column: 'left' ,position:2, points:10, zone: 'content'},
            { text: 'Sie haben 1 Milion gewonnen!', column: 'left',position:-1, points:-15, zone: 'content' },
            { text: '📎Anmeldeformular.pdf', column: 'left' ,position:11, points:10, zone: 'content'},
            { text: 'Ihr Konto wurde gespertt!', column: 'left' ,position:-1, points:-5, zone: 'content'},
            { text: 'Sehr geehrter Herr Diktat,', column: 'right' ,position:0, points:15, zone: 'content'},
            { text: 'als Gewinner des Fotowettbewerbs', column: 'right',position:1, points:5, zone: 'content' },
            { text: 'Zu Gewinnen gibt es dieses Jahr:', column: 'left' ,position:4, points:10, zone: 'content'},
            { text: 'Zur Anmeldung schicken Sie bitte', column: 'right' ,position:5, points:-5, zone: 'content'},
            { text: 'Wir freuen uns auf deine Teilname.', column: 'left' ,position:-1, points:-15, zone: 'content'},
            { text: 'Team Öffentlichkeitsarbeit NRW', column: 'right' ,position:10, points:5, zone: 'content'},
            { text: 'Singles in Ihrer Nähe', column: 'left', position: -1, points:-10, zone: 'content'},
            { text: 'Fotowettbewerb Architektur 2033.', column: 'left' ,position:3, points:5, zone: 'content'},
            { text: 'das Formular im Anhang zurück.', column: 'left',position:6, points: -5, zone: 'content' },
            { text: 'Ein Objektiv der Marke Nonac!', column: 'left',position:5, points:10, zone: 'content' },
            
        ];

        // Position snippets dynamically in columns with separate indices
        let leftIndex = 0;
        let rightIndex = 0;
        
        snippets.forEach(snippet => {
            const columnX = snippet.column === 'left' ? 150 : screenWidth - 150;
            const columnYStart = 100;
            const yPos = columnYStart + (snippet.column === 'left' ? leftIndex : rightIndex) * 50;
            
            const textObj = this.add.text(columnX, yPos, snippet.text, textStyle)
                .setInteractive()
                .setOrigin(0.5, 0.5)
                .setBackgroundColor('#49524b');
            
            textObj.setData({
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

        // Input handlers
        this.input.on('drag', (pointer: any, gameObject: any, dragX: any, dragY: any) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer: any, gameObject: any, dropped: boolean) => {
            if (!dropped) {
                this.updateSnippetBackgroundColor(gameObject, null);
                this.returnToColumn(gameObject);
            }
        });

        this.input.on('drop', (_pointer: any, gameObject: any, dropZone: any) => {
            const snippets = dropZone.getData('snippets');
            const isSingle = dropZone.getData('single');
            const previousZone = gameObject.getData('currentZone');
            
            if (isSingle && snippets.length > 0) {
                this.returnToColumn(gameObject);
                return;
            }
            
            if (previousZone) {
                const prevSnippets = previousZone.getData('snippets').filter((s: any) => s !== gameObject);
                previousZone.setData('snippets', prevSnippets);
                this.arrangeSnippets(previousZone);
                const points = gameObject.getData('points'); // Get the points of the dropped snippet
                if(gameObject.getData('zone') == gameObject.getData('currentZone')){
                    this.score += points;
                }else{
                    this.score -= points;
                }
                console.log(gameObject.getData('zone') + gameObject.getData('currentZone'));
                this.scoreText.setText(`Score: ${this.score}`);
                this.returnToColumn(gameObject);
            }
            
            gameObject.setData('currentZone', dropZone);
            dropZone.data.values.snippets.push(gameObject);
            this.arrangeSnippets(dropZone);
            //Scoring
            const points = gameObject.getData('points'); // Get the points of the dropped snippet
            console.log(gameObject.getData('zone'));
            if(gameObject.getData('zone') == dropZone.getData('name')){
                this.score += points;
            }else{
                this.score -= points;
            }
            this.scoreText.setText(`Score: ${this.score}`);
            this.updateSnippetBackgroundColor(gameObject, dropZone);
        });

        // Send button
        const sendButton = this.add.text(512, 700, '[ SEND ]', 
            { ...textStyle, color: '#f00', fontSize: '24px' })
            .setOrigin(0.5, 0.5)
            .setInteractive();
        sendButton.on('pointerdown', () => {
            console.log('Email Sent!');
        });
    }

    /**
     * Returns a game object to its original column position.
     * 
     * This function is responsible for moving a draggable game object back to its
     * initial position in either the left or right column. It also handles updating
     * the previous drop zone if the object was previously placed in one.
     *
     * @param gameObject - The game object to be returned to its column.
     *                     Expected to have methods getData(), setData(), and properties x, y.
     * 
     * @returns void This function doesn't return a value.
     */
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
        }

        gameObject.x = columnX;
        gameObject.y = columnYStart + index * 50;
        gameObject.setData('currentZone', null);
    }


    /**
     * Arranges snippets within a specified drop zone.
     * 
     * This function positions snippets either in a single line or stacked vertically,
     * depending on the zone's configuration.
     * 
     * @param zone - The drop zone object where snippets are to be arranged.
     *               Expected to have properties: getData(), x, y, width, height.
     * 
     * @remarks
     * - If the zone is configured for a single snippet (isSingle is true),
     *   it places the snippet centered in the zone.
     * - For multiple snippets, it stacks them vertically with 30px spacing.
     * 
     * @returns void This function doesn't return a value.
     */
    private arrangeSnippets(zone: any) {
        const snippets = zone.getData('snippets');
        const isSingle = zone.getData('single');
        const startY = zone.y - (zone.height/2) + 10;

        snippets.forEach((snippet: any, index: number) => {
            if (isSingle) {
                snippet.x = zone.x  + zone.width/2-5 - snippet.width/2;
                snippet.y = zone.y;
            } else {
                // Vertical stacking with 20px spacing
                snippet.x = zone.x - zone.width/2+5 + snippet.width/2;
                snippet.y = startY + (index * 30);
            }
        });
    }

    /**
     * Updates the background color of a snippet based on its position and zone.
     * 
     * @param snippet - The snippet to update.
     * @param dropZone - The drop zone where the snippet is placed.
     */
    private updateSnippetBackgroundColor(snippet: any, dropZone: any) {
        const position = snippet.getData('position');
        const zone = snippet.getData('zone');

        if (position === -1) { //False input
            snippet.setBackgroundColor('#ff0000'); // Red
        } else if (!dropZone) {//Outside of any zone
            snippet.setBackgroundColor('#49524b'); // Default
        } else if (zone === dropZone.getData('name')) {
            //Correct zone
            if (position === dropZone.getData('snippets').indexOf(snippet)) {
                //Correct position
                snippet.setBackgroundColor('#00ff00'); // Green
            } else {
                //Wrong position
                snippet.setBackgroundColor('#ffff00'); // Yellow
            }
        } else {
            //Wrong zone
            snippet.setBackgroundColor('#ffff00'); // Yellow
        }
    }
}