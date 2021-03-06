export interface Progress{
    _id:string;
    sentenceId: string;
    userId: string;
    learned: boolean;
    learningProgress: number;
    consecutiveCorrectAnswers: number;
    interval: number;
    difficulty: number;
    nextReviewDate: Date;
}