import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class KeyPad extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    pinText: Phaser.GameObjects.Text;
    correctPin: any;
    enteredPin: string;
    maxPinLength: number;
    enteredPinText: Phaser.GameObjects.Text;

    constructor() {
        super('KeyPad');
    }

    create() {
        this.enteredPin = '';  // The PIN being entered by the player
        this.correctPin = '1234';  // Correct PIN
        this.maxPinLength = 4;  // Maximum PIN length

        // Set the background color of the KeyPadScene
        this.cameras.main.setBackgroundColor('#222222');
        this.cameras.main.setViewport(250, 100, 300, 500);  // Set the viewport to 300x500 and position it centrally

        // Styling for the PIN text
        this.pinText = this.add.text(150, 150, 'Enter PIN:', {
            fontSize: '24px',  // Adjusted to fit within the smaller area
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Display the entered PIN
        this.enteredPinText = this.add.text(50, 190, '', {
            fontSize: '32px',  // Adjusted font size
            color: '#00ff00',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create the keypad layout
        this.createKeyPad();

        // Add a close button
        this.add.text(50, 0, 'Close KeyPad', {
            fontSize: '20px',
            color: '#ff3333',
            backgroundColor: '#550000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.stop();  // Stop the KeyPad scene when clicked
            });
    }

    createKeyPad() {
        const buttonSize = 60;  // Button size adjusted to fit
        const startX = 50;     // Adjusted position for the keypad to fit within 300x500
        const startY = 240;
        const gap = 10;         // Smaller gap between buttons

        // Loop to create number buttons (1-9)
        let index = 1;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                this.createButton(startX + (col * (buttonSize + gap)), startY + (row * (buttonSize + gap)), "" + index, undefined);
                index++;
            }
        }

        // Add 0 button centered below
        this.createButton(startX + buttonSize + gap, startY + 3 * (buttonSize + gap), "" + 0, undefined);

        // Add clear and submit buttons
        this.createButton(startX, startY + 3 * (buttonSize + gap), 'C', this.clearPin.bind(this));
        this.createButton(startX + 2 * (buttonSize + gap), startY + 3 * (buttonSize + gap), 'OK', this.checkPin.bind(this));
    }

    createButton(x: number, y: number, label: string, onClickCallback: { (): void } | undefined) {
        // Create button rectangle with text in the center
        let button = this.add.rectangle(x, y, 60, 60, 0x333333)  // Adjusted size
            .setStrokeStyle(3, 0xffffff)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                if (typeof onClickCallback === 'function') {
                    onClickCallback();  // Execute the callback if provided
                } else {
                    this.onKeyPress(label);  // Otherwise handle as a number button
                }
            });

        // Add the text to the button
        this.add.text(x, y, label, {
            fontSize: '20px',  // Adjusted font size
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    onKeyPress(value: string) {
        if (this.enteredPin.length < this.maxPinLength) {
            this.enteredPin += value;
            this.updatePinText();
        }
    }

    clearPin() {
        this.enteredPin = '';
        this.updatePinText();
    }

    checkPin() {
        if (this.enteredPin === this.correctPin) {
            this.pinText.setText('Enter PIN: Correct!');
            this.enteredPinText.setColor('#00ff00');  // Green text for correct PIN
            console.log('Door unlocked!');
        } else {
            this.pinText.setText('Enter PIN: Incorrect!');
            this.enteredPinText.setColor('#ff0000');  // Red text for incorrect PIN
            console.log('Wrong PIN');
            this.clearPin();
        }
    }

    updatePinText() {
        this.enteredPinText.setText('*'.repeat(this.enteredPin.length));
    }
}
