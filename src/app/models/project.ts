import { Task } from "./task";
import { TaskTime } from "./task-time";
import { TimeEventType, TimeEvent } from "./time-event";

export class Project {

    public tasks: Task[] = [];

    constructor(public name: string) { }


    public static mock(): Project[] {
        let projects: Project[] = [];

        let lgt = new Project("LGT");
        projects.push(lgt);

        // paris
        let lgtParis = new Task("Paris", new Date("06/15/2018"), 28);
        lgt.tasks.push(lgtParis);

        let startDate: Date = new Date("02/01/2018");
        console.log(startDate);
        debugger
        for (let i = 0; i <= 100; i++) {
            let start = new Date(startDate.getTime() + i * 60 * 60 * 24);

            let timeStart = new TaskTime();
            timeStart.date = start;
            lgtParis.times.push(timeStart);

            if (i === 0 || i === 51) {
                let event = new TimeEvent(TimeEventType.On);
                timeStart.events.push(event);
            }


            let end = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let timeEnd = new TaskTime();
            timeEnd.date = start;
            lgtParis.times.push(timeEnd);

            if (i === 50 || i === 100) {
                let event = new TimeEvent(TimeEventType.Off);
                timeEnd.events.push(event);
            }
        }

        // london
        let lgtLondon = new Task("London", new Date("06/30/2018"), 4);
        lgt.tasks.push(lgtLondon);

        startDate = new Date("06/15/2018");
        for (let i = 0; i <= 10; i++) {
            let start = new Date(startDate.getTime() + i * 60 * 60 * 24);

            let timeStart = new TaskTime();
            timeStart.date = start;
            lgtLondon.times.push(timeStart);

            if (i === 0 || i === 5) {
                let event = new TimeEvent(TimeEventType.On);
                timeStart.events.push(event);
            }


            let end = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let timeEnd = new TaskTime();
            timeEnd.date = start;
            lgtLondon.times.push(timeEnd);

            if (i === 4 || i === 10) {
                let event = new TimeEvent(TimeEventType.Off);
                timeEnd.events.push(event);
            }
        }

        // montmartre
        let lgtMontmartre = new Task("Montmartre", new Date("07/30/2018"), 6);
        lgt.tasks.push(lgtMontmartre);

        startDate = new Date("07/15/2018");
        for (let i = 0; i <= 15; i++) {
            let start = new Date(startDate.getTime() + i * 60 * 60 * 24);

            let timeStart = new TaskTime();
            timeStart.date = start;
            lgtMontmartre.times.push(timeStart);

            if (i === 0 || i === 6) {
                let event = new TimeEvent(TimeEventType.On);
                timeStart.events.push(event);
            }


            let end = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let timeEnd = new TaskTime();
            timeEnd.date = start;
            lgtMontmartre.times.push(timeEnd);

            if (i === 5 || i === 15) {
                let event = new TimeEvent(TimeEventType.Off);
                timeEnd.events.push(event);
            }
        }

        return projects;
    }
}
