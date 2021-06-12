import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeleft',
    pure: true
})
export class TimeLeftPipe implements PipeTransform{
    transform(value: string) {
        if(value.includes('hour')){
            let hoursLeft = 24- +value.substr(0,2).trim();
            if(hoursLeft<3){
                return  value + " !!!";
            }
        }
        return value;
    }
}