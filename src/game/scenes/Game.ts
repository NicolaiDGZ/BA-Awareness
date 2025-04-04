import { Scene } from 'phaser';
import { taskBox } from './components/taskBox';
import Bot from './components/Bot';
import Player from './components/Player';
import { sceneManager } from './components/SceneManager';
import { AchievementManager } from './components/AchievementManager';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    player: Player;
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
    bot1: Bot;
    canCreateSpeechBubble: boolean;

    constructor ()
    {
        super('Game');
    }

    /**
     * Initializes and sets up the game scene.
     * This method is called automatically by the Scene Manager when the scene starts.
     * It sets up the game environment, including UI elements, player, camera, and NPCs.
     * 
     * @remarks
     * This method performs the following tasks:
     * - Creates and displays control instructions
     * - Initializes the task box and sets initial tasks
     * - Sets up game parameters and interaction keys
     * - Configures the camera and its effects
     * - Loads map tiles and creates the player
     * - Sets up colliders for interactive elements
     * - Configures camera follow behavior
     * - Creates and sets paths for NPC bots
     * 
     * @returns void This method does not return a value.
     */
    create ()
    {
        //ControlsImage
        const controlimage = this.add.image(1024/2,768-100,'controls')
            .setDepth(100)
            .setScale(0.5)
            .setScrollFactor(0);
        this.time.delayedCall(5000,() => {controlimage.setVisible(false); controlimage.destroy();});
        //TaskBox
        this.scene.launch('InfoBoxScene');
        this.scene.bringToTop('InfoBoxScene');
        taskBox.clearTasks();
        taskBox.title = "Aufgaben";
        const phase = this.registry.get('phase') || 0;
        if(phase == 1){
            taskBox.addTask('Begebe dich in das Bürogebäude',false);
        }else if(phase == 0){
            taskBox.addTask('Durchsuche die Müllcontainer\nnach Informationen',false);
            taskBox.addTask('Belausche die Mitarbeiter',false);
        }else if(phase == 2){
            taskBox.addTask('Gehe zurück zu deinem Bus und nutze die gesammelten Informationen',false);
        }
        this.time.delayedCall(500,()=>{taskBox.updateTasks();});
        //Parameters
        this.canPerformAction = false;
        this.canCreateSpeechBubble = true;
        this.interActionID = 0;
        this.interActionKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.inArea = false;
        this.allContainersChecked = [false,false,false];
        this.secondStage = false;
        //Initial camera setup
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.camera.postFX.addVignette(0.5, 0.5, 0.8,0.4);
        //Submethods for loading the essentials
        this.loadTiles();
        if(phase == 2){
            this.player = new Player(this, 19 * 32, 31 * 32, 'ts_player');
        }else{
            this.player = new Player(this, 51 * 32, 15 * 32, 'ts_player');
        }
        this.loadUI();
        this.setColliders();
        //this.spawnCar();
        //Camera follow setup
        this.camera.startFollow(this.player.getSprite(),false,0.01,0.01);
        this.cameras.main.setBounds(0, 0, 2016, 1408);
        this.cameras.main.roundPixels = true;
        //Bot-Setup
        this.bot = new Bot(this, 63*32, 1*32, ['ts_char_1','ts_char_2','ts_char_3'],'teleport');
        this.bot.setPath([
            { x: 63*32, y: 1*32 },
            { x: 1*32, y: 1*32 },
            { x: 1*32, y: 35*32 },
            { x: 33*32, y: 35*32 },
            { x: 33*32, y: 12*32 },
            { x: 58*32, y: 12*32 },
            { x: 58*32, y: 34*32 },
            { x: 64*32, y: 34*32 },
        ]);
        this.bot1 = new Bot(this, 45*32, 14*32, ['ts_char_1','ts_char_2','ts_char_3'],'teleport');
        this.bot1.setPath([
            { x: 45*32, y: 14*32 },
            { x: 45*32, y: 12*32 },
            { x: 34*32, y: 12*32 },
            { x: 34*32, y: 35*32 },
            { x: 19*32, y: 35*32 },
            { x: 19*32, y: 30*32 },
        ]);
        this.events.on('shutdown',() => this.shutdown());
    }

    shutdown(){
        console.log("Shutting down scene");
        this.input.keyboard?.removeAllKeys();
        this.input.keyboard?.removeAllListeners();
    }


    /**
     * Sets up collision detection for various game objects.
     * This method creates and configures collision areas for garbage bins, worker area, van, and entrance.
     * It defines the behavior when the player collides with or leaves these areas.
     * 
     * @remarks
     * This method performs the following tasks:
     * - Creates rectangular collision areas for three garbage bins, worker area, van, and entrance.
     * - Sets up collision detection between the player and these areas.
     * - Defines behavior for when the player enters or leaves these areas, such as:
     *   - Enabling/disabling interaction possibilities.
     *   - Showing/hiding action text.
     *   - Setting interaction IDs.
     *   - Triggering conversations or scene changes.
     * 
     * @returns void This method does not return a value.
     */
    setColliders(){
        const phase = this.registry.get('phase') || 0;
        if(phase == 0){
            
            //GarbageBin1
            const garbageBin1Collider = this.matter.add.rectangle(12*32-30,22*32,32,64);
            garbageBin1Collider.isStatic = true;
            garbageBin1Collider.isSensor = true;
            garbageBin1Collider.setOnCollideWith(this.player.getBody(),() => {
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
            garbageBin2Collider.setOnCollideWith(this.player.getBody(),() => {
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
            garbageBin3Collider.setOnCollideWith(this.player.getBody(),() => {
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
            const workerArea = this.matter.add.rectangle(29*32,35*32,6*32,4*32);
            workerArea.isStatic = true;
            workerArea.isSensor = true;
            workerArea.setOnCollideWith(this.player.getBody(), () => {
                this.inArea = true;
                this.time.delayedCall(2000,this.createConversation.bind(this))
            });

            //Van
            const vanArea = this.matter.add.rectangle(53.5*32,17.5*32,4.5*32,8*32);
            vanArea.isStatic = true;
            vanArea.isSensor = true;
            vanArea.setOnCollideWith(this.player.getBody(), () => {
                this.canPerformAction = true;
                this.time.delayedCall(3000,this.showActionText.bind(this));
                this.interActionID = 4;
            });
            vanArea.onCollideEndCallback = () => { 
                this.canPerformAction = false;
                this.infoText.setVisible(false);
                this.interActionID = 0;
            } 

            //Garbage bin
            const binArea = this.matter.add.rectangle(7.5*32,36.5*32,3*32,3*32);
            binArea.isStatic = true;
            binArea.isSensor = true;
            binArea.setOnCollideWith(this.player.getBody(), () => {
                this.canPerformAction = true;
                this.time.delayedCall(3000,this.showActionText.bind(this));
                this.interActionID = 6;
            });
            binArea.onCollideEndCallback = () => { 
                this.canPerformAction = false;
                this.infoText.setVisible(false);
                this.interActionID = 0;
            }
        }else if(phase == 1){
            
        }else if(phase == 2){
            //Van
            const vanArea = this.matter.add.rectangle(53.5*32,17.5*32,4.5*32,8*32);
            vanArea.isStatic = true;
            vanArea.isSensor = true;
            vanArea.setOnCollideWith(this.player.getBody(), () => {
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
         //Entrance
        const entranceArea = this.matter.add.rectangle(19.5*32,32*32,(3)*32,(2)*32);
        entranceArea.isStatic = true;
        entranceArea.isSensor = true;
        entranceArea.setOnCollideWith(this.player.getBody(), () => {
            this.canPerformAction = true;
            this.time.delayedCall(3000,this.showActionText.bind(this));
            this.interActionID = 5;
        });
        entranceArea.onCollideEndCallback = () => { 
            this.canPerformAction = false;
            this.infoText.setVisible(false);
            this.interActionID = 0;
         } 
         //swing
         const swingArea = this.matter.add.rectangle(55.5*32,4.5*32,5*32,3*32);
         swingArea.isStatic = true;
         swingArea.isSensor = true;
         swingArea.setOnCollideWith(this.player.getBody(), () => {
             this.canPerformAction = true;
             this.time.delayedCall(3000,this.showActionText.bind(this));
             this.interActionID = 7;
         });
         swingArea.onCollideEndCallback = () => { 
             this.canPerformAction = false;
             this.infoText.setVisible(false);
             this.interActionID = 0;
         } 
    }

    /**
     * Creates a conversation sequence using speech bubbles.
     * This method generates a series of speech bubbles to simulate a conversation between characters.
     * It also completes a task and adds a new one after the conversation ends.
     * 
     * @remarks
     * The conversation only occurs if the player is in the designated area (this.inArea is true).
     * Each speech bubble is created with a delay to simulate the timing of a real conversation.
     * After the conversation, it marks a task as complete and potentially adds a new task.
     * 
     * @returns void This method does not return a value.
     */
    createConversation() {
        if(this.inArea && this.canCreateSpeechBubble){
            this.canCreateSpeechBubble = false;
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


    /**
     * Displays the action text when the player can perform an action.
     * This function is typically called after a delay when the player stays in an interactive area.
     * 
     * @remarks
     * The function checks if an action can be performed (canPerformAction flag) before showing the text.
     * It also logs a message to the console for debugging purposes.
     * 
     * @returns void This function does not return a value.
     */
    showActionText(){
        if (this.canPerformAction) {
            this.infoText.setVisible(true);
            console.log('Player stayed for 5 seconds.');
        }
    }


    /**
     * Updates the game state for each frame.
     * This method is called automatically by the Phaser game loop.
     * 
     * @param time - The current time in milliseconds since the game started.
     * @param delta - The time in milliseconds since the last frame.
     * 
     * @returns void This method does not return a value.
     */
    update(delta: number) {
        this.interact();
        this.player.update(delta);
        this.bot1.update();
        this.bot.update();
    }


    interact(){
        if(this.canPerformAction){
            if(Phaser.Input.Keyboard.JustDown(this.interActionKey)){
                switch(this.interActionID){
                    case 1:{
                        //Garbage1
                        if(!this.allContainersChecked[0]){
                            this.scene.launch("PopupScene", { 
                                imageKey: "visitor_pass", 
                                imageScale: 1, 
                                returnScene: "Game" 
                            });
                            this.scene.pause();
                            this.allContainersChecked[0] = true;
                            if(this.allContainersChecked.every(Boolean)){
                                taskBox.completeTask(0);
                                this.addTask();
                            }
                        }                        
                        break;
                    }
                    case 2:{
                        //Garbage2
                        if(!this.allContainersChecked[1]){
                            this.scene.launch("PopupScene", { 
                                imageKey: "nothingtofind", 
                                imageScale: 1, 
                                returnScene: "Game" 
                            });
                            this.scene.pause();
                            this.allContainersChecked[1] = true;
                            if(this.allContainersChecked.every(Boolean)){
                                taskBox.completeTask(0);
                                this.addTask();
                            }
                        }
                        break;
                    }
                    case 3:{
                        //Garbage3
                        if(!this.allContainersChecked[2]){
                            this.scene.launch("PopupScene", { 
                                imageKey: "cv", 
                                imageScale: 1, 
                                returnScene: "Game" 
                            });
                            this.scene.pause();
                            this.allContainersChecked[2] = true;
                            if(this.allContainersChecked.every(Boolean)){
                                taskBox.completeTask(0);
                                this.addTask();
                            }
                        }
                        break;
                    }
                    case 4:{
                        //Van
                        const phase = this.registry.get('phase') || 0;
                        if(this.secondStage || phase == 2){
                            this.scene.stop('InfoBoxScene');
                            const nextScene = sceneManager.getNextScene();
                            this.scene.start(nextScene?.key,nextScene?.data);
                        }else if(phase == 0){
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
                    case 5:{
                        //Entrance
                        const phase = this.registry.get('phase') || 0;
                        if(phase == 1){
                            this.scene.stop('InfoBoxScene');
                            const nextScene = sceneManager.getNextScene();
                            this.scene.start(nextScene?.key,nextScene?.data);
                        }
                        else{
                            this.createSpeechBubble(19*32,26*32,450,100,'Stop, um hier reinzukommen, brauchst du einen \nMitarbeiter oder Gästeausweis.',5000);
                        }
                        break;
                    }
                    case 6:{
                        //Garbage bin
                        this.createSpeechBubble(8*32,30*32,450,100,'Hier scheint nur Müll zu sein. \nVielleicht da oben bei den großen Containern?',5000, this.player.getSprite())
                        break;
                    }
                    case 7:{
                        //Garbage bin
                        this.createSpeechBubble(44*32,0.2*32,300,100,'Why did Jackie Chan bring a swing to the movie set?',3900, this.player.getSprite());
                        this.time.delayedCall(4000,() => this.createSpeechBubble(44*32,0.2*32,400,100,'Because he wanted to take his action scenes to new heights\n but ended up just swinging by for a laugh!',4900, this.player.getSprite()));

                        this.time.delayedCall(9500, () => AchievementManager.unlockAchievement("joke", this));
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

    createCloseButton(image: Phaser.GameObjects.Image) {
        // Button-Koordinaten berechnen (unterhalb des Bildes)
        const buttonx = image.x - 80;
        const buttony = image.y + image.height / 2 + 50;
        
        // Container erstellen
        const closeButtonContainer = this.add.container(0, 0);
        closeButtonContainer.setScale(1 / 3);
        
        // Graphics-Objekt für den Button erstellen
        const closeButton = this.add.graphics()
            .fillStyle(0xFF5252, 1)
            .fillRoundedRect(buttonx, buttony, 160, 50, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(buttonx, buttony, 160, 50, 15);
        
        // Button-Text hinzufügen
        const buttonText = this.add.text(buttonx + 80, buttony + 25, 'Schließen', {
            fontSize: '24px',
            color: '#000000',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        
        // Interaktives Rechteck als Button-Hitbox
        const buttonContainer = this.add.rectangle(buttonx, buttony, 160, 50)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true });
        
        // Button Klick-Event
        buttonContainer.on('pointerdown', () => {
            console.log("Close Button Clicked");
            image.setVisible(false);
            image.destroy();
            closeButtonContainer.destroy();
        });
        
        // Alle Elemente zum Container hinzufügen
        closeButtonContainer.add([closeButton, buttonText, buttonContainer]);
        
        // Container zur Szene hinzufügen
        this.add.existing(closeButtonContainer);
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

        map.createLayer('Floor', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const office = map.createLayer('Office', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps = map.createLayer('CityProps',[ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps2 = map.createLayer('CityProps2', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityPropsAbovePlayer = map.createLayer('CityPropsAbovePlayer', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        const cityProps2AbovePlayer = map.createLayer('CityProps2AbovePlayer', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);

        cityPropsAbovePlayer?.setDepth(10);
        cityProps2AbovePlayer?.setDepth(10);

        cityProps?.setCollisionFromCollisionGroup(true);
        cityProps2?.setCollisionFromCollisionGroup(true);
        office?.setCollisionByExclusion([-1],true);
        this.matter.world.convertTilemapLayer(office!);
        this.matter.world.convertTilemapLayer(cityProps!);
        this.matter.world.convertTilemapLayer(cityProps2!);

        this.matter.world.setBounds(0,32,2016,1408-32);

        //Load workers
        
        this.matter.add.sprite(20.2*32,31*32,'bouncer').setScale(0.8).setStatic(true);
        const phase = this.registry.get('phase') || 0;
        if(phase == 1){
        }else{
            this.matter.add.sprite(28*32,34*32,'worker1').setScale(2,2).setStatic(true);
            this.matter.add.sprite(30*32,34*32,'worker2').setScale(2,2).setStatic(true);
        }
        
    }

    loadUI(){
        //Infotext for Interaction
        this.infoText = this.add.text(1024/2, 768-50, 'Drücke die Leertaste zum Interagieren.', { font: '24px Arial', color: '#fff' });
        this.infoText.setVisible(false);
        this.infoText.setScrollFactor(0);
        this.infoText.setOrigin(0.5,0.5);
        this.infoText.setDepth(100);
    }

    loadFont(name: string, url: any) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

    createSpeechBubble (x: number, y: number, width: number, height: number, quote: string, destroyTime: number, target: Phaser.GameObjects.Sprite | undefined = undefined)
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

        if(target != undefined){
            this.time.addEvent({
                delay: 10, // this will run in the next frame
                loop: true,
                callback: () => {
                    // Follow the target's position
                    bubble.setPosition(target.x, target.y - target.height / 1.5 - bubbleHeight); // Adjust as needed
                    content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
                }
            });
        }
        
    }

    spawnCar() {
        // Zufällige Verzögerung für den nächsten Spawn (zwischen 1 und 3 Sekunden)
        const delay = Phaser.Math.Between(1000, 3000);
        const carTextures = ['v_ambulance', 'v_blueCar', 'v_brownBus', 'v_camper', 'v_copperCar', 'v_greenCar', 'v_orangeCar', 'v_redCar', 'v_yellowBus'];
        const roadY = 30*32;
        this.time.delayedCall(delay, () => {
            // Zufällige Textur auswählen
            const texture = Phaser.Utils.Array.GetRandom(carTextures);

            // Auto erstellen (außerhalb des Bildschirms rechts)
            const car = this.matter.add.sprite(5000, roadY, texture);

            // Geschwindigkeit setzen
            const speed = Phaser.Math.Between(100, 200); // Zufällige Geschwindigkeit

            car.setVelocityX(-speed);

            // Wenn das Auto außerhalb des Bildschirms links ist, zerstören
            car.setActive(true);
            car.setVisible(true);

            this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (car.x < -50) {
                        car.destroy();
                    }
                },
                loop: true
            });

            // Nächstes Auto spawnen
            this.spawnCar();
        });
    }


}
