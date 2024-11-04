class QuizManager {
    private questions: { question: string, options: string[], correctAnswers: number[] }[] = [];
    private userAnswers: boolean[][] = []; // Array von Antworten für jede Frage

    addQuestion(question: string, options: string[], correctAnswerIndex: number | number[]) {
        this.questions.push({ question, options, correctAnswers: Array.isArray(correctAnswerIndex) ? correctAnswerIndex : [correctAnswerIndex] });
        this.userAnswers.push(Array(options.length).fill(false)); // Initialisiert die Antworten für die neue Frage
    }

    getQuestion(index: number): string {
        return this.questions[index].question;
    }

    getOptions(index: number): string[] {
        return this.questions[index].options;
    }

    answerMultipleChoiceQuestion(index: number, selectedAnswers: boolean[]) {
        this.userAnswers[index] = selectedAnswers; // Speichert die Auswahl für die aktuelle Frage
    }

    isAnswerCorrect(index: number): boolean {
        const correctAnswers = this.questions[index].correctAnswers;
        const userAnswers = this.userAnswers[index];

        // Überprüft, ob die Antworten übereinstimmen
        return correctAnswers.every(answerIndex => userAnswers[answerIndex]);
    }

    calculateScore(): number {
        let score = 0;
        this.userAnswers.forEach((userAnswer, index) => {
            if (this.isAnswerCorrect(index)) {
                score++;
            }
        });
        return score;
    }

    getTotalQuestions(): number {
        return this.questions.length;
    }
}

  
  export const quizManager = new QuizManager();