import { Scene } from 'phaser';
import { quizManager } from './components/QuizManager';
import { sceneManager } from './components/SceneManager';

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
        this.add.text(100, 50, '> Quiz', {
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
    }

    private addQuestions() {
        // Fragen zu Mission 1
        const phase = this.registry.get('phase') || 0;
        if(phase == 1){
            quizManager.addQuestion(
                "Wie müssen 'streng vertrauliche' Dokumente entsorgt werden?",
                [
                    "A) Im Papiermüll, da Papier recycelt wird",
                    "B) In der Datenschutztonne nach physischer Zerstörung",
                    "C) Im Altpapier-Container, da er sicher ist",
                    "D) Im normalen Büromüll, da niemand dort sucht"
                ],
                1, // Korrekte Antwort: B
                "Falsch! Streng vertrauliche Dokumente müssen gesichert vernichtet werden, z. B. in der Datenschutztonne.",
                "Richtig! Streng vertrauliche Dokumente gehören in die Datenschutztonne und müssen vorher zerstört werden."
            );
            quizManager.addQuestion(
                "Welche der folgenden Maßnahmen schützen vor Datenlecks in öffentlichen Bereichen?",
                [
                    "A) Vertrauliche Gespräche in der Cafeteria führen",
                    "B) Sichtschutzfilter für Laptops verwenden",
                    "C) Dokumente und Geräte unbeaufsichtigt lassen",
                    "D) Keine vertraulichen Informationen in Aufzügen besprechen"
                ],
                [1, 3], // Korrekte Antworten: B, D
                "Falsch! Vertrauliche Gespräche in der Cafeteria und unbeaufsichtigte Dokumente sind ein Risiko.",
                "Richtig! Sichtschutzfilter und das Vermeiden vertraulicher Gespräche in öffentlichen Bereichen schützen vor Datenlecks."
            );
            quizManager.addQuestion(
                "Welche der folgenden Aussagen zur Datenentsorgung sind korrekt?",
                [
                    "A) formatierte digitale Speichermedien können im Restmüll entsorgt werden",
                    "B) Dokumente ab Stufe 'intern' müssen gesichert vernichtet werden",
                    "C) Papierdokumente mit Kundendaten gehören in die Datenschutztonne",
                    "D) Nur Dokumente der Stufen 'vertraulich' und 'strenge vertraulich' müssen gesichert vernichtet werden"
                ],
                [1, 2], // Korrekte Antworten: B, C
                "Falsch! Digitale Speichermedien und vertrauliche Daten müssen gesichert entsorgt werden.",
                "Richtig! Dokumente ab Stufe 'intern' und digitale Speichermedien müssen gesichert vernichtet werden."
            );
            quizManager.addQuestion(
                "Was ist/sind Beispiel(e) für einen 'öffentlichen Bereich'?",
                [
                    "A) Mein Einzelbüro",
                    "B) Das unternehmenseigene Café",
                    "C) Der Besprechungsraum",
                    "D) Ein Sitz in der 1. Klasse der Bahn"
                ],
                [1,3], // Korrekte Antwort: B, c
                "Falsch! Café und Bahn sind öffentliche Bereich, in dem vertrauliche Gespräche vermieden werden sollten.",
                "Richtig! Café und Bahn sind öffentliche Bereiche – hier sollte man keine vertraulichen Gespräche führen."
            );
            quizManager.addQuestion(
                "Was ist ein Beispiel für ein 'internes' Dokument?",
                [
                    "A) Ein öffentlicher Produktflyer",
                    "B) Ein Kaufvertrag",
                    "C) Ein Organigramm",
                    "D) Kundendaten"
                ],
                2, // Korrekte Antwort: C
                "Falsch! Ein Organigramm ist ein internes Dokument, das nur für Mitarbeiter bestimmt ist.",
                "Richtig! Ein Organigramm ist ein internes Dokument und sollte nicht öffentlich zugänglich sein."
            );
            quizManager.addQuestion(
                "Welche der folgenden Situationen sind in öffentlichen Bereichen riskant?",
                [
                    "A) Ein Gespräch über interne Projektkosten im Aufzug",
                    "B) Die Nutzung eines Sichtschutzfilters am Laptop",
                    "C) Ein unbeaufsichtigter Laptop in der Cafeteria",
                    "D) Das Lesen öffentlicher News im Wartebereich"
                ],
                [0, 2], // Korrekte Antworten: A, C
                "Falsch! Vertrauliche Gespräche in öffentlichen Bereichen und unbeaufsichtigte Geräte sind ein Risiko.",
                "Richtig! Vertrauliche Gespräche in öffentlichen Bereichen und unbeaufsichtigte Geräte können zu Datenlecks führen."
            );
            quizManager.addQuestion(
                "Was ist ein Social Engineer?",
                [
                    "A) Eine Person, die soziale Medien verwaltet",
                    "B) Ein Hacker, der außschließlich technische Schwachstellen ausnutzt",
                    "C) Eine Person, die menschliche Schwächen ausnutzt, um an Informationen zu gelangen",
                    "D) Ein IT-Spezialist, der Firewalls konfiguriert"
                ],
                2, // Korrekte Antwort: C
                "Falsch! Ein Social Engineer nutzt nicht nur technische Schwachstellen, sondern manipuliert Menschen, um an Informationen zu gelangen.",
                "Richtig! Ein Social Engineer nutzt psychologische Tricks, um Menschen zu manipulieren und an vertrauliche Informationen zu kommen."
            );
            quizManager.addQuestion(
                "Was sollte aufgrund der Informationssicherheit nicht in sozialen Netzwerken geteilt werden?",
                [
                    "A) Firmen-Ausflugsfotos mit Kollegen inlusive Namenschildern",
                    "B) Vertrauliche Geschäftsinformationen",
                    "C) Ein Link zu einem öffentlichen News-Artikel",
                    "D) Urlaubsfotos"
                ],
                [0,1], // Korrekte Antwort: B
                "Falsch! Vertrauliche Geschäftsinformationen sollten niemals in sozialen Netzwerken geteilt werden – sie könnten missbraucht werden.",
                "Richtig! Vertrauliche Geschäftsinformationen gehören nicht in soziale Netzwerke, da sie ein Sicherheitsrisiko darstellen."
            );
        }else{
            // Fragen zu Mission 2
            quizManager.addQuestion(
                "Welche Anzeichen deuten auf eine Phishing-E-Mail hin?",
                [
                    "A) Dringende Aufforderung zum Handeln",
                    "B) Unerwartete Anhänge oder Links",
                    "C) Absenderadresse mit Tippfehlern oder unbekannter Domain",
                    "D) Perfekte Grammatik und professionelle Formulierung"
                ],
                [0, 1, 2], // Korrekte Antworten: A, B, C
                "Falsch! Nicht jede gut geschriebene E-Mail ist sicher – prüfe die Absenderadresse und Anhänge!",
                "Richtig! Phishing-Mails erzeugen Druck, enthalten verdächtige Anhänge und oft gefälschte Absender."
            );
            quizManager.addQuestion(
                "Was ist eine Spear-Phishing-Attacke?",
                [
                    "A) Eine breit gestreute E-Mail-Kampagne",
                    "B) Eine gezielte E-Mail an eine bestimmte Person oder Abteilung",
                    "C) Eine Phishing-Mail mit persönlichem Bezug zum Empfänger",
                    "D) Eine E-Mail von einem echten Unternehmen ohne Schadsoftware"
                ],
                [1, 2], // Korrekte Antworten: B, C
                "Falsch! Spear-Phishing ist eine gezielte Attacke, oft mit persönlichem Bezug.",
                "Richtig! Spear-Phishing ist ein gezielter Angriff auf Einzelpersonen oder Abteilungen mit gut recherchierten Informationen."
            );
            quizManager.addQuestion(
                "Was sind sinvolle Maßnahmen, um sich und andere vor Phishing zu schützen?",
                [
                    "A) Unbekannte Links oder Anhänge nicht öffnen",
                    "B) Absenderadresse und Schreibweise genau prüfen",
                    "C) Mails von außerhalb des Unternehmens ignorieren",
                    "D) Verdächtige E-Mails über den Phishing-Melde-Button melden"
                ],
                [0, 1, 3], // Korrekte Antworten: A, B, D
                "Falsch! Automatische Antworten können dich anfälliger für weitere Angriffe machen.",
                "Richtig! Vorsicht bei Anhängen, Absenderprüfung und Melden verdächtiger E-Mails sind essenzielle Schutzmaßnahmen."
            );
            quizManager.addQuestion(
                "Welche Faktoren stärken die Sicherheit eines Passworts?",
                [
                    "A) hohe Anzahl an Zeichen (>14)",
                    "B) Kombination aus Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen",
                    "C) leiche Einprägsamkeit durch Verwendung des eigenen Namens",
                    "D) mehrfache Verwendung auf verschiedenen Websites"
                ],
                [0, 1], // Korrekte Antworten: A, B, D
                "Falsch! Ein sicheres Passwort sollte lang, komplex und nicht einfach zu erraten sein.",
                "Richtig! Länge, Komplexität und Passphrasen sind wichtige Elemente sicherer Passwörter."
            );
            quizManager.addQuestion(
                "Was solltest du tun, wenn du dein Passwort aufschreiben musst?",
                [
                    "A) Es in einem Texdokument aufschreiben",
                    "B) Es in einem Passwortmanager speichern",
                    "C) Es in meinem Tagebuch notieren",
                    "D) Es unter die Tastatur kleben"
                ],
                [1], // Korrekte Antwort: B
                "Falsch! Passwörter sollten niemals offen oder ungesichert aufbewahrt werden.",
                "Richtig! Ein Passwortmanager bietet eine sichere Möglichkeit, Passwörter zu speichern."
            );
            quizManager.addQuestion(
                "Was ist ein Keylogger?",
                [
                    "A) Ein Tool, das Tastatureingaben aufzeichnet",
                    "B) Ein Sicherheitssystem für Bürogebäude",
                    "C) Ein Programm zur Verschlüsselung von Passwörtern",
                    "D) Eine Methode zum Schutz vor Phishing-Angriffen"
                ],
                [0], // Korrekte Antwort: A
                "Falsch! Ein Keylogger zeichnet Tastatureingaben auf und wird oft für Cyberangriffe genutzt.",
                "Richtig! Keylogger protokollieren Eingaben und können sensible Daten stehlen."
            );
            quizManager.addQuestion(
                "Welche der folgenden Verhaltensweisen erhöhen die Sicherheit am Arbeitsplatz?",
                [
                    "A) Bildschirmsperre aktivieren, wenn du den Arbeitsplatz verlässt",
                    "B) Fremde Personen ins Gebäude lassen, wenn sie einen guten Grund haben",
                    "C) USB-Sticks aus unbekannten Quellen verwenden",
                    "D) Sicherheitsbewusstsein durch regelmäßige Schulungen stärken"
                ],
                [0, 3], // Korrekte Antworten: A, D
                "Falsch! Unbekannte USB-Sticks und unkontrollierter Zugang sind große Sicherheitsrisiken.",
                "Richtig! Bildschirmsperren und Sicherheitsbewusstsein sind essenziell für den Schutz sensibler Daten."
            );
            quizManager.addQuestion(
                "Welche Sicherheitsmaßnahmen helfen gegen Business-Email-Compromise-Angriffe?",
                [
                    "A) Bestätigung wichtiger Anfragen über einen zweiten Kanal",
                    "B) Klick auf alle Links in E-Mails, um deren Sicherheit zu prüfen",
                    "C) Überprüfen, ob die Absenderadresse korrekt ist",
                    "D) Weiterleitung verdächtiger E-Mails an die IT-Sicherheitsabteilung"
                ],
                [0, 3], // Korrekte Antworten: A, C, D
                "Falsch! Unüberlegtes Klicken auf Links kann gefährlich sein – prüfe immer die Echtheit.",
                "Richtig! Doppelte Bestätigung & Meldung an die IT helfen, Business-Email-Compromise-Angriffe zu verhindern."
            );
            quizManager.addQuestion(
                "Welche der folgenden Situationen könnten Social Engineering sein? (Mehrere Antworten möglich)",
                [
                    "A) Ein Anruf von der IT-Abteilung, der nach deinem Passwort fragt.",
                    "B) Eine E-Mail, die dich auffordert, auf einen Link zu klicken.",
                    "C) Ein neuer Kollege, der dich um Hilfe",
                    "D) Eine Nachricht in einem sozialen Netzwerk, die nach persönlichen Daten fragt."
                ],
                [0, 1, 2, 3], // Korrekte Antworten: A, B, D
                "Falsch! Alle diese Situationen könten potentiell gefährlich sein.",
                "Richtig! Social Engineers können alle Formen der Kommunikation nutzen, um dich zu manipulieren."
            );
            quizManager.addQuestion(
                "Was ist ein Ziel der Clean-Desk-Policy?",
                [
                    "A) Den Arbeitsplatz ästhetisch ansprechend zu gestalten.",
                    "B) Vertrauliche Informationen vor unbefugtem Zugriff zu schützen.",
                    "C) Die Nutzung von Papierdokumenten zu reduzieren.",
                    "D) Die Anzahl der Schreibtische im Büro zu verringern."
                ],
                1, // Korrekte Antwort: B
                "Falsch! Die Clean-Desk-Policy soll vertrauliche Informationen vor unbefugtem Zugriff schützen.",
                "Richtig! Die Clean-Desk-Policy sorgt dafür, dass vertrauliche Informationen nicht offen herumliegen."
            );
            quizManager.addQuestion(
                "Was ist Tailgatin?",
                [
                    "A) Das unbefugte Mitgehen durch eine Tür oder Vereinzelungsanlage",
                    "B) Ein Programm, welches Tastatureingaben abfängt und an den Angreifer weiterleitet",
                    "C) Das Vortäuschen einer dem Opfer bekannten Person über Email",
                    "D) Die Informationsbeschaffung im Vorfeld eines Social-Engineering-Angriffs"
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
            yPosition += 50;
        });
    }

    private createSubmitButton() {
        this.submitButton = this.add.text(100, 600, '> SUBMIT', {
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
        
        const nextScene = sceneManager.getNextScene();
        this.scene.start(nextScene?.key, nextScene?.data);
    }
}