import { Scene } from "phaser";
import { customEmitter, TASK_EVENTS } from "./components/events";

export class PopupScene extends Scene {
    private image: Phaser.GameObjects.Image;
    private imageKey: string;
    private closeButton: Phaser.GameObjects.Image;
    private returnScene: string;
    private imageScale: number;
    private popupBackground: Phaser.GameObjects.Graphics;
    private dimOverlay: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "PopupScene" });
    }

    init(data: { imageKey: string; imageScale: number; returnScene: string }) {
        this.imageKey = data.imageKey;
        this.returnScene = data.returnScene || "Indoor";
        this.imageScale = data.imageScale || 1;
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Add dim overlay
        this.dimOverlay = this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.7
        )
            .setOrigin(0)
            .setDepth(0)
            .setAlpha(0);

        // Create main image
        this.textures.get(this.imageKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.image = this.add.image(centerX, centerY, this.imageKey)
            .setScale(this.imageScale)
            .setAlpha(0)
            .setDepth(10);
        

        const imageWidth = this.image.displayWidth;
        const imageHeight = this.image.displayHeight;
        // Create close button (position relative to popup)
        const closeButtonX = centerX;
        const closeButtonY = centerY + imageHeight / 2  + 36;

        this.closeButton = this.add.image(closeButtonX, closeButtonY, "closeButton")
            .setScale(0.5)
            .setInteractive({ cursor: "pointer" })
            .setDepth(3)
            .setAlpha(0);


        // Calculate popup dimensions
        const padding = 40;
        const popupWidth = imageWidth + padding;
        const popupHeight = imageHeight + padding;
        const cornerRadius = 20;

        // Create popup background
        this.popupBackground = this.add.graphics()
            .fillStyle(0x1a1a1a, 1)
            .fillRoundedRect(
                centerX - popupWidth / 2,
                centerY - popupHeight / 2,
                popupWidth,
                popupHeight + this.closeButton.displayHeight,
                cornerRadius
            )
            .lineStyle(2, 0xffffff, 0.2)
            .strokeRoundedRect(
                centerX - popupWidth / 2,
                centerY - popupHeight / 2,
                popupWidth,
                popupHeight + this.closeButton.displayHeight,
                cornerRadius
            )
            .setDepth(1)
            .setAlpha(0);

            // Add image frame/border
            const frame = this.add.graphics()
            .lineStyle(3, 0xffffff, 0.3)
            .strokeRoundedRect(
                centerX - imageWidth / 2 - 5,
                centerY - imageHeight / 2 - 5,
                imageWidth + 10,
                imageHeight + 10,
                10
            )
            .setDepth(2)
            .setAlpha(0);


        // Close button hover effects
        this.closeButton
            .on("pointerover", () => {
                this.closeButton.setScale(0.55);
            })
            .on("pointerout", () => {
                this.closeButton.setScale(0.5);
            })
            .on("pointerdown", () => {
                this.scene.resume(this.returnScene);
                customEmitter.emit(TASK_EVENTS.SET_VISIBLE);
                this.scene.stop();
            });

            

        // Animate elements in
        this.tweens.add({
            targets: [this.dimOverlay, this.popupBackground, this.image, frame, this.closeButton],
            alpha: { from: 0, to: 1 },
            duration: 300,
            ease: "Back.easeOut"
        });
    }   
}