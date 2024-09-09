import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    //player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    cityProps: Phaser.Tilemaps.TilemapLayer | null;
    player: Phaser.Physics.Matter.Sprite;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.loadTiles();
        this.loadPlayer();

        this.matter.world.convertTilemapLayer(this.cityProps!);
        //this.physics.collide(this.player,this.cityProps!);

        this.camera.startFollow(this.player,false,0.01,0.01);
        this.cameras.main.setBounds(0, 0, 2016, 1408);
        this.cameras.main.roundPixels = true;
    }

    update(){
        this.movement();
    }

    loadTiles(){
        const map = this.make.tilemap({ key: 'outdoor'});
        const ts_city_terrains = map.addTilesetImage('ts_city_terrains');
        const ts_terrains_fences = map.addTilesetImage('ts_terrains_fences');
        const ts_vehicles = map.addTilesetImage('ts_vehicles');
        const ts_city_props = map.addTilesetImage('ts_city_props');
        const ts_office = map.addTilesetImage('ts_office');
        const ts_post_office = map.addTilesetImage('ts_post_office');

        map.createLayer('Floor', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        map.createLayer('Office', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        this.cityProps = map.createLayer('CityProps',[ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        map.createLayer('CityProps2', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);

        this.cityProps?.setCollisionFromCollisionGroup(true);
        //this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    loadPlayer(){
        //this.player = this.physics.add.sprite(200,200,'ts_player');
        this.player = this.matter.add.sprite(200,200,'ts_player');
        this.player.setFixedRotation();
        //this.player.setCollideWorldBounds(true);
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
            frames: this.anims.generateFrameNumbers('ts_player', { start: 108, end: 120 }),
            frameRate: 10,
            repeat: -1
        });
    }

    movement(){
        if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-1);
            
                this.player.anims.play('left', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(1);
            
                this.player.anims.play('right', true);
            }
            else if (this.cursors.up.isDown)
            {
                this.player.setVelocityY(-1);
            
                this.player.anims.play('up', true);
            }
            else if (this.cursors.down.isDown)
            {
                this.player.setVelocityY(1);
            
                this.player.anims.play('down', true);
            }
            else
            {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                this.player.anims.stop();
            }
    }
}
