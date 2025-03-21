import { GameObjects, Scene } from 'phaser';
import { sceneManager } from './components/SceneManager';

export class MainMenu extends Scene {
    private background: GameObjects.Image;
    private title: GameObjects.Text;
    private buttons: GameObjects.Text[];

    constructor() {
        super('MainMenu');
    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createButtons();
    }

    private createBackground() {
        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'backgroundImage');
        this.background.postFX.addVignette(0.5,0.5,0.8,0.45);
        this.background.setDisplaySize(this.scale.width, this.scale.height);
    }

    private createTitle() {
        this.title = this.add.text(this.scale.width / 2, 100, 'Main Menu', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        this.title.postFX.addShadow();
        this.tweens.add({
            targets: this.title,
            scale: { from: 0.9, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    private createButtons() {
        const buttonData = [
            { text: 'Spielen', scene: 'InfoScreen' },
            //{ text: 'Steuerung', scene: 'VisitorPass' },
            { text: 'Credits', scene: 'Credits' },
            //{ text: 'DevTest', scene: 'Indoor' },
            //{ text: 'DevTestQuiz', scene: 'QuizScene' },
            //{ text: 'DevTestPhishing', scene: 'SpearPhishingScene' }
        ];

        this.buttons = buttonData.map((data, index) => {
            const button = this.add.text(this.scale.width / 2, 250 + index * 100, data.text, {
                fontFamily: 'Arial Black',
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            this.addButtonEffects(button);

            button.on('pointerdown', () => {
                console.log(`${data.text} button clicked`);
                // Only start the Game scene for now
                if (data.scene === 'Credits') {
                    this.scene.start('InfoScreen', {
                        title: 'Credits',
                        message: 'Spielkonzept, Programmierung & co:\n\nNicolai Diehl\nnicolai.diehl@tuta.io\n\n\n\nAssets:\n\nLimeZu\nhttps://limezu.itch.io/',
                        scene: 'MainMenu'});
                }else if(data.scene === 'InfoScreen'){
                    // this.scene.start(data.scene, {
                    //     title: 'Informationen sammeln',
                    //     //message: 'Agent, deine Aufgabe: Sammle unauffällig Informationen bei G-Neric Corp. Als Social Engineer setzt du auf Täuschung statt Technik. Finde nützliche Details – ein Name, ein Passwort, ein Badge – alles kann wertvoll sein. Bleib wachsam, agiere clever, und vor allem: Bleib unsichtbar. Viel Erfolg!',
                    //     message: 'Als geschickter Social Engineer hast du ein klares Ziel: das Unternehmen G-Neric Corp zu infiltrieren. \nDoch der Zugang zum Firmengebäude ist nicht jedem gewährt – doch du bist bereit, jedes Schlupfloch zu finden. \nMit deinem Bus fährst du zum Gebäude, entschlossen, entscheidende Informationen aufzuspüren, die dir den Weg ins Innere ebnen. \n Viel Erfolg!',
                    //     scene: 'Game'});
                    this.fillSceneManager();
                    const nextScene = sceneManager.getNextScene();
                    this.scene.start(nextScene?.key, nextScene?.data);
                }else{
                    this.scene.start(data.scene);
                }
            });

            return button;
        });
    }
    fillSceneManager() {
        sceneManager.pushScene('InfoScreen', { 
            title: `Mission 1: Informationsbeschaffung`, 
            message: `In diesem Spiel schlüpst du in die Rolle von Hackie Chan - einem Kriminellen, der sein Unterhalt durch Erpressung von Unternehmen verdient.
            Als geschickter Social Engineer hast du ein neues Ziel: das Unternehmen G-Neric Corp zu infiltrieren.
            Doch der Zugang zum Firmengebäude ist nicht jedem gewährt – doch du bist bereit, jedes Schlupfloch zu finden.

            Mit deinem Bus fährst du zum Gebäude, entschlossen, entscheidende Informationen aufzuspüren, die dir den Weg ins Innere ebnen.

            Viel Erfolg!` 
        });
        
        sceneManager.pushScene('Game'); 

        /**
         * Outdoor-Game Scene
         * 
         * The charakter looks for information outside of the office building.
         * He finds an old visitor pass and a CV of an upcoming employee in the garbage.
         * Outside of the building, two current employees are talking about the new employee, his start day (in the near future) and how they do not know how he looks like.
         * 
         * When trying to enter, the security personal stops you out of lack of an visitor or employee pass
         */
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Missionserfolg`, 
            message: `Sehr gut! Du hast es geschafft, an nützliche Informationen zu gelangen, ohne aufzufallen.

            Durch das Gespräch hast du erfahren, dass am Montag ein neuer Mitarbeiter bei G-Neric Corp. anfängt.
            Und in den Mülleimern hast du einen alten Besucherausweis und sogar die Bewerbungsunterlagen des neuen Mitarbeiters gefunden.
            
            Doch die Sicherheitskraft am Eingang lässt dich nicht ohne weiteres in das Gebäude hinein.` 
        });
        
        sceneManager.pushScene('FreeTextScene', { 
            text: `Beschreibe stichpunktartig, wie du vorgehen würdest, um Zugang zum Bürogebäude zu bekommen.`
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Soziale Netzwerke`, 
            message: `Dein Plan ist es, sich als der neue Mitarbeiter in das Firmengebäude einzuschleusen. Doch dafür brauchst du eine Mitarbeiterkarte.
            Doch wie sieht diese bei G-Neric Corp aus?
            Deine Informationssuche bringt dich nicht nur zum Unternehmensgebäude, auch im Internet wird oft unvorsichtig mit sensibelen Daten umgegangen.
            Nach einer kurzen Recherche findest du folgendes Bild in einem bekannten sozialen Netzwerk.` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Soziale Netzwerke`, 
            message: `{image: socialMediaPost}` 
        });
        //Social Media Post with a photo of an employee card
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Soziale Netzwerke`, 
            message: `Mit dieser weiteren Information hast du nun das nötige Wissen, um die Mitarbeiterkarte zu fälschen.
            Viel Erfolg!` 
        });
        
        sceneManager.pushScene('VisitorPass');
        /**
         * The player uses data gathered before to construct an employee card
         */
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Rückblick`, 
            message: `Hervorragend! Deine Mitarbeiterkarte sieht täuschend echt aus!
            Sicherheitssalber schreibst du an die Mail von Jonas Federer die Nachricht, dass sich sein erster Arbeitstag einige Tage nach hinten verschiebt.
            Nicht, dass er noch deine Pläne durchkreuzt.

            Wichtig:
            Nur durch das unsichere Verhalten von Mitarbeitenden konntest du soweit kommen.
            In dieser Lektion wurden folgende Themen der Informationssicherheit angesprochen:` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Datenklassifizierung & Entsorgung`, 
            message: `- Informationswerte müssen nach Unternehmensrichtlinien klassifiziert werden:
            \t- Öffentlich: Für alle zugänglich (z.B. Produktflyer)
            \t- Intern: Nur für Mitarbeitende (z.B. Organigramm)
            \t- Vertraulich: Begrenzter Zugriff (z.B. Kaufvertrag)
            \t- Streng vertraulich: Höchster Schutz (z.B. Kundendaten)
    
            - Abhängig der Klassifizierung müssen die Informationsträger entsorgt werden:
            \t- Digitale Speichermedien in der Datenschutztonne entsorgen
            \t- Dokumente ab Stufe intern nicht im Papiermüll entsorgen
            
            - Daten dürfen nur an autorisierte Dritte (Personen & Dienste) weitergegeben werden
            - Vertrauliche Daten verschlüsselt speichern und übermitteln
            - Bei Unsicherheit: Immer nachfragen!` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Öffentliche Bereiche`, 
            message: `
            - Was sind öffentliche Bereiche?
            \t- Im & ums Büro: Flure, Aufzüge, Cafetarias, Parkplätze etc.
            \t- Außerhalb: Cafés, Flughäfen, öffentliche Verkehrsmittel
            
            - Keine vertraulichen Gespräche in öffentlichen Bereichen - du weißt nie, ob Hackie Chan nicht in ner Nähe ist ;)
            - Nutzung des Sichtschutzfilters für Laptops
            - Dokumente und Geräte nicht unbeaufsichtigt lassen` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Verhalten in sozialen Netzwerken`, 
            message: `- Keine vertraulichen oder kritischen Informationen öffentlich teilen
            - Privatsphäre-Einstellungen regelmäßig überprüfen und restriktiv halten
            - Vorsicht vor Social-Engineering-Angriffen wie Phishing oder Fake-Profilen
            - Bewusstsein für berufliche und persönliche Online-Identität` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Quiz`, 
            message: `Teste im folgenden Quiz dein Wissen, bevor es zur nächsten Mission weitergeht.
            Es kann sowohl eine, als auch mehrere Antworten richtig sein.` 
        });
        
        sceneManager.pushScene('QuizScene');
        //Quiz containing question about the just learned Information
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Mission 2: Dirty Desk`, 
            message: `Begebe dich mit deinem Besucherausweis in das Bürogebäude. Suche auch hier nach nützlichen Informationen.
            Hinweis: Durchsuchbare Orte leuchten leicht gelblich.` 
        });
        
        sceneManager.pushScene('Game'); // phase 1
        //just to get to the indoor. Cause of employee card he get's past the security
        sceneManager.pushScene('Indoor');
        /**
         * The player gathers more information bits inside of the building.
         * Using tailgating he get's past the general hallway
         */
        sceneManager.pushScene('Game'); // phase 2
        //just to get back to the bus
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Ransomware`, 
            message: `Gut gemacht! Du hast an verschiedenen Orten im Bürogebäude für dich wertvolle informationen gefunden.
            
            Durch das Organigramm weißt du mehr über die Struktur des Unternehmens, im Büro von Herrn Diktat konntest du etas über ihn und seine Hobbys herausfinden und einige Hinweise deuten darauf hin, dass kurzfristig ein Serverupdate bevorsteht.
            
            Dein Ziel ist es, auf den Servern von G-Neric Corp Schadsoftware zu installieren, welche die Daten des Unternehmens verschlüsselt und somit den Mitarbeitern den Zugang zu diesen verwehrt. 
            Wenn du das schaffst, kannst du im Anschluss eine hohe Lösegeldsumme fordern, umd die Daten wieder freizugeben.
            Eine solche Methode nennt man eine Ransomware-Attacke (englisch für Lösegeld)` 
        });
        
        sceneManager.pushScene('FreeTextScene', { 
            text: `Wie könnte ein mögliches Vorgehen sein, dein bisheriges Wissen zu nutzen, um deine Ziele umzusetzen?` 
        });
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Taktik`, 
            message: `Du entscheidest dich für folgende Taktik:

            \t1. Formuliere eine Spear-Phishing Mail an Herrn Dikat, verschleiert als Einladung zum Fotowettbewerb.
            \t2. Erhalte Zugriff zu seinem Computer und Email-Postfach.
            \t3. Erfrage unter dem Deckmantel Herrn Diktats anlässlich des Serverupdates das Passwort bei der Administration.
            ` 
        });
        
        sceneManager.pushScene('SpearPhishingScene');
        /**
         * In this scene the player can drag and drop small text chunks into a realistic spear-phishing mail.
         */
        
        sceneManager.pushScene('InfoScreen', { 
            title: `Spear Phishing`, 
            message: `Durch deinen künstlich erzeugten Zeitdruck der Anmeldefrist hat Herr Diktat schnell auf deine E-Mail geantwortet.
            Mit dem Anhang der Mail - dem Anmeldeformular - konntest du einen Keylogger auf dem Rechner des Vorgesetzten installieren.
            Ein Keylogger ist ein Programm, welches alle Tastatureingaben des Nutzers mitliest, aufzeichnet und an den Angreifer übermittelt.

            Während du wartest formulierst du deinen weiteren Plan aus:
            Als nächstes führst du eine "Buisness-Email-Compromise"-Atacke durch: Dafür schickst du eine Mail im Namen von Herrn Diktat an den Server Administrator und nutze das geplanten Update als Vorwand, um an das Server-Passwort zu kommen.

            Doch bisher hat sich Herr Diktat noch nicht in sein Mail-Postfach angemeldet, aber die Zeit drängt: Die Server-Techniker kommen schon morgen!!
            Gerade als du denkst, du musst deinen Plan aufgeben, meldet der Keylogger folgendes in der Konsole:
            
            ` 
        });
        sceneManager.pushScene('MailLoginScene');
        //User has to bruteforce/guess right password
        sceneManager.pushScene('SpearPhishingScene'); // phase 3
        //same as before, just to a new person
        
        sceneManager.pushScene('InfoScreen', { 
            title: "Erfolg", 
            message: `Du hast es geschafft! 
            Der Serveradministrator Hans Dull ist auf deine BEC-Attacke reingefallen und hat dir das Passwort geliefert!
            Mit dem Passwort zum Server konntest du die Ransomeware platzieren. Jetzt nur noch abwarten, dass G-neric Corp. deinen Forderungen folgt.
            
            
            Doch wie konnte es soweit kommen? Hier sind die Themenbereiche, die in der zweiten Mission angesprochen wurden:`
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Physische Sicherheit", 
            message: `Physische Sicherheit und eine saubere Arbeitsumgebung sind entscheidend für den Schutz von Unternehmensdaten.
        
                      - Zugangskontrollen:
                      \t- Sicherheitspersonal, Schlüsselkarten oder Vereinzelungsanlagen verhindern unbefugten Zutritt.
                      \t- Halte niemals aus Höflichkeit Türen für fremde Personen offen ("Tailgating": unbefugtes Mitgehen durch Türen).
                      \t- Besucher sollten stets registriert und begleitet werden, um potenzielle Angriffe zu erschweren.
        
                      - Clean-Desk-Policy:
                      \t- Entferne alle Dokumente, Notizen oder USB-Sticks von deinem Schreibtisch, wenn du ihn verlässt.
                      \t- Sperre deinen Bildschirm, wenn du deinen Arbeitsplatz verlässt (Windows-Taste + L).
                      \t- Lasse keine vertraulichen Dokumente oder Geräte unbeaufsichtigt.
                      \t- Nutze abschließbare Schubladen oder Schränke für interne oder sesiblere Unterlagen.
                      `
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Phishing",     
            message: `- Verdächtige E-Mails erkennen:
              \t- Unerwartete Anhänge oder Links vermeiden.
              \t- Absenderadressen genau prüfen (z. B. Tippfehler oder falsche Domains).
              \t- Druckvolle Sprache ("Dringend!", "Sofort handeln!") ist oft ein Warnzeichen.
              \t- Grammatik- und Rechtschreibfehler können auf Phishing hindeuten.
              \t- Unpersönliche Ansprache wie "Sehr geehrter Nutzer" statt Ihres Namens.
              \t- Aufforderungen zu ungewöhnlichen Handlungen (z. B. "Klicken Sie hier, um Ihr Konto zu reaktivieren").

              - Was tun bei verdächtigen E-Mails:
              \t- Anhänge oder Links nicht öffnen.
              \t- E-Mail über "Phishing-Melden-Button" melden.

              Denken Sie daran: Phishing-Angriffe zielen darauf ab, Sie zu täuschen. Seien Sie wachsam und melden Sie verdächtige Aktivitäten!` 
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Spear Phishing", 
            message: ` Was ist Spear Phishing?
              \t- Gezielte Angriffe auf Einzelpersonen oder Abteilungen.
              \t- Angreifer sammeln vorab Informationen (z. B. aus sozialen Netzwerken).
              \t- E-Mails wirken oft persönlich und vertrauenswürdig.

              - Wie erkenne ich Spear Phishing?
              \t- E-Mails, die persönliche Informationen enthalten (z. B. Namen, Projekte).
              \t- Aufforderungen zu dringenden Handlungen (z. B. "Überweisen Sie sofort Geld").
              
              - Was tun bei verdächtigen E-Mails?
              \t- Anhänge oder Links nicht öffnen.
              \t- Absender über einen separaten Kanal verifizieren (z. B. Telefon oder internen Chat).
              \t- Und wieder: Melden!!`  
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Passwortsicherheit", 
            message: `- Erstellung sicherer Passwörter:
                      \t- Verwende mindestens 14 Zeichen.
                      \t- Kombiniere Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.
                      \t- Vermeide leicht zu erratende Informationen (z. B. Namen, Geburtsdaten).

                      - Umgang mit Passwörtern:
                      \t- Verwende für jedes Konto ein eindeutiges Passwort.
                      \t- Teile Passwörter niemals mit anderen – auch nicht mit Kollegen.
                      \t- Schreibe Passwörter nicht auf oder speichere sie unverschlüsselt.
                      \t- Falls nötig, verwende einen Passwortmanager.
        
                      - Multi-Faktor-Authentifizierung (MFA):
                      \t- Aktiviere MFA, wo immer möglich.
                      \t- Dies fügt eine zusätzliche Sicherheitsebene hinzu (z. B. per SMS oder Besitz einer Karte).`
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Tipp: Passphrasen statt Passwörter", 
            message: `- Was sind Passphrasen?
                      \t- Passphrasen sind lange Sätze oder Wortkombinationen.
                      \t- Beispiel: "MeinHundLiebt3Leckerlis!" statt "Hund123".
        
                      - Warum sind Passphrasen besser/sicherer als Passwörter?
                      \t- Länger als herkömmliche Passwörter → schwerer zu knacken.
                      \t- Einfach zu merken, da sie wie ein Satz oder eine Geschichte sind.
                      \t- Schwer zu erraten, wenn sie kreativ gewählt sind (keine gängigen Phrasen oder Zitate).
        
                      - Wie erstelle ich eine sichere Passphrase?
                      \t- Mindestens 3-5 zufällige Wörter kombinieren.
                      \t- Sonderzeichen, Zahlen oder Großbuchstaben einbauen.
                      \t- Keine offensichtlichen oder bekannten Sprüche wählen.
                      \t- Beispiel: "BlauerDrache7Tanzt@Mondschein"`
        });
        sceneManager.pushScene('InfoScreen', { 
            title: "Abschluss", 
            message: `Teste zum Abschluss nocheinmal, was du aus der zweiten Mission des Spiels gelernt hast.`
        });
        sceneManager.pushScene('QuizScene');
        sceneManager.pushScene('InfoScreen', { 
            title: "Danke", 
            message: `Vielen Dank, dass du dir die Zeit genommen hast, bis zum Ende zu spielen.

            Ich hoffe es hat dir Spaß gemacht und du konntest etwas mitnehmen.`
        });
        sceneManager.pushScene('MainMenu');
        //quiz again
    }
    

    private addButtonEffects(button: GameObjects.Text) {
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: 1.1,
                duration: 100
            });
            button.setStyle({ fill: '#ffff00' });
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: 1,
                duration: 100
            });
            button.setStyle({ fill: '#ffffff' });
        });
    }
}