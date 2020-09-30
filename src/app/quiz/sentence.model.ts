import { Lesson } from './lesson.enum';

export interface Sentence{
    id:string;
    english: string;
    translations: string[];
    level: number;
    lesson: Lesson;
    learned: boolean;
    learningProgress:number;

    consecutiveCorrectAnswers:number;
    interval:number;
    difficulty:number;
    nextReviewDate:Date;
}