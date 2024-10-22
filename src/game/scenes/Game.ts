import { Console, debug } from 'console';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { taskBox } from './components/taskBox';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    //player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: Phaser.Physics.Matter.Sprite;
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

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        //TaskBox
        this.scene.launch('InfoBoxScene');
        this.scene.bringToTop('InfoBoxScene');
        taskBox.title = "Aufgaben";
        taskBox.addTask('Durchsuche die Müllcontainer\nnach Informationen',false);
        taskBox.addTask('Belausche die Mitarbeiter',false);
        this.time.delayedCall(500,()=>{taskBox.updateTasks();});
        //Parameters
        this.playerMovementSpeed = 3;
        this.idleTimeLimit = 2000;
        this.canPerformAction = false;
        this.interActionID = 0;
        this.interActionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.inArea = false;
        this.allContainersChecked = [false,false,false];
        this.secondStage = false;
        //Initial camera setup
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        //Submethods for loading the essentials
        this.loadTiles();
        this.loadPlayer();
        this.loadUI();
        this.setColliders();
        //Camera follow setup
        this.camera.startFollow(this.player,false,0.01,0.01);
        this.cameras.main.setBounds(0, 0, 2016, 1408);
        this.cameras.main.roundPixels = true;

    }

    setColliders(){
        //GarbageBin1
        const garbageBin1Collider = this.matter.add.rectangle(12*32-30,22*32,32,64);
        garbageBin1Collider.isStatic = true;
        garbageBin1Collider.isSensor = true;
        garbageBin1Collider.setOnCollideWith(this.player.body as MatterJS.BodyType,() => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 1;
        });
        garbageBin1Collider.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
            this.interActionID = 0;
         }
         //GarbageBin2
        const garbageBin2Collider = this.matter.add.rectangle(12*32-30,25*32,32,64);
        garbageBin2Collider.isStatic = true;
        garbageBin2Collider.isSensor = true;
        garbageBin2Collider.setOnCollideWith(this.player.body as MatterJS.BodyType,() => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 2;
        });
        garbageBin2Collider.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
            this.interActionID = 0;
         }
         //GarbageBin3
        const garbageBin3Collider = this.matter.add.rectangle(12*32-30,28*32,32,64);
        garbageBin3Collider.isStatic = true;
        garbageBin3Collider.isSensor = true;
        garbageBin3Collider.setOnCollideWith(this.player.body as MatterJS.BodyType,() => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 3;
        });
        garbageBin3Collider.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
            this.interActionID = 0;
         }

        //WorkerArea
        const workerArea = this.matter.add.rectangle(30*32,34*32,400,200);
        workerArea.isStatic = true;
        workerArea.isSensor = true;
        workerArea.setOnCollideWith(this.player.body as MatterJS.BodyType, () => {
            this.inArea = true;
            this.time.delayedCall(3000,this.createConversation.bind(this))
        });
        workerArea.onCollideEndCallback = () => {
            this.inArea = false;
        }

        //Van
        const vanArea = this.matter.add.rectangle(53*32,17*32,(3+4)*32,(7+4)*32);
        vanArea.isStatic = true;
        vanArea.isSensor = true;
        vanArea.setOnCollideWith(this.player.body as MatterJS.BodyType, () => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 4;
        });
        vanArea.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
            this.interActionID = 0;
         }
    }
    createConversation() {
        if(this.inArea){
            this.createSpeechBubble(28*32-20,34*32-150,300,100,"Hast du schon mitbekommen, dass wir einen neuen Mitarbeiter bekommen?",3000);
            this.time.delayedCall(3100,() => {this.createSpeechBubble(28*32+75,34*32-150,150,100,"Nein, ab wann denn?",3000);});
            this.time.delayedCall(3100*2,() => {this.createSpeechBubble(28*32-10,34*32-150,150,100,"Schon ab Montag",3000);});
            this.time.delayedCall(3100*3,() => {this.createSpeechBubble(28*32+75,34*32-150,150,100,"Oh, da bin ich gerade im Urlaub",3000);});
            this.time.delayedCall(3100*4,() => {this.createSpeechBubble(28*32-20,34*32-150,400,100,"Kein Ding, ich habe mich schon angeboten ihm vom Empfang abzuholen. Ich weiß aber noch gar nicht, wie er aussieht..",5000);});
            this.time.delayedCall(3100*6,() => {
                taskBox.completeTask(1);
                this.addTask();
            });
        }
    }

    showActionText(){
        if (this.canPerformAction) {
            this.infoText.setVisible(true);
            console.log('Player stayed for 5 seconds.');
        }
    }

    update(time:number, delta: number){
        this.movement(delta);
        this.interact();
    }

    interact(){
        if(this.canPerformAction){
            if(Phaser.Input.Keyboard.JustDown(this.interActionKey)){
                switch(this.interActionID){
                    case 1:{
                        //Garbage1
                        const image = this.add.image(1024/2,768/2,'visitor_pass');
                        image.setScrollFactor(0);
                        image.setDepth(99);
                        this.time.delayedCall(3000,()=>{image.setVisible(false);image.destroy;});
                        this.allContainersChecked[0] = true;
                        if(this.allContainersChecked.every(Boolean)){
                            taskBox.completeTask(0);
                            this.addTask();
                        }
                        break;
                    }
                    case 2:{
                        //Garbage2
                        const image = this.add.image(1024/2,768/2,'nothingtofind');
                        image.setScrollFactor(0);
                        image.setDepth(99);
                        this.time.delayedCall(3000,()=>{image.setVisible(false);image.destroy;})
                        this.allContainersChecked[1] = true;
                        if(this.allContainersChecked.every(Boolean)){
                            taskBox.completeTask(0);
                            this.addTask();
                        }
                        break;
                    }
                    case 3:{
                        //Garbage3
                        const image = this.add.image(1024/2,768/2,'cv');
                        image.setScrollFactor(0);
                        image.setDepth(99);
                        this.time.delayedCall(8000,()=>{image.setVisible(false);image.destroy;})
                        this.allContainersChecked[2] = true;
                        if(this.allContainersChecked.every(Boolean)){
                            taskBox.completeTask(0);
                            this.addTask();
                        }
                        break;
                    }
                    case 4:{
                        //Van
                        if(this.secondStage){
                            this.scene.start('GameOver');
                        }else{
                            const text = this.add.text(1024/2, 768-100, 'Du musst erst die anderen Missionen erfüllen', { font: '24px Arial', color: '#fff' });
                            text.setVisible(true);
                            text.setScrollFactor(0);
                            text.setOrigin(0.5,0.5);
                            text.setDepth(100);
                            this.time.delayedCall(3000, ()=>{
                                text.setVisible(false);
                                text.destroy();
                            });
                        }
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
    addTask() {
        if(taskBox.tasks.every(task => task.completed == true)){
            this.secondStage = true;
            taskBox.addTask("Gehe zurück zu deinem Bus und nutze die gesammelten Informationen",false);
            this.time.delayedCall(500,()=>{taskBox.updateTasks();});
        }
    }

    loadTiles(){
        const map = this.make.tilemap({ key: 'outdoor'});
        const ts_city_terrains = map.addTilesetImage('ts_city_terrains');
        const ts_terrains_fences = map.addTilesetImage('ts_terrains_fences');
        const ts_vehicles = map.addTilesetImage('ts_vehicles');
        const ts_city_props = map.addTilesetImage('ts_city_props');
        const ts_office = map.addTilesetImage('ts_office');
        const ts_post_office = map.addTilesetImage('ts_post_office');

        const floor = map.createLayer('Floor', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const office = map.createLayer('Office', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps = map.createLayer('CityProps',[ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps2 = map.createLayer('CityProps2', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityPropsAbovePlayer = map.createLayer('CityPropsAbovePlayer', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps2AbovePlayer = map.createLayer('CityProps2AbovePlayer', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);

        cityPropsAbovePlayer?.setDepth(2);
        cityProps2AbovePlayer?.setDepth(2);

        cityProps?.setCollisionFromCollisionGroup(true);
        cityProps2?.setCollisionFromCollisionGroup(true);
        office?.setCollisionByExclusion([-1],true);
        this.matter.world.convertTilemapLayer(office!);
        this.matter.world.convertTilemapLayer(cityProps!);
        this.matter.world.convertTilemapLayer(cityProps2!);

        this.matter.world.setBounds(0,32,2016,1408-32);

        //Load workers
        this.matter.add.sprite(28*32,34*32,'worker1').setDepth(102).setScale(2,2).setStatic(true);
        this.matter.add.sprite(30*32,34*32,'worker2').setDepth(102).setScale(2,2).setStatic(true);
    }

    loadPlayer(){
        this.player = this.matter.add.sprite(52*32,16*32,'ts_player');
        this.player.setRectangle(30,20);
        this.player.setOrigin(0.5,0.83);
        this.player.setFixedRotation();
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ts_player', { start: 117, end: 125 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('ts_player', { start: 104, end: 112 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ts_player', { start: 143, end: 151 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('ts_player', { start: 130, end: 138 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('ts_player', { start: 182, end: 183 }),
            frameRate: 0.5,
            repeat: -1
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

    movement(delta: any) {
        let velocityX = 0;
        let velocityY = 0;
        let isMoving = false;
    
        // Überprüfung der Bewegung auf der X-Achse (links/rechts)
        if (this.cursors.left.isDown) {
            velocityX = -this.playerMovementSpeed;
            this.player.anims.play('left', true);
            isMoving = true;
        } 
        else if (this.cursors.right.isDown) {
            velocityX = this.playerMovementSpeed;
            this.player.anims.play('right', true);
            isMoving = true;
        }
    
        // Überprüfung der Bewegung auf der Y-Achse (oben/unten)
        if (this.cursors.up.isDown) {
            velocityY = -this.playerMovementSpeed;
            this.player.anims.play('up', true);
            isMoving = true;
        } 
        else if (this.cursors.down.isDown) {
            velocityY = this.playerMovementSpeed;
            this.player.anims.play('down', true);
            isMoving = true;
        }
    
        // Setze die finale Geschwindigkeit für X- und Y-Achse
        this.player.setVelocity(velocityX, velocityY);
    
        // Bewegung überprüfen
        if (isMoving) {
            // Wenn der Spieler sich bewegt, setze den Idle-Timer zurück
            this.idleTimer = 0;
        } else {
            // Wenn der Spieler sich nicht bewegt, erhöhe den Idle-Timer
            this.idleTimer += delta;
        }
    
        // Idle-Animation abspielen, wenn der Spieler eine Zeit lang still steht
        if (!isMoving && this.idleTimer >= this.idleTimeLimit) {
            this.player.anims.play('idle', true);
        }
    
        // Stoppe die Animation, wenn keine Bewegung und Idle-Timer noch nicht erreicht ist
        if (velocityX === 0 && velocityY === 0 && this.idleTimer < this.idleTimeLimit) {
            this.player.anims.stop();
        }
    }

    loadFont(name: string, url: any) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
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
