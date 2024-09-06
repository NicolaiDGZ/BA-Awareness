import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.loadTiles();
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
        map.createLayer('CityProps',[ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
        map.createLayer('CityProps2', [ts_city_terrains!,ts_terrains_fences!,ts_vehicles!,ts_city_props!,ts_post_office!,ts_office!]);
    }
}
