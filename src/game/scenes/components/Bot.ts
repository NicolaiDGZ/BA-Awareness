class Bot {
    // Scene where the bot exists
    scene: Phaser.Scene;

    // The sprite representing the bot in the scene
    sprite: Phaser.Physics.Matter.Sprite;

    // The movement path, represented as an array of waypoints
    path: { x: number; y: number }[];

    // Index of the current waypoint
    currentWaypoint: number;

    // Bot's speed for movement
    speed: number;

    // Target waypoint the bot is moving towards
    targetWaypoint: { x: number; y: number } | null;

    // Array of texture keys for the bot
    textures: string[];

    // The current texture key
    currentTexture: string;

    // Movement behavior: 'circle' for seamless looping, 'teleport' for instant reset
    behavior: 'circle' | 'teleport';

    /**
     * Constructor to initialize the bot in the given scene.
     * @param scene - The Phaser.Scene in which the bot exists
     * @param x - Initial X position of the bot
     * @param y - Initial Y position of the bot
     * @param textures - Array of texture keys to cycle through
     * @param behavior - Movement behavior ('circle' or 'teleport')
     */
    constructor(scene: Phaser.Scene, x: number, y: number, textures: string[], behavior: 'circle' | 'teleport') {
        this.scene = scene;
        this.textures = textures;

        // Pick the initial texture
        this.currentTexture = Phaser.Utils.Array.GetRandom(this.textures);

        this.behavior = behavior;

        // Add the bot sprite with Matter.js physics
        this.sprite = scene.matter.add.sprite(x, y, this.currentTexture, 0, {
            isStatic: false,
            collisionFilter: { category: 0x0011, mask: 0x0010 } // No collision
        });

        this.sprite.setFixedRotation(); // Prevent sprite rotation
        this.path = [];
        this.currentWaypoint = 0;
        this.speed = 2; // Default movement speed
        this.targetWaypoint = null;

        // Configure animations for this bot
        this.setupAnimations();
    }

    /**
     * Sets up walking animations for the current bot's texture.
     */
    private setupAnimations(): void {
        if(!this.scene.anims.exists(`${this.currentTexture}-walk-right`)){      
            this.scene.anims.create({
                key: `${this.currentTexture}-walk-right`,
                frames: this.scene.anims.generateFrameNumbers(this.currentTexture, { start: 112, end: 117 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: `${this.currentTexture}-walk-left`,
                frames: this.scene.anims.generateFrameNumbers(this.currentTexture, { start: 124, end: 129 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: `${this.currentTexture}-walk-up`,
                frames: this.scene.anims.generateFrameNumbers(this.currentTexture, { start: 118, end: 123 }),
                frameRate: 10,
                repeat: -1
            });

            this.scene.anims.create({
                key: `${this.currentTexture}-walk-down`,
                frames: this.scene.anims.generateFrameNumbers(this.currentTexture, { start: 130, end: 135 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    /**
     * Sets the movement path for the bot.
     * @param waypoints - Array of waypoints ({x, y}) to define the bot's path.
     */
    public setPath(waypoints: { x: number; y: number }[]): void {
        if (waypoints.length < 2) {
            console.warn('Path must have at least two waypoints.');
            return;
        }
        this.path = waypoints;
        this.currentWaypoint = 0;
        this.targetWaypoint = this.path[this.currentWaypoint];
    }

    /**
     * Updates the bot's movement and animations.
     */
    public update(): void {
        if (!this.targetWaypoint) return;

        const dx = this.targetWaypoint.x - this.sprite.x;
        const dy = this.targetWaypoint.y - this.sprite.y;
        const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.targetWaypoint.x, this.targetWaypoint.y);

        if (distance > 5) {
            // Move towards the target waypoint
            const directionX = dx / distance;
            const directionY = dy / distance;

            this.sprite.setVelocity(directionX * this.speed, directionY * this.speed);

            // Play animations based on direction
            if (Math.abs(directionX) > Math.abs(directionY)) {
                this.sprite.anims.play(`${this.currentTexture}-walk-${directionX > 0 ? 'right' : 'left'}`, true);
            } else {
                this.sprite.anims.play(`${this.currentTexture}-walk-${directionY > 0 ? 'down' : 'up'}`, true);
            }
        } else {
            // Handle waypoint reached
            this.handleWaypointReached();
        }
    }

    /**
     * Handles behavior upon reaching a waypoint (circle or teleport logic).
     */
    private handleWaypointReached(): void {
        if (this.behavior === 'circle') {
            this.currentWaypoint = (this.currentWaypoint + 1) % this.path.length;
            if (this.currentWaypoint === 0) this.cycleTexture();
        } else if (this.behavior === 'teleport') {
            if (this.currentWaypoint === this.path.length - 1) {
                // Teleport to the first waypoint and cycle texture
                this.sprite.setPosition(this.path[0].x, this.path[0].y);
                this.currentWaypoint = 0;
                this.cycleTexture();
            } else {
                this.currentWaypoint++;
            }
        }
        this.targetWaypoint = this.path[this.currentWaypoint];
        this.sprite.setVelocity(0, 0);
    }

    /**
     * Cycles to a new random texture from the list and updates animations.
     */
    private cycleTexture(): void {
        this.currentTexture = Phaser.Utils.Array.GetRandom(this.textures);
        this.sprite.setTexture(this.currentTexture);
        this.setupAnimations();
    }

    public getBody():MatterJS.BodyType{
        return this.sprite.body as MatterJS.BodyType;
    }
}

export default Bot;
