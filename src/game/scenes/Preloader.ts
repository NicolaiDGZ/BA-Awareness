import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('cv', 'cv.png');
        this.load.image('notesVisitorPass', 'notesVisitorPass.png');
        this.load.image('visitor_pass', 'visitor_pass.png');
        this.load.image('closeButton', 'closeButton.png');
        this.load.image('worker1', 'worker1.png');
        this.load.image('worker2', 'worker2.png');
        this.load.image('bouncer', 'bouncer.png');
        this.load.image('desk', 'desk.png');
        this.load.image('socialMediaPost','socialMediaPost.png');
        this.load.image('learnings', 'learnings.png');
        this.load.image('backgroundImage','ui/backgroundImage.png')
        this.load.image('tasks','ui/tasks.png')
        this.load.image('cb_false','ui/checkbox_false.png');
        this.load.image('cb_true','ui/checkbox_true.png');
        this.load.image('nothingtofind','ui/nothingtofind.png');
        this.load.image('controls','ui/Controls.png');
        this.load.image('scanlines','scanlines.jpg');

        // Tilesets
        this.load.setPath('assets/tileSets');
        this.load.image('ts_terrains_fences','ts_terrains_fences.png');
        this.load.image('ts_city_terrains','ts_city_terrains.png');
        this.load.image('ts_vehicles','ts_vehicles.png');
        this.load.image('ts_city_props','ts_city_props.png');
        this.load.image('ts_office','ts_office.png');
        this.load.image('ts_post_office','ts_post_office.png');

        this.load.spritesheet('ts_player','ts_player.png', { frameWidth: 32, frameHeight: 64});
        //Indoor
        this.load.setPath('assets/tileSets/Indoor');
        this.load.image('ts_basement','ts_basement.png');
        this.load.image('ts_bathroom','ts_bathroom.png');
        this.load.image('ts_classroomAndLibrary','ts_classroomAndLibrary.png');
        this.load.image('ts_generic','ts_generic.png');
        this.load.image('ts_modernOffice','ts_modernOffice.png');
        this.load.image('ts_museum','ts_museum.png');
        this.load.image('ts_jail','ts_jail.png');
        this.load.image('ts_kitchen','ts_kitchen.png');

        this.load.spritesheet('ts_roomBuilder','ts_roomBuilder.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('ts_roomBuilderOffice','ts_roomBuilderOffice.png');
        this.load.spritesheet('ts_a_turnstile','ts_a_turnstile.png', { frameWidth: 64, frameHeight: 96});
        this.load.spritesheet('ts_a_coffee','ts_a_coffee.png', { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('ts_char_1','ts_char_1.png', { frameWidth: 32, frameHeight: 64});
        this.load.spritesheet('ts_char_2','ts_char_2.png', { frameWidth: 32, frameHeight: 64});
        this.load.spritesheet('ts_char_3','ts_char_3.png', { frameWidth: 32, frameHeight: 64});
        this.load.spritesheet('ts_a_seccamera','ts_a_seccamera.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('ts_seccam_cone','ts_seccam_cone.png');
        this.load.image('ts_highlight','ts_highlight.png');
        //Indoorfindings
        this.load.setPath('assets/indoorFindings');
        this.load.image('visitorlist','visitorlist.png');
        this.load.image('serverName','serverName.png');
        this.load.image('serverNote','serverNote.png');
        this.load.image('sudoku','sudoku.png');
        this.load.image('architecture','architecture.png');
        this.load.image('photoCertificate','photoCertificate.png');
        this.load.image('cameraShop','cameraShop.png');
        this.load.image('organigramm','organigramm.png');
        this.load.image('crossword','crossword.png');
        this.load.image('summerparty','summerparty.png');

        //Vehicles
        this.load.setPath('assets/vehicles');
        this.load.image('v_ambulance','v_ambulance.png');
        this.load.image('v_blueCar','v_blueCar.png');
        this.load.image('v_brownBus','v_brownBus.png');
        this.load.image('v_camper','v_camper.png');
        this.load.image('v_copperCar','v_copperCar.png');
        this.load.image('v_greenCar','v_greenCar.png');
        this.load.image('v_orangeCar','v_orangeCar.png');
        this.load.image('v_redCar','v_redCar.png');
        this.load.image('v_yellowBus','v_yellowBus.png');


        // TileMaps
        this.load.setPath('assets/tileMaps');
        this.load.tilemapTiledJSON('outdoor', 'Outdoor.json')
        
        this.load.tilemapTiledJSON('indoor', 'Indoor.json')
        this.load.tilemapTiledJSON('test', 'Test.json')
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
