// Player.ts
import { Scene } from 'phaser';

export class Player {
    private sprite: Phaser.Physics.Matter.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private movementSpeed: number;
    private idleTimer: number = 0;
    private idleTimeLimit: number;
    private texture: string;

    constructor(scene: Scene, x: number, y: number, texture: string, scale: number = 1) {
        this.movementSpeed = 3;
        this.idleTimeLimit = 2000;
        this.texture = texture;
        
        // Initialize player sprite
        this.sprite = scene.matter.add.sprite(x, y, this.texture);
        this.sprite.setScale(scale);
        this.sprite.setRectangle(30, 20);
        this.sprite.setOrigin(0.5, 0.83);
        this.sprite.setFixedRotation();
        
        // Keyboard input
        this.cursors = scene.input.keyboard!.createCursorKeys();
        // Load animations
        this.loadAnimations(scene);
    }

    private loadAnimations(scene: Scene) {
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 124, end: 129 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 118, end: 123 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 112, end: 117 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 130, end: 135 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 74, end: 79 }),
            frameRate: 0.5,
            repeat: -1
        });
    }

    public update(delta: number) {
        this.handleMovement(delta);
    }

    private handleMovement(delta: number) {
        let velocityX = 0;
        let velocityY = 0;
        let isMoving = false;

        // Handle X-axis movement
        if (this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            velocityX = -this.movementSpeed;
            this.sprite.anims.play('left', true);
            isMoving = true;
        } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            velocityX = this.movementSpeed;
            this.sprite.anims.play('right', true);
            isMoving = true;
        }

        // Handle Y-axis movement
        if (this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) {
            velocityY = -this.movementSpeed;
            this.sprite.anims.play('up', true);
            isMoving = true;
        } else if (this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) {
            velocityY = this.movementSpeed;
            this.sprite.anims.play('down', true);
            isMoving = true;
        }

        this.sprite.setVelocity(velocityX, velocityY);

        if (isMoving) {
            this.idleTimer = 0; // Reset idle timer
        } else {
            this.idleTimer += delta;
        }

        if (!isMoving && this.idleTimer >= this.idleTimeLimit) {
            this.sprite.anims.play('idle', true);
        }

        if (velocityX === 0 && velocityY === 0 && this.idleTimer < this.idleTimeLimit) {
            this.sprite.anims.stop();
        }
    }


    public getSprite(): Phaser.Physics.Matter.Sprite {
        return this.sprite;
    }

    public getBody():MatterJS.BodyType{
        return this.sprite.body as MatterJS.BodyType;
    }
}
 export default Player;