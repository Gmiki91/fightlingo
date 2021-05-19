import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'money',
    pure: true
})
export class MoneyPipe implements PipeTransform{
    transform(dateOfPublish: string) {
        if(dateOfPublish){
            const time = (new Date().getTime()-new Date(dateOfPublish).getTime())/1000/86400 ;
            if(time>15){
                return "$$$";
            }else if(time >7){
                return "$$"
            }else if (time >3){
                return "$";
        
            }
        }
        
    }
}