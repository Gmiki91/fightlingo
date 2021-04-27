export interface Question{
    _id?:string;
    publicationId:string;
    popularity:number;
    question:string;
    votedBy:string[];
    answers:string[];
}
