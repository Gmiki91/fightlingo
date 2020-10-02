import { RussianLesson } from './language-lessons/russian-lesson.enum';

export interface Sentence{
    id:string;
    english: string;
    translations: string[];
    level: number;
    russianLesson: RussianLesson;
    learned: boolean;
    learningProgress:number;

    consecutiveCorrectAnswers:number;
    interval:number;
    difficulty:number;
    nextReviewDate:Date;
}