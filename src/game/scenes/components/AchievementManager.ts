export class AchievementManager {
    private static achievements: { [key: string]: { title: string; description: string; unlocked: boolean } } = {
        //Quiz
        "perfect_quiz": { title: "Perfektes Quiz!", description: "Beantworte alle Fragen richtig.", unlocked: false },
        "quick_thinker": { title: "Schnelldenker!", description: "Beantworte eine Frage in unter 5 Sekunden.", unlocked: false },
        //Karrierelevel
        "career_1": { title: "Anfänger", description: "[Karriere 1/4] \nStarte deine Karriere als Social Engineer.", unlocked: false },
        "career_2": { title: "Trickser", description: "[Karriere 2/4] \nMitarbeiterkarte erfolgreich gefälscht.", unlocked: false },
        "career_3": { title: "Täuschungskünstler", description: "[Karriere 3/4] \nDu hast eine überzeugende Spearphishing-Mail erstellt.", unlocked: false },
        "career_4": { title: "Mastermind", description: "[Karriere 4/4] \nDu bist zum Profi-Social Engineer aufgestiegen.", unlocked: false },
        //Easter Eggs
        "joke": { title: "Schlechter Witz", description: "Du hast ein Easter-Egg gefunden und musstest einen schlechten Witz lesen.", unlocked: false },
        "thorough": { title: "Gründlich", description: "Auch in hier könnten Informationen zu finden sein. Diesmal aber nicht.", unlocked: false },
        //Learning
        "learning_1": { title: "Basiswissen", description: "[Lerneinheit 1/2]\nDu hast die erste Lerneinheit absolviert.", unlocked: false },
        "learning_2": { title: "Fachwissen", description: "[Lerneinheit 1/2]\nDu hast die zweite Lerneinheit absolviert.", unlocked: false },
    };
    

    // Lade gespeicherte Achievements
    public static loadAchievements() {
        const saved = localStorage.getItem("achievements");
        if (saved) {
            this.achievements = JSON.parse(saved);
        }
    }

    // Speichert den aktuellen Fortschritt
    private static saveAchievements() {
        localStorage.setItem("achievements", JSON.stringify(this.achievements));
    }

    // Prüft, ob ein Achievement freigeschaltet wurde
    public static unlockAchievement(key: string, scene: Phaser.Scene) {
        if (!this.achievements[key] || this.achievements[key].unlocked) return;

        this.achievements[key].unlocked = true;
        this.saveAchievements();
        const uiScene = scene.scene.get("UIScene");
        uiScene.events.emit("showAchievement", this.achievements[key]);
    }

    // Gibt den aktuellen Stand der Achievements zurück
    public static getAchievements() {
        return this.achievements;
    }
}
