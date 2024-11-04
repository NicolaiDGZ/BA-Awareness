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
        this.load.image('visitor_pass', 'visitor_pass.png');

        this.load.image('worker1', 'worker1.png');
        this.load.image('worker2', 'worker2.png');
        this.load.image('desk', 'desk.png');
        this.load.image('learnings', 'learnings.png');

        this.load.image('tasks','ui/tasks.png')
        this.load.image('cb_false','ui/checkbox_false.png');
        this.load.image('cb_true','ui/checkbox_true.png');
        this.load.image('nothingtofind','ui/nothingtofind.png');

        // Tilesets
        this.load.setPath('assets/tileSets');
        this.load.image('ts_terrains_fences','ts_terrains_fences.png');
        this.load.image('ts_city_terrains','ts_city_terrains.png');
        this.load.image('ts_vehicles','ts_vehicles.png');
        this.load.image('ts_city_props','ts_city_props.png');
        this.load.image('ts_office','ts_office.png');
        this.load.image('ts_post_office','ts_post_office.png');

        this.load.spritesheet('ts_player','ts_character.png', { frameWidth: 64, frameHeight: 64});

        // TileMaps
        this.load.setPath('assets/tileMaps');
        this.load.tilemapTiledJSON('outdoor', 'Outdoor.json')
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
