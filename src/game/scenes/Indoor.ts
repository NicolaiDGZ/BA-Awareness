import { Console, debug } from 'console';
import { EventBus } from '../EventBus';
import { Scene, Textures } from 'phaser';
import { taskBox } from './components/taskBox';
import  Bot  from './components/Bot';
import  Player  from './components/Player';

export class Indoor extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    //player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: Player;
    turnstile: Phaser.Physics.Matter.Sprite;
    playerMovementSpeed: integer
    idleTimer: number;
    idleTimeLimit: number;
    map: Phaser.Tilemaps.Tilemap;
    interActionKey: Phaser.Input.Keyboard.Key;
    canPerformAction:boolean;
    infoText:Phaser.GameObjects.Text;
    interActionID:number;
    inArea: boolean;
    allContainersChecked:boolean[];
    secondStage: boolean;
    bot: Bot;

    constructor ()
    {
        super('Indoor');
    }

    create ()
    {
        //ControlsImage
        const controlimage = this.add.image(1024/2,768-100,'controls')
            .setDepth(100)
            .setScale(0.5)
            .setScrollFactor(0);
        this.time.delayedCall(5000,() => controlimage.setVisible(false));
        //TaskBox
        this.scene.launch('InfoBoxScene');
        this.scene.bringToTop('InfoBoxScene');
        taskBox.title = "Aufgaben";
        taskBox.addTask('Durchsuche die Müllcontainer\nnach Informationen',false);
        taskBox.addTask('Belausche die Mitarbeiter',false);
        this.time.delayedCall(500,()=>{taskBox.updateTasks();});
        //Parameters
        this.canPerformAction = false;
        this.interActionID = 0;
        this.interActionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.inArea = false;
        this.allContainersChecked = [false,false,false];
        this.secondStage = false;
        //Initial camera setup
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x988f8a);
        //Submethods for loading the essentials
        this.loadTiles();
        //this.loadPlayer();
        this.player = new Player(this, 4 * 32, 10 * 32, 'ts_player');
        this.loadTurnstile();
        this.loadUI();
        //Camera follow setup
        this.camera.startFollow(this.player.getSprite(),false,0.03,0.03);
        this.camera.zoom = 3;
        //this.cameras.main.setBounds(0, 0, 2016, 1408);
        this.cameras.main.roundPixels = true;
        //Bot Setup
        this.bot = new Bot(this, 333, 361, ['ts_char_1','ts_char_2','ts_char_3'],'circle');
        this.bot.setPath([
            { x: 333, y: 361 },
            { x: 333, y: 242 },
            { x: 507, y: 242 },
            { x: 507, y: -200 },
            { x: -200, y: -200 },
            { x: -200, y: 361 },
        ]);
    }

    showActionText(){
        if (this.canPerformAction) {
            this.infoText.setVisible(true);
            console.log('Player stayed for 5 seconds.');
        }
    }

    update(time:number, delta: number){
        this.player.update(delta);
        this.interact();
        this.bot.update();
    }

    interact(){
        if(this.canPerformAction){
            if(Phaser.Input.Keyboard.JustDown(this.interActionKey)){
                switch(this.interActionID){
                    case 1:{                 
                        break;
                    }
                    case 2:{
                        break;
                    }
                    case 3:{
                        break;
                    }
                    case 4:{
                        break;
                    }
                    default:{
                        console.log("No valid interActionID");
                        break;
                    }
                }
            }
        }
    }

    createCloseButton(image: Phaser.GameObjects.Image){
        // Button-Koordinaten berechnen (unterhalb des Bildes)
        const buttonx = image.x - 80; // Zentriere den Button horizontal, daher -50
        const buttony = image.y + image.height / 2 + 50; // 50px unter dem Bild
    
        // Graphics-Objekt für den Button erstellen
        const closeButton = this.add.graphics()
            .fillStyle(0xFF5252, 1)
            .fillRoundedRect(buttonx, buttony, 160, 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(buttonx, buttony, 160, 50, 15)
            .setScrollFactor(0)
            .setDepth(100);
    
        // Button-Text hinzufügen und zentrieren
        const buttonText = this.add.text(buttonx + 80, buttony + 25, 'Schließen', {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        })
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(100);
    
        // Add fake rectangele
        const buttonContainer = this.add.rectangle(buttonx,buttony,160,50)
            .setOrigin(0,0)
            .setInteractive({ useHandCursor: true })
            .setScrollFactor(0)
            .setDepth(100);
        // Button Klick-Event
        buttonContainer.on('pointerdown', () => {
            console.log("Close Button Clicked")
            image.setVisible(false);
            image.destroy();
            buttonContainer.setVisible(false);
            buttonText.setVisible(false);
            closeButton.setVisible(false);
            closeButton.destroy();
            buttonContainer.destroy();
            buttonText.destroy();
        });
    }
    addTask() {
        if(taskBox.tasks.every(task => task.completed == true)){
            this.secondStage = true;
            taskBox.addTask("Gehe zurück zu deinem Bus und nutze die gesammelten Informationen",false);
            this.time.delayedCall(500,()=>{taskBox.updateTasks();});
        }
    }

    loadTiles(){
        const map = this.make.tilemap({ key: 'indoor'});
        const ts_generic = map.addTilesetImage('ts_generic');
        const ts_basement = map.addTilesetImage('ts_basement');
        const ts_bathroom = map.addTilesetImage('ts_bathroom');
        const ts_classroomAndLibrary = map.addTilesetImage('ts_classroomAndLibrary');
        const ts_modernOffice = map.addTilesetImage('ts_modernOffice');
        const ts_museum = map.addTilesetImage('ts_museum');
        const ts_roomBuilder = map.addTilesetImage('ts_roomBuilder');
        const ts_roomBuilderOffice = map.addTilesetImage('ts_roomBuilderOffice');


        const floor = map.createLayer('Floor', [ts_roomBuilder!]);
        const walls = map.createLayer('Walls', ts_roomBuilder!);
        const furniture1 = map.createLayer('Furniture1', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!]);
        const furniture2 = map.createLayer('Furniture2', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!]);
        //const furniture3 = map.createLayer('Furniture3', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!]);
        //const objects = map.createLayer('Objects', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!]);
        console.log('Objekte: ',map.createFromObjects('Objects', [
            {
                gid: 9731,
                key: 'ts_a_coffee',
                frame: 7,
            }
        ],true)
        );
        
        walls?.setCollisionFromCollisionGroup(true);
        furniture1?.setCollisionFromCollisionGroup(true);
        furniture2?.setCollisionFromCollisionGroup(true);
        this.matter.world.convertTilemapLayer(walls!);
        this.matter.world.convertTilemapLayer(furniture1!);
        this.matter.world.convertTilemapLayer(furniture2!);

        this.matter.world.setBounds(0,32,2016,1408-32);
    }

    loadTurnstile(){
        this.turnstile = this.matter.add.sprite(8*32,2*32,'ts_a_turnstile');
        this.turnstile.setRectangle(30,20);
        this.turnstile.setOrigin(0,0);
        this.turnstile.setStatic(true);

        this.anims.create({
            key: 'open',
            frames: this.anims.generateFrameNumbers('ts_a_turnstile', { start: 0, end: 4 }),
            frameRate: 10,
        });
        this.anims.create({
            key: 'close',
            frames: this.anims.generateFrameNumbers('ts_a_turnstile', { start: 4, end: 0 }),
            frameRate: 10,
        });
    }

    loadUI(){
        //Infotext for Interaction
        this.infoText = this.add.text(1024/2, 768-50, 'Drücke die Leertaste zum Interagieren', { font: '24px Arial', color: '#fff' });
        this.infoText.setVisible(false);
        this.infoText.setScrollFactor(0);
        this.infoText.setOrigin(0.5,0.5);
        this.infoText.setDepth(100);
    }

    createSpeechBubble (x: number, y: number, width: number, height: number, quote: string, destroyTime: number)
    {
        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 4;

        var bubble = this.add.graphics({ x: x, y: y });

        //  Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        bubble.lineStyle(4, 0x222222, 0.5);
        bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        bubble.lineStyle(2, 0x565656, 1);
        bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

        var b = content.getBounds();

        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

        bubble.setDepth(101);
        content.setDepth(101);

        this.time.delayedCall(destroyTime,()=>{content.setVisible(false);content.destroy;bubble.setVisible(false);bubble.destroy;})
    }
}