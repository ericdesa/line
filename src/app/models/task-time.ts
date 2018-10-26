
export class TaskTime {

    public startDate: Date;
    public endDate: Date;

    public formattedDuration(): string {
        var seconds = (this.endDate.getTime() - this.startDate.getTime())/1000;
        var minutes = Math.floor(seconds/60);
        var hours = Math.floor(minutes/60);
        var days = Math.floor(hours/24);

        let formattedHours = hours-(days*24)+"";
        if (+formattedHours < 10) formattedHours = `0${formattedHours}`;        

        let formattedMinutes = minutes-(days*24*60)-(hours*60)+"";
        if (+formattedMinutes < 10) formattedMinutes = `0${formattedMinutes}`;  

        return `${formattedHours}:${formattedMinutes}`
    }
}
