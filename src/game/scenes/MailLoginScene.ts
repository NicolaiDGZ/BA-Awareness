import { Scene } from "phaser";
import { sceneManager } from "./components/SceneManager";

export class MailLoginScene extends Scene {
    private emailInput: any;
    private passwordInput: any;
    private outputText: any;
    private validEmail: string = "dominik.diktat@g-neric.de";
    private validPassword: string = "DiktatMailPasswort";

    constructor() {
        super({ key: "MailLoginScene" });
    }

    create() {
        this.cameras.main.setBackgroundColor("#001100");
        
        this.registry.set('phase',3);
        const textStyle = {
            fontFamily: "Courier New",
            fontSize: "20px",
            color: "#00ff00",
            align: "left"
        };

        let yPos = 50;

        // Keylogger-Output
        const keylogOutput = [
            "> Keylogger active...",
            "> User clicked at [153,623]",
            "> User entered: photo-Shop25.de",
            "> User clicked at [734,1443]",
            "> User entered: dominik.diktat@g-neric.de",
            "> User clicked at [84,233]",
            "> User entered: DiktatPhotoPasswort",
            "> User clicked at [1253,63]",
            "> User clicked at [988,384]",
            "> User clicked at [183,844]",
            "> keylogger.stop();",
            "> genericmailserver.authenticate();",
            ">  //Anmeldung auf der Mail von Dominik Diktat"
        ];

        keylogOutput.forEach((line) => {
            this.add.text(50, yPos, line, textStyle);
            yPos += 30;
        });

        yPos += 20;

        // Eingabefelder
        this.add.text(50, yPos, "> Enter email:", textStyle);
        this.emailInput = this.add.rexInputText(260, yPos + 8, 300, 30, {
            type: "text",
            fontSize: "20px",
            color: "#00ff00",
            placeholder: "Mail..",
            backgroundColor: "#001100",
            border: 2,
            fontFamily: "Courier New"
        }).setOrigin(0, 0.5);
        yPos += 40;

        this.add.text(50, yPos, "> Enter password:", textStyle);
        this.passwordInput = this.add.rexInputText(260, yPos + 8, 300, 30, {
            type: "password",
            fontSize: "20px",
            color: "#00ff00",
            placeholder: "Password..",
            backgroundColor: "#001100",
            border: 2,
            fontFamily: "Courier New"
        }).setOrigin(0, 0.5);
        yPos += 150;

        // Bestätigungsbutton
        const confirmButton = this.add.text(512, yPos, "> CONFIRM", {
            fontFamily: "Courier New",
            fontSize: "24px",
            color: "#00ff00",
            stroke: "#003300",
            strokeThickness: 2
        })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerover", () => confirmButton.setColor("#00ffff"))
            .on("pointerout", () => confirmButton.setColor("#00ff00"))
            .on("pointerdown", () => this.checkLogin());

        this.tweens.add({
            targets: confirmButton,
            scale: { from: 0.95, to: 1.05 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    checkLogin() {
        const userEmail = this.emailInput.text.trim();
        const userPassword = this.passwordInput.text.trim();

        if (userEmail === this.validEmail && userPassword === this.validPassword) {
            this.showMessage("Sie werden eingeloggt...", true);
        } else if (userEmail === this.validEmail && userPassword != this.validPassword){
            this.showMessage("Passwort falsch, probiere es erneut.", false);
        }else if (userEmail != this.validEmail && userPassword === this.validPassword){
            this.showMessage("Mail falsch, probiere es erneut.", false);
        }else{
            this.showMessage("Anmeldedaten falsch, probiere es erneut.", false);
        }
    }

    showMessage(message: string, success: boolean) {
        const screenWidth = 1024;
        const screenHeight = 768;
        this.passwordInput.visible = false;
        this.emailInput.visible = false;
        const background = this.add.rectangle(
            screenWidth / 2,
            screenHeight / 2,
            600,
            200,
            0x111111
        ).setStrokeStyle(2, success? 0x00ff00 : 0xff0000);

        const textStyle = {
            fontSize: "22px",
            fontFamily: "Courier New",
            color: "#00ff00",
            wordWrap: { width: 560, useAdvancedWrap: true }
        };

        const resultText = this.add.text(screenWidth / 2 - 280, screenHeight / 2 - 50, message, textStyle);
        const blinkingCursor = this.add.text(screenWidth / 2 - 280, screenHeight / 2 + 50, "_", textStyle);

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                blinkingCursor.visible = !blinkingCursor.visible;
            }
        });

        this.time.delayedCall(3000, () =>{
            background.destroy();
            resultText.destroy();
            
            this.passwordInput.visible = true;
            this.emailInput.visible = true;
            blinkingCursor.destroy();
            if (success) {
                this.time.delayedCall(3000, () => {
                    const nextScene = sceneManager.getNextScene();
                    this.scene.start(nextScene?.key, nextScene?.data);
                });
            }
        })
    }
}
