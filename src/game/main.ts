import { Boot } from './scenes/Boot';
import { InfoScreen } from './scenes/InfoScreen.ts';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scene } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { VisitorPass } from './scenes/VisitorPass.ts';
import { KeyPad } from './scenes/KeyPad';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import { InfoBoxScene } from './scenes/InfoBoxScene';
import { QuizScene } from './scenes/QuizScene.ts';
import { RecapScene } from './scenes/RecapScene.ts';
import { Indoor } from './scenes/Indoor.ts';
import { PopupScene } from './scenes/PopupScene.ts';
import { SpearPhishingScene } from './scenes/SpearPhishingScene.ts';
import { FreeTextScene } from './scenes/FreeTextScene.ts';
import { MailLoginScene } from './scenes/MailLoginScene.ts';
import ThankYouScreen from './scenes/ThankYouScreen.ts';
import { UIScene } from './scenes/UIScene.ts';


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    //backgroundColor: '#988f8a',
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [
        Boot,
        Preloader,
        MainMenu,
        VisitorPass,
        KeyPad,
        MainGame,
        InfoBoxScene,
        RecapScene,
        Indoor,
        QuizScene,
        InfoScreen,
        PopupScene,
        SpearPhishingScene,
        FreeTextScene,
        MailLoginScene,
        ThankYouScreen,
        UIScene
    ],
    physics: {
        default: 'matter',
        matter: {
            gravity: { x:0, y:0}
            ,debug: true
        }
    },
    dom: {
        createContainer: true
    },
    plugins: {
        global: [{
            key: 'rexInputTextPlugin',
            plugin: InputTextPlugin,
            start: true
            //mapping: 'rexUI'
        },
        ]
    },
    scale: { 
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    antialias: true
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });
}

export default StartGame;
