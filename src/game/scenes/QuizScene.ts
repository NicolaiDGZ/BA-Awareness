import { Scene } from 'phaser';
import { quizManager } from './components/QuizManager';

export class QuizScene extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    questionText: Phaser.GameObjects.Text;
    instructionText: Phaser.GameObjects.Text;
    options: { text: Phaser.GameObjects.Text; checkbox: Phaser.GameObjects.Image }[] = [];
    currentQuestionIndex: number = 0;
    selectedAnswers: boolean[] = [];
    confirmButton: Phaser.GameObjects.Text;

    constructor() {
        super('QuizScene');
    }

    init() {
        // Beispiel-Fragen für das Quiz
        quizManager.addQuestion("Was ist Social Engineering?", [
            "Versuch, Computer zu hacken",
            "Manipulation von Menschen",
            "Methode, Sicherheitskameras zu umgehen",
            "Entwicklung von sozialen Medien"
        ], 1);
        quizManager.addQuestion("Welches Verhalten sollte vermieden werden?", [
            "Dokumente wegwerfen",
            "Passwörter behalten",
            "Gespräche in Öffentlichkeit vermeiden",
            "Sicherheitsrichtlinien missachten"
        ], 0);
    }

    create() {
        console.log("QuizScene created.");
        // Hintergrund und Kamera
        this.camera = this.cameras.main;
        this.add.rectangle(0, 0, 1024, 768, 0x369ea6, 1).setOrigin(0, 0);

        // Fragen-Text (oberer Bereich)
        this.questionText = this.add.text(512, 100, '', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center', wordWrap: { width: 800, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(100);

        // Frage-Box
        const questionRectangle = this.add.graphics()
            .fillStyle(0xe9ddaf, 1)
            .fillRoundedRect(112, 180, 800, 300, 15)
            .lineStyle(5, 0x0, 1)
            .strokeRoundedRect(112, 180, 800, 300, 15);

        // Anweisungs-Text (unten)
        this.instructionText = this.add.text(512, 700, 'Wähle eine oder mehrere Antworten und bestätige', { font: '24px Arial', color: '#fff' })
            .setDepth(100).setOrigin(0.5);

        // Animation für Anweisungs-Text
        this.tweens.add({
            targets: this.instructionText,
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Bestätigen-Button
        this.confirmButton = this.add.text(512, 600, 'Bestätigen', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.handleConfirm())
            .setDepth(100);

        // Styling für den Bestätigen-Button
        const confirmButtonRectangle = this.add.graphics()
            .fillStyle(0x4CAF50, 1) // Grüner Farbton
            .fillRoundedRect(this.confirmButton.x - this.confirmButton.width / 2 - 15, this.confirmButton.y - this.confirmButton.height / 2 - 10, this.confirmButton.width + 30, this.confirmButton.height + 20, 10)
            .lineStyle(3, 0x0, 1)
            .strokeRoundedRect(this.confirmButton.x - this.confirmButton.width / 2 - 15, this.confirmButton.y - this.confirmButton.height / 2 - 10, this.confirmButton.width + 30, this.confirmButton.height + 20, 10);

        // Zeigt die erste Frage an
        this.displayQuestion();
    }

    // Zeigt die aktuelle Frage und ihre Antwortmöglichkeiten an
    private displayQuestion() {
        const question = quizManager.getQuestion(this.currentQuestionIndex);
        const options = quizManager.getOptions(this.currentQuestionIndex);

        this.questionText.setText(question);

        // Löscht alte Optionen
        this.options.forEach(option => {
            option.text.destroy();
            option.checkbox.destroy();
        });
        this.options = [];
        this.selectedAnswers = Array(options.length).fill(false);

        options.forEach((optionText, index) => {
            const contentY = 220 + index * 50;

            // Checkbox
            const checkbox = this.add.image(170, contentY, this.selectedAnswers[index] ? 'cb_true' : 'cb_false')
                .setInteractive()
                .on('pointerdown', () => this.toggleAnswer(index));

            // Antworttext
            const answerText = this.add.text(250, contentY, optionText, {
                fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
                stroke: '#000000', strokeThickness: 3,
                align: 'left'
            }).setOrigin(0, 0.5)
              .setInteractive() // Interaktiv machen
              .on('pointerdown', () => this.toggleAnswer(index)); // Toggle bei Klick

            // Antwortbox für visuelle Konsistenz
            const answerRectangle = this.add.graphics()
                .fillStyle(0xe9ddaf, 1)
                .fillRoundedRect(150, contentY - 20, 650, 40, 10)
                .lineStyle(3, 0x0, 1)
                .strokeRoundedRect(150, contentY - 20, 650, 40, 10);

            // Speichert Checkbox und Text in der Optionsliste
            this.options.push({ text: answerText, checkbox: checkbox });
        });
    }

    private toggleAnswer(index: number) {
        this.selectedAnswers[index] = !this.selectedAnswers[index];
        const checkbox = this.options[index].checkbox;
        checkbox.setTexture(this.selectedAnswers[index] ? 'cb_true' : 'cb_false');
    }

    private handleConfirm() {
        quizManager.answerMultipleChoiceQuestion(this.currentQuestionIndex, this.selectedAnswers);
        const isCorrect = quizManager.isAnswerCorrect(this.currentQuestionIndex);
        console.log(isCorrect ? "Richtige Antwort!" : "Falsche Antwort!");

        if (this.currentQuestionIndex < quizManager.getTotalQuestions() - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    private showResults() {
        this.questionText.setText('');
        this.options.forEach(option => {
            option.text.destroy();
            option.checkbox.destroy();
        });
        this.options = [];

        const score = quizManager.calculateScore();
        this.add.text(512, 384, `Dein Ergebnis: ${score} / ${quizManager.getTotalQuestions()}`, {
            fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const endText = this.add.text(512, 700, 'Drücke die Leertaste um zurückzukehren', { font: '24px Arial', color: '#fff' })
            .setDepth(100).setOrigin(0.5);

        this.tweens.add({
            targets: endText,
            scale: { from: 0.95, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        const spaceBar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', () => this.scene.start('InfoScreen'));
    }
}