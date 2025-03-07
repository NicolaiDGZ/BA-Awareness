import { Scene } from 'phaser';
import { quizManager } from './components/QuizManager';

export class QuizScene extends Scene {
    private currentQuestionIndex: number = 0;
    private selectedAnswers: boolean[] = [];
    private questionText!: Phaser.GameObjects.Text;
    private optionElements: Phaser.GameObjects.Text[] = [];
    private submitButton!: Phaser.GameObjects.Text;
    private infoText!: Phaser.GameObjects.Text;
    private continueButton!: Phaser.GameObjects.Text;
    //Keys
    private key1!: Phaser.Input.Keyboard.Key;
    private key2!: Phaser.Input.Keyboard.Key;
    private key3!: Phaser.Input.Keyboard.Key;
    private key4!: Phaser.Input.Keyboard.Key;
    private enterKey!: Phaser.Input.Keyboard.Key;
    continueText: import("phaser").GameObjects.Text;

    constructor() {
        super({ key: 'QuizScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#001100');
        this.addQuestions();
        this.currentQuestionIndex = 0;
        this.setupQuestion();
        this.setupKeyboardControls();
    }

    private addQuestions() {
        // Beispiel-Fragen für das Quiz
        quizManager.addQuestion("Was ist Social Engineering?", [
            "Versuch, Computer zu hacken",
            "Manipulation von Menschen",
            "Methode, Sicherheitskameras zu umgehen",
            "Entwicklung von sozialen Medien"
        ], 1, "Ein Social Engineer ist ein Manipulator");
        quizManager.addQuestion("Welches Verhalten sollte vermieden werden?", [
            "Dokumente wegwerfen",
            "Passwörter aufschreiben",
            "Gespräche in Öffentlichkeit vermeiden",
            "Sicherheitsrichtlinien missachten"
        ], [0,1], "Dokumente wegwerfen ist nichts schlimmes. Passwörter aufschreiben - böööse!");
    }

    private setupKeyboardControls() {
        // Initialize number keys
        this.key1 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Add event listeners
        this.key1.on('down', () => this.handleKeyPress(0));
        this.key2.on('down', () => this.handleKeyPress(1));
        this.key3.on('down', () => this.handleKeyPress(2));
        this.key4.on('down', () => this.handleKeyPress(3));
        this.enterKey.on('down', () => this.handleEnter());
    }

    private handleKeyPress(index: number) {
        // Only allow selection if options are available
        if (index < this.optionElements.length) {
            this.toggleOption(index);
        }
    }

    private handleEnter() {
        // Submit answer if in question phase
        if (this.submitButton?.active) {
            this.handleAnswerSubmission();
        }
        // Continue to next question if in feedback phase
        else if (this.continueButton?.active) {
            this.proceedToNext();
        }
        else{
            this.continue();
        }
    }

    private setupQuestion() {
        this.clearPreviousElements();
        this.displayQuestion();
        this.displayOptions();
        this.createSubmitButton();
    }

    private clearPreviousElements() {
        this.optionElements.forEach(option => option.destroy());
        this.optionElements = [];
        this.questionText?.destroy();
        this.submitButton?.destroy();
    }

    private displayQuestion() {
        const question = quizManager.getQuestion(this.currentQuestionIndex);
        this.questionText = this.add.text(100, 50, '> ' + question, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            wordWrap: { width: 700 },
            stroke: '#003300',
            strokeThickness: 2
        });
    }

    private displayOptions() {
        const options = quizManager.getOptions(this.currentQuestionIndex);
        this.selectedAnswers = new Array(options.length).fill(false);

        let yPosition = 150;
        options.forEach((option, index) => {
            const optionText = this.add.text(100, yPosition, `[${index + 1}] ${option}`, {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#00ff00',
                stroke: '#003300',
                strokeThickness: 2,
                padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', () => this.toggleOption(index))
            .on('pointerover', () => {
                optionText.setColor('#00ffff');
                optionText.setStroke('#005500', 3);
            })
            .on('pointerout', () => {
                optionText.setColor('#00ff00');
                optionText.setStroke('#003300', 2);
            });

            this.optionElements.push(optionText);
            yPosition += 50;
        });
    }

    private createSubmitButton() {
        this.submitButton = this.add.text(100, 400, '> SUBMIT', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => this.handleAnswerSubmission())
        .on('pointerover', () => {
            this.submitButton.setColor('#00ffff');
            this.submitButton.setStroke('#005500', 3);
        })
        .on('pointerout', () => {
            this.submitButton.setColor('#00ff00');
            this.submitButton.setStroke('#003300', 2);
        });
    }

    private toggleOption(index: number) {
        this.selectedAnswers[index] = !this.selectedAnswers[index];
        const option = this.optionElements[index];
        const text = this.selectedAnswers[index] ? `> ${option.text}` : option.text.replace(/^> /, '');
        option.setText(text);
        option.setStyle({ 
            color: this.selectedAnswers[index] ? '#00ff55' : '#00ff00',
            stroke: this.selectedAnswers[index] ? '#005500' : '#003300'
        });
    }

    private handleAnswerSubmission() {
        quizManager.answerMultipleChoiceQuestion(this.currentQuestionIndex, this.selectedAnswers);
        const isCorrect = quizManager.isAnswerCorrect(this.currentQuestionIndex);
        this.showQuestionFeedback(isCorrect);
    }

    private showQuestionFeedback(isCorrect: boolean) {
        this.clearInteractiveElements();
        this.displayInfoText(isCorrect);
        this.createContinueButton();
    }

    private clearInteractiveElements() {
        this.submitButton?.destroy();
        this.optionElements.forEach(option => option.destroy());
    }

    private displayInfoText(isCorrect: boolean) {
        const info = quizManager.getInfoText(this.currentQuestionIndex, isCorrect);
        this.infoText = this.add.text(100, 400, '> ' + info, {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: isCorrect ? '#00ff00' : '#ff5555',
            stroke: isCorrect ? '#003300' : '#330000',
            strokeThickness: 2,
            wordWrap: { width: 700 },
            padding: { x: 10, y: 10 }
        });
    }

    private createContinueButton() {
        this.continueButton = this.add.text(100, 500, '> CONTINUE', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => this.proceedToNext())
        .on('pointerover', () => {
            this.continueButton.setColor('#00ffff');
            this.continueButton.setStroke('#005500', 3);
        })
        .on('pointerout', () => {
            this.continueButton.setColor('#00ff00');
            this.continueButton.setStroke('#003300', 2);
        });
    }

    private proceedToNext() {
        this.infoText?.destroy();
        this.continueButton?.destroy();

        if (this.currentQuestionIndex < quizManager.getTotalQuestions() - 1) {
            this.currentQuestionIndex++;
            this.setupQuestion();
        } else {
            this.showFinalScore();
        }
    }

    private showFinalScore() {
        this.clearPreviousElements();
        this.clearInteractiveElements();
        
        const score = quizManager.calculateScore();
        const total = quizManager.getTotalQuestions();
        
        this.add.text(100, 100, '> QUIZ COMPLETE', { 
            fontFamily: 'Courier New',
            fontSize: '32px', 
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        });
        
        this.add.text(100, 150, `> SCORE: ${score}/${total}`, { 
            fontFamily: 'Courier New',
            fontSize: '28px', 
            color: '#00ffff',
            stroke: '#003300',
            strokeThickness: 2
        });
        
        // Restart option
        this.continueText = this.add.text(100, 250, '> Continue', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => this.continue())
        .on('pointerover', () => {
            this.continueText.setColor('#00ffff');
            this.continueText.setStroke('#005500', 3);
        })
        .on('pointerout', () => {
            this.continueText.setColor('#00ff00');
            this.continueText.setStroke('#003300', 2);
        });
    }

    private continue() {
        quizManager.reset();
        this.currentQuestionIndex = 0;
        
        this.scene.start('InfoScreen', {
            title: 'Rückblick',
            message: 'In dieser Mission haben wir wichtige Lektionen über die Informationssicherheit gelernt:\n\n> Auch scheinbar unwichtige Informationen können von Angreifern oder Social Engineers genutzt werden, um Schaden anzurichten.\n\n> Mitarbeiter sollten daher sorgsam achten, welche Informationen sie wie entsorgen.\n\n> Sensible Informationen dürfen nicht in der öffentlichkeit besprochen werden, um potenzielle Abhörversuche vorzubeugen.\n\nWeitere Informationen finden Sie im E-Learning zur Informationssicherheit.',
            scene: '#InfoScreen'});
    }
}