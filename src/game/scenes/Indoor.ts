import { Console, debug } from 'console';
import { EventBus } from '../EventBus';
import { Physics, Scene, Textures } from 'phaser';
import { taskBox } from './components/taskBox';
import  Bot  from './components/Bot';
import  Player  from './components/Player';
import { BodyType } from 'matter';

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
    CC_player: number;
    CC_bot: number;
    CC_turnstileSensor: number;
    turnstileSensor: MatterJS.BodyType;
    cameraAngle: number;
    cameraSensor: any;
    cameraGraphic: any;
    direction: number;
    highlightObjects: any;

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
        taskBox.addTask('Durchsuche die Büros\nnach Informationen',false);
        this.time.delayedCall(10,()=>{taskBox.updateTasks();});
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
        this.player = new Player(this, 9.5 * 32, 22.5 * 32, 'ts_player');
        this.loadUI();
        //Camera follow setup
        this.camera.startFollow(this.player.getSprite(),false,0.03,0.03);
        this.camera.zoom = 3;
        this.cameras.main.setBounds(18, 0, 28 * 32 + 18, 23 * 32 + 18);
        this.cameras.main.roundPixels = true;
        //Bot Setup
        this.bot = new Bot(this, 9.5*32, 32.5*32, ['ts_char_1','ts_char_2','ts_char_3'],'teleport');
        this.bot.setPath([
            { x: 9.5*32, y: 32.5*32 },//wp0
            { x: 9.5*32, y: 19.5*32 },
            { x: 14*32, y: 19.5*32 },
            { x: 14*32, y: 10*32 },
            { x: 11.5*32, y: 10*32 },
            { x: 11.5*32, y: 7.5*32 },
            { x: 6*32, y: 7.5*32 },//wp1
            { x: 11.5*32, y: 7.5*32 },
            { x: 11.5*32, y: 10*32 },
            { x: 22*32, y: 10*32 },
            { x: 22*32, y: 12*32 },
            { x: 25*32, y: 12*32 },
            { x: 25*32, y: 15*32 },//wp2
            { x: 25*32, y: 12*32 },
            { x: 22*32, y: 12*32 },
            { x: 22*32, y: 10*32 },
            { x: 14*32, y: 10*32 },
            { x: 14*32, y: 19.5*32 },
            { x: 9.5*32, y: 19.5*32 },
            { x: 9.5*32, y: 32.5*32 },//wp0
        ]);
        this.loadTurnstile();
        this.loadCamera();
        this.setupInteractionZones();
    }

    setupCollisionCategorys(){
        this.CC_player = this.matter.world.nextCategory();
        this.CC_bot = this.matter.world.nextCategory();
        this.CC_turnstileSensor = this.matter.world.nextCategory();
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
                             console.log(this.interActionID);
                        break;
                    }
                    case 2:{
                        console.log(this.interActionID);
                        break;
                    }
                    case 3:{
                        console.log(this.interActionID);
                        break;
                    }
                    case 4:{
                        console.log(this.interActionID);
                        break;
                    }
                    default:{
                        console.log("No valid interActionID");
                        break;
                    }
                }
                const highlight = this.highlightObjects[this.interActionID - 1];
                if (highlight) {
                    // Destroy the highlight object
                    highlight.setVisible(false); 
        
                    // Optionally, remove it from the array
                    this.highlightObjects[this.interActionID - 1] = null;
                }else{
                    console.log("No highlight found");
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
        const ts_jail = map.addTilesetImage('ts_jail');
        const ts_kitchen = map.addTilesetImage('ts_kitchen');


        const floor = map.createLayer('Floor', [ts_roomBuilder!]);
        const walls = map.createLayer('Walls', ts_roomBuilder!);
        const furniture1 = map.createLayer('Furniture1', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!,ts_kitchen!,ts_jail!]);
        const furniture2 = map.createLayer('Furniture2', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!,ts_kitchen!,ts_jail!]);
        const furniture3 = map.createLayer('Furniture3', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!,ts_kitchen!,ts_jail!]);
        const furniture4 = map.createLayer('Furniture4', [ts_generic!,ts_basement!,ts_bathroom!,ts_classroomAndLibrary!,ts_modernOffice!,ts_museum!,ts_roomBuilder!,ts_roomBuilderOffice!,ts_kitchen!,ts_jail!]);
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
        furniture3?.setCollisionFromCollisionGroup(true);
        furniture4?.setCollisionFromCollisionGroup(true);
        this.matter.world.convertTilemapLayer(walls!);
        this.matter.world.convertTilemapLayer(furniture1!);
        this.matter.world.convertTilemapLayer(furniture2!);
        this.matter.world.convertTilemapLayer(furniture3!);
        this.matter.world.convertTilemapLayer(furniture4!);

        this.matter.world.setBounds(0,32,2016,1408-32);
    }

    createTurnstileBody(x:number, y:number) {
        // Define the parts of the "H" relative to the given position
        const leftVertical = this.matter.bodies.rectangle(x - 26, y, 10, 64, { isStatic: true });
        const middleHorizontal = this.matter.bodies.rectangle(x, y, 40, 20, { isStatic: true });
        const rightVertical = this.matter.bodies.rectangle(x + 26, y, 10, 64, { isStatic: true });
    
        // Create a composite body combining the parts
        return this.matter.body.create({
            parts: [leftVertical, middleHorizontal, rightVertical],
            isStatic: true,
        });
    }

    setupInteractionZones(){
        const coordinates = [
            { x: 20, y: 12 },
            { x: 23, y: 8 },
            { x: 24, y: 5 },
            { x: 25, y: 1.5 },
            { x: 23, y: 1 },
            { x: 20, y: 2 },
            { x: 10, y: 12 },
            { x: 4, y: 12 },
            { x: 7, y: 10 },
            { x: 5, y: 17 },
        ]

        this.highlightObjects = [];

        coordinates.forEach((coord, index) => {
            const highlight = this.matter.add.image(coord.x * 32+16, coord.y * 32+16, 'ts_highlight')
                .setRectangle(50, 50)
                .setStatic(true)
                .setSensor(true);
    
            this.tweens.add({
                targets: highlight,
                alpha: { from: 0.5, to: 1.0 },
                scale: { from: 0.9, to: 1.1 },
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
    
            highlight.setOnCollideWith(this.player.getBody(), () => {
                this.canPerformAction = true;
                this.time.delayedCall(3000, this.showActionText.bind(this));
                this.interActionID = index + 1;
            });
            highlight.setOnCollideEnd  (() => { 
                console.log("Collide End Callback")
                this.canPerformAction = false;
                this.infoText.setVisible(false);
                this.interActionID = 0;
             });
             this.highlightObjects[index] = highlight;
        });
    }

    loadCamera(){
        const camera = this.matter.add.sprite(17*32 + 16 ,0*32,'ts_a_seccamera')
            .setStatic(true)
        this.anims.create({
            key: 'seccamera_moving',
            frames: this.anims.generateFrameNumbers('ts_a_seccamera', { start: 0, end: 9 }),
            frameRate: 4,
            repeat: -1
        });
        camera.anims.play('seccamera_moving');
        const cameravision = this.matter.add.sprite(128,128,'ts_seccam_cone')
            .setOrigin(0.5,0)
            .setScale(0.1)
            .setRectangle(10,10);
        

        this.cameraAngle = 0;
        // Camera view triangle (Graphic)
        this.cameraGraphic = this.add.graphics();
        this.cameraGraphic.fillStyle(0xff0000, 0.5);
        this.cameraGraphic.fillTriangle(400, 300, 380, 400, 420, 400);

        // Camera Matter Body
        const viewVertices = [{ x: 400, y: 300 }, { x: 380, y: 400 }, { x: 420, y: 400 }];
        this.cameraSensor = this.matter.add.fromVertices(400, 300+66, viewVertices, {
            isStatic: true,
            isSensor: true, // Makes it a sensor to trigger collision events
            label: 'camera',
        });

        this.time.addEvent({
            delay: 30,
            callback: this.rotateCamera,
            callbackScope: this,
            loop: true,
        });
    }


    rotateCamera() {
        this.cameraAngle += this.direction * 0.02; // Update angle by direction

        // Check angle limits
        if (this.cameraAngle >= Phaser.Math.DegToRad(90)) {
            this.direction = -1; // Reverse direction
        } else if (this.cameraAngle <= 0) {
            this.direction = 1; // Reverse direction
        }

        this.cameraAngle += 0.02; // Rotation speed
        const rotationMatrix = Phaser.Math.RotateAround({ x: 380, y: 400 }, 400, 300, this.cameraAngle);
        this.cameraSensor.position.x = rotationMatrix.x;
        this.cameraSensor.position.y = rotationMatrix.y;
    
        // Sync Graphic with Matter Sensor (re-render triangle)
        this.cameraGraphic.clear();
        this.cameraGraphic.fillStyle(0xff0000, 0.5);
        const p1 = { x: 400, y: 300 };
        const p2 = Phaser.Math.RotateAround({ x: 380, y: 400 }, p1.x, p1.y, this.cameraAngle);
        const p3 = Phaser.Math.RotateAround({ x: 420, y: 400 }, p1.x, p1.y, this.cameraAngle);
    
        this.cameraGraphic.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    
        // Update Matter Sensor Vertices
        this.cameraSensor.vertices[0].x = p1.x;
        this.cameraSensor.vertices[0].y = p1.y;
        this.cameraSensor.vertices[1].x = p2.x;
        this.cameraSensor.vertices[1].y = p2.y;
        this.cameraSensor.vertices[2].x = p3.x;
        this.cameraSensor.vertices[2].y = p3.y;
    }
    loadTurnstile(){
        // Add a sprite for the turnstile and attach the composite body
        this.turnstile = this.matter.add.sprite(14*32,16*32,'ts_a_turnstile')
            .setExistingBody(this.createTurnstileBody(14*32,16*32))
            //.setRectangle(64,20)
            .setStatic(true);

        const dummyturnstile = this.matter.add.sprite(16*32, 16*32, 'ts_a_turnstile', 0);
        dummyturnstile.setExistingBody(this.createTurnstileBody(16*32,16*32));
        dummyturnstile.setOrigin(0.5, 0.5);

        this.turnstileSensor = this.matter.add.rectangle(
            this.turnstile.x,
            this.turnstile.y,
            60, // Slightly larger area than the visual turnstile.
            40,
            { isSensor: true,
                collisionFilter: {
                    category: 0x0010,
                    mask: 0x0011
                }
             }
        );
        this.turnstileSensor.setOnCollideWith(this.bot.getBody(),() => {
            this.turnstile.anims.play('open');
            this.turnstile.setCollidesWith(0);
            this.time.delayedCall(3000,()=>{this.turnstile.anims.play('close');  this.turnstile.setCollidesWith(1)});
        })
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