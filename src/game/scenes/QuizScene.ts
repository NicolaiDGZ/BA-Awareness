import { Scene } from 'phaser';
import { quizManager } from './components/QuizManager';
import { sceneManager } from './components/SceneManager';
import { AchievementManager } from './components/AchievementManager';

export class QuizScene extends Scene {
    private currentQuestionIndex: number = 0;
    private selectedAnswers: boolean[] = [];
    private progressBar!: Phaser.GameObjects.Graphics;
    private questionText!: Phaser.GameObjects.Text;
    private optionElements: Phaser.GameObjects.Text[] = [];
    private submitButton!: Phaser.GameObjects.Text;
    private infoText!: Phaser.GameObjects.Text;
    private continueButton!: Phaser.GameObjects.Text;
    //Score
    private score: number;
    private scoreText!: Phaser.GameObjects.Text;
    private combo: number;
    //Timer
    private timeLeft: number = 150;
    private totalTime: number = 150;
    private timerGraphics!: Phaser.GameObjects.Graphics;
    private timerEvent!: Phaser.Time.TimerEvent | null;
    //Keys
    private key1!: Phaser.Input.Keyboard.Key;
    private key2!: Phaser.Input.Keyboard.Key;
    private key3!: Phaser.Input.Keyboard.Key;
    private key4!: Phaser.Input.Keyboard.Key;
    private enterKey!: Phaser.Input.Keyboard.Key;
    continueText: import("phaser").GameObjects.Text;
    questionIndexText: import("phaser").GameObjects.Text;

    constructor() {
        super({ key: 'QuizScene' });
    }

    create() {
        this.score = 0;
        this.combo = 1;
        this.scoreText = this.add.text(900, 100, '0', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);
        //Timer
        this.timerGraphics = this.add.graphics();
        this.startTimer();
        this.cameras.main.setBackgroundColor('#001100');
        this.add.text(100, 40, '> Quiz', {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#00ff00',
            wordWrap: { width: 700 },
            stroke: '#003300',
            strokeThickness: 2
        });
        
        this.addQuestions();

        this.currentQuestionIndex = 0;
        this.setupQuestion();
        this.setupKeyboardControls();
        this.createProgressBar();
    }

    private startTimer() {
        this.timeLeft = this.totalTime; // Zeit zurücksetzen
        this.updateCircularTimer(); // Neu zeichnen
    
        if (this.timerEvent) {
            this.timerEvent.remove(); // Falls ein alter Timer existiert, stoppen
        }
    
        this.timerEvent = this.time.addEvent({
            delay: 100,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    private stopTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove(); // Timer-Event stoppen
            this.timerEvent = null;
        }
    }
    
    private updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateCircularTimer(); // Timer visuell updaten
        }
    }

    private updateCircularTimer() {
        this.timerGraphics.clear(); // Vorherigen Kreis löschen
    
        const centerX = 900; // X-Position des Kreises
        const centerY = 100; // Y-Position des Kreises
        const radius = 40; // Radius des Kreises
        const startAngle = Phaser.Math.DegToRad(270); // Oben als Startpunkt
        const endAngle = startAngle + Phaser.Math.DegToRad((this.timeLeft / this.totalTime) * 360);
    
        // Hintergrundkreis (leerer Timer)
        this.timerGraphics.lineStyle(8, 0x003300, 1);
        this.timerGraphics.strokeCircle(centerX, centerY, radius);
    
        // Fortschrittsbogen
        this.timerGraphics.lineStyle(8, 0x00ff00, 1);
        if(this.timeLeft < 50) this.timerGraphics.lineStyle(8, 0xffff00, 1);
        if(this.timeLeft < 20) this.timerGraphics.lineStyle(8, 0xff0000, 1);
        this.timerGraphics.beginPath();
        this.timerGraphics.arc(centerX, centerY, radius, startAngle, endAngle, false);
        this.timerGraphics.strokePath();
    }

    private createProgressBar() {
        this.progressBar = this.add.graphics();
        this.questionIndexText = this.add.text(512, 750, `${this.currentQuestionIndex + 1} / ${quizManager.getTotalQuestions()}`, {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.updateProgressBar(); // Initiale Anzeige
    }
    private updateProgressBar() {
        const totalQuestions = quizManager.getTotalQuestions();
        const progress = (this.currentQuestionIndex) / (totalQuestions); // Berechnung des Fortschritts

        this.progressBar.clear();
        this.progressBar.fillStyle(0x003300, 1);
        this.progressBar.fillRect(512-300, 700, 600, 20); // Hintergrund der Leiste

        this.progressBar.fillStyle(0x00ff00, 1);
        this.progressBar.fillRect(512-300, 700, 600 * progress, 20); // Fortschritt zeichnen

        this.progressBar.lineStyle(3, 0x00ff00, 1);
        const spacing = 8;
        this.progressBar.strokeRect(512 - 300 - spacing, 700 - spacing, 600 + spacing*2, 20 + spacing*2);
        
        this.questionIndexText.text = `${this.currentQuestionIndex + 1} / ${quizManager.getTotalQuestions()}`;
    }

    private addQuestions() {
        // Fragen zu Mission 1
        const phase = this.registry.get('phase') || 0;
        if(phase == 1){
            quizManager.addQuestion(
                "Wie müssen 'streng vertrauliche' Dokumente entsorgt werden?",
                [
                    "Im Papiermüll, da Papier recycelt wird",
                    "In der Datenschutztonne",
                    "Im abschließbaren Altpapier-Container",
                    "Im Büromüll, der von einer seriösen Putzfirma geleert wird"
                ],
                1, // Korrekte Antwort: B
                "Falsch! Streng vertrauliche Dokumente müssen gesichert vernichtet werden, z. B. in der Datenschutztonne.",
                "Richtig! Streng vertrauliche Dokumente gehören in die Datenschutztonne und müssen vorher zerstört werden."
            );
            quizManager.addQuestion(
                "Welche der folgenden Maßnahmen schützen vor Datenlecks in öffentlichen Bereichen?",
                [
                    "Vertrauliche Gespräche führen, wenn ausschließlich Kollegen in Hörweite sind",
                    "Sichtschutzfilter für Laptops verwenden",
                    "Dokumente und Geräte unbeaufsichtigt lassen",
                    "Keine vertraulichen Informationen in vollen Aufzügen besprechen"
                ],
                [1, 3], // Korrekte Antworten: B, D
                "Falsch! Vertrauliche Gespräche in Hörweite von anderen und unbeaufsichtigte Dokumente sind ein Risiko. Nicht alle Kollegen sind für alle Informationswerte freigegeben.",
                "Richtig! Sichtschutzfilter und das Vermeiden vertraulicher Gespräche in öffentlichen Bereichen schützen vor Datenlecks."
            );
            quizManager.addQuestion(
                "Welche der folgenden Aussagen zur Datenentsorgung sind korrekt?",
                [
                    "Formatierte digitale Speichermedien können im Restmüll entsorgt werden",
                    "Dokumente ab Stufe 'intern' müssen gesichert vernichtet werden",
                    "Papierdokumente mit Kundendaten gehören in die Datenschutztonne",
                    "Nur Dokumente der Stufen 'vertraulich' und 'streng vertraulich' müssen gesichert vernichtet werden"
                ],
                [1, 2], // Korrekte Antworten: B, C
                "Falsch! Digitale Speichermedien und vertrauliche Daten müssen gesichert entsorgt werden.",
                "Richtig! Dokumente ab Stufe 'intern' und digitale Speichermedien müssen gesichert vernichtet werden."
            );
            quizManager.addQuestion(
                "Was ist/sind Beispiel(e) für einen 'öffentlichen Bereich'?",
                [
                    "Mein Einzelbüro",
                    "Das unternehmenseigene Café",
                    "Der Besprechungsraum",
                    "Ein Sitz in der 1. Klasse der Bahn"
                ],
                [1,3], // Korrekte Antwort: B, c
                "Falsch! Café und Bahn sind öffentliche Bereich, in dem vertrauliche Gespräche vermieden werden sollten.",
                "Richtig! Café und Bahn sind öffentliche Bereiche – hier sollte man keine vertraulichen Gespräche führen."
            );
            quizManager.addQuestion(
                "Was ist ein Beispiel für ein 'internes' Dokument?",
                [
                    "Ein öffentlicher Produktflyer",
                    "Ein Kaufvertrag",
                    "Ein Organigramm",
                    "Kundendaten"
                ],
                2, // Korrekte Antwort: C
                "Falsch! Nur das Organigramm ist ein internes Dokument, der Produktflyer ist 'öffentlich' und Kaufverträge oder Kundendaten sind 'vertraulich' oder sogar 'streng vertraulich'",
                "Richtig! Ein Organigramm ist ein internes Dokument und sollte nicht öffentlich zugänglich sein."
            );
            quizManager.addQuestion(
                "Was ist ein Social Engineer?",
                [
                    "Eine Person, die soziale Medien verwaltet",
                    "Ein Hacker, der ausschließlich technische Schwachstellen ausnutzt",
                    "Eine Person, die menschliche Eigentschaften ausnutzt, um an Informationen zu gelangen",
                    "Ein IT-Spezialist, der Firewalls konfiguriert"
                ],
                2, // Korrekte Antwort: C
                "Falsch! Ein Social Engineer nutzt nicht NUR technische Schwachstellen, sondern manipuliert Menschen, um an Informationen zu gelangen.",
                "Richtig! Ein Social Engineer nutzt psychologische Tricks, um Menschen zu manipulieren und an vertrauliche Informationen zu kommen."
            );
            quizManager.addQuestion(
                "Was sollte aufgrund der Informationssicherheit nicht in sozialen Netzwerken geteilt werden?",
                [
                    "Firmen-Ausflugsfotos mit Kollegen inklusive Namenschildern",
                    "Vertrauliche Geschäftsinformationen",
                    "Ein Link zu einem öffentlichen News-Artikel",
                    "Urlaubsfotos"
                ],
                [0,1], // Korrekte Antwort: B
                "Falsch! Vertrauliche Geschäftsinformationen sollten niemals in sozialen Netzwerken geteilt werden – sie könnten missbraucht werden. Die Namen der Kollegen sind - ähnlich wie ein Organigramm - intern",
                "Richtig! Vertrauliche Geschäftsinformationen gehören nicht in soziale Netzwerke, da sie ein Sicherheitsrisiko darstellen."
            );
        }else{
            // Fragen zu Mission 2
            quizManager.addQuestion(
                "Welche Anzeichen deuten auf eine Phishing-E-Mail hin?",
                [
                    "Dringende Aufforderung zum Handeln",
                    "Unerwartete Anhänge oder Links",
                    "Absenderadresse mit Tippfehlern oder unbekannter Domain",
                    "Perfekte Grammatik und professionelle Formulierung"
                ],
                [0, 1, 2], // Korrekte Antworten: A, B, C
                "Falsch! Phishing-Mails erzeugen Druck, enthalten verdächtige Anhänge und oft gefälschte Absender. Perfekte Grammatik ist eher untypisch, aber natürlich nicht unmöglich.",
                "Richtig! Phishing-Mails erzeugen Druck, enthalten verdächtige Anhänge und oft gefälschte Absender. Aber auch nicht jede gut geschriebene E-Mail ist  zwingend sicher!"
            );
            quizManager.addQuestion(
                "Was ist eine Spear-Phishing-Attacke?",
                [
                    "Eine breit gestreute E-Mail-Kampagne",
                    "Eine gezielte E-Mail an eine bestimmte Person oder Abteilung",
                    "Eine Phishing-Mail mit persönlichem Bezug zum Empfänger",
                    "Eine Hochsee-Angelmethode"
                ],
                [1, 2], // Korrekte Antworten: B, C
                "Falsch! Spear-Phishing ist eine gezielte Attacke, oft mit persönlichem Bezug.",
                "Richtig! Spear-Phishing ist ein gezielter Angriff auf Einzelpersonen oder Abteilungen mit gut recherchierten Informationen."
            );
            quizManager.addQuestion(
                "Was sind sinnvolle Maßnahmen, um sich und andere vor Phishing zu schützen?",
                [
                    "Unbekannte Links oder Anhänge nicht öffnen",
                    "Absenderadresse und Schreibweise genau prüfen",
                    "Mails von außerhalb des Unternehmens ignorieren",
                    "Verdächtige E-Mails über den Phishing-Melde-Button melden"
                ],
                [0, 1, 3], // Korrekte Antworten: A, B, D
                "Falsch! Vorsicht bei Anhängen! Absenderprüfung und Melden verdächtiger E-Mails sind essenzielle Schutzmaßnahmen. Aber alle Emails von Außerhalb dürfen natürlich nicht ignoriert werden.",
                "Richtig! Vorsicht bei Anhängen! Absenderprüfung und Melden verdächtiger E-Mails sind essenzielle Schutzmaßnahmen."
            );
            quizManager.addQuestion(
                "Welche Faktoren stärken die Sicherheit eines Passworts?",
                [
                    "Hohe Anzahl an Zeichen (>14)",
                    "Kombination aus Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen",
                    "Leichte Einprägsamkeit durch Verwendung des eigenen Namens",
                    "Mehrfache Verwendung auf verschiedenen Websites"
                ],
                [0, 1], // Korrekte Antworten: A, B
                "Falsch! Ein sicheres Passwort sollte lang, komplex und nicht einfach zu erraten sein.",
                "Richtig! Länge, Komplexität und Passphrasen sind wichtige Elemente sicherer Passwörter."
            );
            quizManager.addQuestion(
                "Was solltest du tun, wenn du dein Passwort aufschreiben musst?",
                [
                    "Es in einem Textdokument aufschreiben",
                    "Es in einem Passwortmanager speichern",
                    "Es in meinem Tagebuch notieren",
                    "Es unter die Tastatur kleben"
                ],
                [1], // Korrekte Antwort: B
                "Falsch! Passwörter sollten niemals offen oder ungesichert aufbewahrt werden. Das Tagebuch ist auch nicht mit Passwort abgesichert.",
                "Richtig! Ein Passwortmanager bietet eine sichere Möglichkeit, Passwörter zu speichern."
            );
            quizManager.addQuestion(
                "Was ist ein Keylogger?",
                [
                    "Ein Tool, das Tastatureingaben aufzeichnet",
                    "Ein Sicherheitssystem für Bürogebäude",
                    "Ein Programm zur Verschlüsselung von Passwörtern",
                    "Eine Methode zum Schutz vor Phishing-Angriffen"
                ],
                [0], // Korrekte Antwort: A
                "Falsch! Ein Keylogger zeichnet Tastatureingaben auf und wird oft für Cyberangriffe genutzt.",
                "Richtig! Keylogger protokollieren Eingaben und können sensible Daten stehlen."
            );
            quizManager.addQuestion(
                "Welche der folgenden Verhaltensweisen erhöhen die Sicherheit am Arbeitsplatz?",
                [
                    "Bildschirmsperre aktivieren, wenn du den Arbeitsplatz verlässt",
                    "Fremde Personen ins Gebäude lassen, wenn sie einen guten Grund haben",
                    "USB-Sticks aus unbekannten Quellen verwenden",
                    "Sicherheitsbewusstsein durch regelmäßige Schulungen stärken"
                ],
                [0, 3], // Korrekte Antworten: A, D
                "Falsch! Unbekannte USB-Sticks und unkontrollierter Zugang sind große Sicherheitsrisiken.",
                "Richtig! Bildschirmsperren und Sicherheitsbewusstsein sind essenziell für den Schutz sensibler Daten."
            );
            quizManager.addQuestion(
                "Welche Sicherheitsmaßnahmen helfen gegen Business-Email-Compromise-Angriffe?",
                [
                    "Bestätigung wichtiger Anfragen über einen zweiten Kanal",
                    "Aufrufen aller Links in E-Mails, um deren Sicherheit zu prüfen",
                    "Überprüfen, ob die Absenderadresse korrekt ist",
                    "Weiterleitung verdächtiger E-Mails an die IT-Sicherheitsabteilung"
                ],
                [0, 3], // Korrekte Antworten: A, C, D
                "Falsch! Unüberlegtes Klicken auf Links kann gefährlich sein – prüfe immer die Echtheit.",
                "Richtig! Doppelte Bestätigung & Meldung an die IT helfen, Business-Email-Compromise-Angriffe zu verhindern."
            );
            quizManager.addQuestion(
                "Welche der folgenden Situationen könnten Social Engineering sein?",
                [
                    "Ein Anruf von der IT-Abteilung, der nach deinem Passwort fragt.",
                    "Eine E-Mail, die dich auffordert, auf einen Link zu klicken.",
                    "Ein neuer Kollege, der dich um Hilfe bittet.",
                    "Eine Nachricht in einem sozialen Netzwerk, die nach persönlichen Daten fragt."
                ],
                [0, 1, 2, 3], // Korrekte Antworten: A, B, D
                "Falsch! Alle diese Situationen könnten potentiell gefährlich sein.",
                "Richtig! Social Engineers können alle Formen der Kommunikation nutzen, um dich zu manipulieren."
            );
            quizManager.addQuestion(
                "Was ist ein Ziel der Clean-Desk-Policy?",
                [
                    "Den Arbeitsplatz ästhetisch ansprechend zu gestalten.",
                    "Vertrauliche Informationen vor unbefugtem Zugriff zu schützen.",
                    "Die Nutzung von Papierdokumenten zu reduzieren.",
                    "Die Anzahl der Schreibtische im Büro zu verringern."
                ],
                1, // Korrekte Antwort: B
                "Falsch! Die Clean-Desk-Policy soll vertrauliche Informationen vor unbefugtem Zugriff schützen.",
                "Richtig! Die Clean-Desk-Policy sorgt dafür, dass vertrauliche Informationen nicht offen herumliegen."
            );
            quizManager.addQuestion(
                "Was ist Tailgating?",
                [
                    "Das unbefugte Mitgehen durch eine Tür oder Vereinzelungsanlage",
                    "Ein Programm, welches Tastatureingaben abfängt und an den Angreifer weiterleitet",
                    "Das Vortäuschen einer dem Opfer bekannten Person über Email",
                    "Die Informationsbeschaffung im Vorfeld eines Social-Engineering-Angriffs"
                ],
                0, // Korrekte Antwort: A
                "Falsch! Tailgating bedeutet, dass eine unbefugte Person durch eine Tür geht, die von jemand anderem geöffnet wurde.",
                "Richtig! Tailgating ist das unbefugte Mitgehen durch eine Tür, z. B. aus Höflichkeit."
            );
        }
        
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
        this.startTimer();
    }

    private clearPreviousElements() {
        this.optionElements.forEach(option => option.destroy());
        this.optionElements = [];
        this.questionText?.destroy();
        this.submitButton?.destroy();
    }

    private displayQuestion() {
        const question = quizManager.getQuestion(this.currentQuestionIndex);
        this.questionText = this.add.text(100, 150, '> ' + question, {
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

        let yPosition = 250;
        options.forEach((option, index) => {
            const optionText = this.add.text(120, yPosition, `[${index + 1}] ${option}`, {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#00ff00',
                stroke: '#003300',
                strokeThickness: 2,
                padding: { x: 10, y: 5 },
                wordWrap: { width: 800, useAdvancedWrap: true}
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
            yPosition += 60;
        });
    }

    private createSubmitButton() {
        this.submitButton = this.add.text(100, 600, '> Bestätigen', {
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
        this.stopTimer();
        quizManager.answerMultipleChoiceQuestion(this.currentQuestionIndex, this.selectedAnswers);
        const isCorrect = quizManager.isAnswerCorrect(this.currentQuestionIndex);
        if (isCorrect) {
            const timeBonus = this.timeLeft>0? 50:0;
            this.score += 100 * this.combo + timeBonus; // Bonus für Serie
            this.combo += 0.2; // Multiplikator erhöhen
        } else {
            this.combo = 1; // Reset bei falscher Antwort
        }
        if (this.timeLeft > 100) {
            AchievementManager.unlockAchievement("quick_thinker", this.scene.get("UIScene"));
        }
        
    
        this.scoreText.setText(`${this.score}`);
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
            this.updateProgressBar(); 
        } else {
            this.showFinalScore();
        }
    }

    private showFinalScore() {
        this.clearPreviousElements();
        this.clearInteractiveElements();
        
        const score = quizManager.calculateScore();
        const total = quizManager.getTotalQuestions();

        if (score === total) {
            AchievementManager.unlockAchievement("perfect_quiz", this.scene.get("UIScene"));
        }
        
        
        this.add.text(100, 100, '> QUIZ COMPLETE', { 
            fontFamily: 'Courier New',
            fontSize: '32px', 
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2
        });
        
        this.add.text(100, 150, `> Richtig beantwortet: ${score}/${total}`, { 
            fontFamily: 'Courier New',
            fontSize: '28px', 
            color: '#00ffff',
            stroke: '#003300',
            strokeThickness: 2
        });

        this.add.text(100, 200, `> SCORE: ${this.score}`, { 
            fontFamily: 'Courier New',
            fontSize: '28px', 
            color: '#00ffff',
            stroke: '#003300',
            strokeThickness: 2
        });
        
        // Continue option
        this.continueText = this.add.text(100, 300, '> Continue', {
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
        const phase = this.registry.get('phase') || 0;
        if (phase === 1) {
            // Wenn Phase 1, speichere die Antworten
            this.registry.set('userAnswers1', quizManager.getUserAnswers());
        } else {
            // Andernfalls speichere die Antworten in der Datenbank
            this.saveUserAnswersToDB();
        }
        console.log(quizManager.getUserAnswers().toString());
        quizManager.reset();
        this.currentQuestionIndex = 0;
        
        const nextScene = sceneManager.getNextScene();
        this.scene.start(nextScene?.key, nextScene?.data);
    }

    // Funktion zum Speichern der Antworten als CSV
    async saveUserAnswersToDB() {
        console.log(this.registry.get('phase'));
        // Hol die bisherigen Antworten aus 'userAnswers1'
        const existingAnswers = this.registry.get('userAnswers1') || [];

        // Hol die neuen Antworten aus quizManager
        const newAnswers = quizManager.getUserAnswers();
        console.log('new Version uploaded');
        // Kombiniere die alten und neuen Antworten
        const allUserAnswers = [...existingAnswers, ...newAnswers];
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sid');
    
        try {
            const response = await fetch('https://ls14-studi1.cs.tu-dortmund.de/api/save_answers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId, // Session-ID mit senden
                    answers: allUserAnswers
                })
            });
    
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
}