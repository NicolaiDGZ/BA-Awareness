import { Scene } from 'phaser';

export class RecapScene extends Scene {

    constructor() {
        super('RecapScene');
    }

    create(){
        this.add.image(0,0,"learnings").setOrigin(0,0);
        this.add.rectangle(261,637,496,97)
            .setOrigin(0,0)
            .setInteractive()
            .on('pointerdown', () => this.continue());
    }
    continue() {
        console.log("Weiter geklickt.")
    }

    
}