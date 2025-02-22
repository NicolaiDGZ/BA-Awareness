class QuizManager {
    private defaultCorrectHint = "Richtig! Gut gemacht!";
    private questions: {
        question: string,
        options: string[],
        correctAnswers: number[],
        infoTextWrong: string,
        infoTextCorrect: string
    }[] = [];
    
    private userAnswers: boolean[][] = [];

    addQuestion(
        question: string,
        options: string[],
        correctAnswerIndex: number | number[],
        infoTextWrong: string,
        infoTextCorrect: string = this.defaultCorrectHint
    ) {
        this.questions.push({
            question,
            options,
            correctAnswers: Array.isArray(correctAnswerIndex) ? correctAnswerIndex : [correctAnswerIndex],
            infoTextWrong,
            infoTextCorrect
        });
        this.userAnswers.push(Array(options.length).fill(false));
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

    reset() {
        this.questions = [];
        this.userAnswers = [];
    }

    getInfoText(index: number, isCorrect: boolean): string {
        const question = this.questions[index];
        return isCorrect ? question.infoTextCorrect : question.infoTextWrong;
    }

    setDefaultCorrectHint(hint: string) {
        this.defaultCorrectHint = hint;
    }

}

  
  export const quizManager = new QuizManager();