import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { VisitorPass } from './scenes/VisitorPass.ts';
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { KeyPad } from './scenes/KeyPad';
import { InfoBoxScene } from './scenes/InfoBoxScene';


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        VisitorPass,
        KeyPad,
        MainGame,
        InfoBoxScene,
        GameOver
    ],
    physics: {
        default: 'matter',
        matter: {
            gravity: { x:0, y:0}
            //,debug: true
        }
    },
    dom: {
        createContainer: true
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        },
        ]
    },
    scale: { 
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
