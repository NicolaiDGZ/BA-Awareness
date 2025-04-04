export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: "UIScene", active: true });
    }

    create() {
        this.events.on("showAchievement", this.showAchievement, this);
    }

    private showAchievement(data: { title: string; description: string; icon: string }) {
        const popup = this.add.container(900, 50); // Start außerhalb des Bildschirms

        // Hintergrund (Dunkelgrün)
        const bg = this.add.graphics();
        bg.fillStyle(0x003300, 1); // Hintergrundfarbe passend zur Quizszene
        bg.fillRect(0, 0, 320, 100); // Rechteck ohne Abrundung
        bg.lineStyle(2, 0x00ff00); // Grüner Rahmen
        bg.strokeRect(0, 0, 320, 100);
        popup.add(bg);

        // Icon (angepasste Position & Größe)
        const icon = this.add.image(40, 50, 'trophy').setScale(0.2);
        popup.add(icon);

        // Titel (Grüner Text)
        const title = this.add.text(80, 10, data.title, {
            fontFamily: "Courier New",
            fontSize: "20px",
            color: "#00ff00",
        });
        popup.add(title);

        // Beschreibung (Grün, Word-Wrapping)
        const description = this.add.text(80, 40, data.description, {
            fontFamily: "Courier New",
            fontSize: "16px",
            color: "#00ff00",
            wordWrap: { width: 235, useAdvancedWrap: true },
        });
        popup.add(description);

        this.add.existing(popup);

        // **Animation: Einblenden**
        this.tweens.add({
            targets: popup,
            x: 680, // Sichtbare Position
            duration: 600,
            ease: "Cubic.easeOut",
        });

        // **Länger sichtbar (5 Sekunden)**
        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: popup,
                x: 900, // Zurück nach rechts
                duration: 600,
                ease: "Cubic.easeIn",
                onComplete: () => popup.destroy(),
            });
        });
    }
}
