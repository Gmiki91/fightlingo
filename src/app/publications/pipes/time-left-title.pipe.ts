import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timelefttitle',
    pure: true
})
export class TimeLeftTitlePipe implements PipeTransform{
    transform(value: string) {
        if(value){
            const timeDifference = (new Date().getTime() - +new Date(value).getTime()) / 1000 / 3600;
            const timeLeft = Math.ceil(24-timeDifference);
            return `Less than ${timeLeft} hour(s) left!`;
        }
    }
}