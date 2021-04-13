export interface Publication{
    userId?:string,
    dateOfPublish?:Date,
    reviewed?:boolean,
    defended?:boolean,
    popularity?:number,
    level:number,
    title:string,
    text:string
}