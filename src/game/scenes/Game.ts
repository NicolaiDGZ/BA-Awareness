import { Console, debug } from 'console';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

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

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        //Parameters
        this.playerMovementSpeed = 3;
        this.idleTimeLimit = 2000;
        this.canPerformAction = false;
        this.interActionID = 0;
        this.interActionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
        const garbageBinCollider = this.matter.add.rectangle(12*32-30,22*32,32,64);
        garbageBinCollider.isStatic = true;
        garbageBinCollider.isSensor = true;
        garbageBinCollider.setOnCollideWith(this.player.body as MatterJS.BodyType,() => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 1;
        });
        garbageBinCollider.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
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
    }

    loadPlayer(){
        this.player = this.matter.add.sprite(75,75,'ts_player');
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
        //Load font
        this.loadFont("pixelify", "fonts/pixelify.ttf");
        // Add text in the top-left corner for objectives
        const objectivesText = this.add.text(40, 55, "• Find usefull\n  informations\n• Spy on the workers", {
            font: '18px',
            fontFamily: 'pixelify',
            color: '#000000'
        });
        objectivesText.setScrollFactor(0);
        objectivesText.setDepth(100);
        const image = this.add.image(20,20,'tasks');
        image.setScrollFactor(0);
        image.setOrigin(0,0);
        image.setDepth(99);
        //Infotext for Interaction
        this.infoText = this.add.text(1024/2, 768-50, 'Press Space to interact', { font: '24px Arial', color: '#fff' });
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
}
