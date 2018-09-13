import { Task } from "./task";
import { TaskTime } from "./task-time";
import { TimeEventType, TimeEvent } from "./time-event";

export class Project {

    public tasks: Task[] = [];

    constructor(public name: string) { }


    public static mock(): Project[] {
        let projects: Project[] = [];

        let lgt = new Project("LGT");

        // paris
        let lgtParis = new Task("Paris", new Date("15/06/2018"), 28);
        lgt.tasks.push(lgtParis);

        let startDate = new Date("01/02/2018");
        for (let i = 0; i <= 100; i++) {
            let start = new Date(startDate);
            start.setDate(startDate.getTime() + i * 60 * 60 * 24);

            let end = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let time = new TaskTime();
            time.dateStart = start;
            time.dateEnd = end;
            lgtParis.times.push(time);

            if (i === 0 || i === 51) {
                let event = new TimeEvent(TimeEventType.On);
                time.events.push(event);
            }

            if (i === 50 || i === 100) {
                let event = new TimeEvent(TimeEventType.Off);
                time.events.push(event);
            }
        }


        // london
        let lgtLondon = new Task("London", new Date("30/06/2018"), 4);
        lgt.tasks.push(lgtLondon);

        startDate = new Date("15/06/2018");
        for (let i = 0; i <= 10; i++) {
            let start = new Date(startDate);
            start.setDate(startDate.getTime() + i * 60 * 60 * 24);

            let end = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let time = new TaskTime();
            time.dateStart = start;
            time.dateEnd = end;
            lgtLondon.times.push(time);

            if (i === 0 || i === 5) {
                let event = new TimeEvent(TimeEventType.On);
                time.events.push(event);
            }

            if (i === 4 || i === 10) {
                let event = new TimeEvent(TimeEventType.Off);
                time.events.push(event);
            }
        }

        // montmartre
        let lgtMontmartre = new Task("Montmartre", new Date("30/07/2018"), 6);
        lgt.tasks.push(lgtMontmartre);

        startDate = new Date("15/07/2018");
        for (let i = 0; i <= 15; i++) {
            let start: Date = new Date(startDate);
            start.setDate(startDate.getTime() + i * 60 * 60 * 24);

            let end: Date = new Date(start);
            end.setDate(start.getTime() + Math.random() * 5 * 60 * 60);

            let time = new TaskTime();
            time.dateStart = start;
            time.dateEnd = end;
            lgtMontmartre.times.push(time);

            if (i === 0 || i === 7) {
                let event = new TimeEvent(TimeEventType.On);
                time.events.push(event);
            }

            if (i === 6 || i === 15) {
                let event = new TimeEvent(TimeEventType.Off);
                time.events.push(event);
            }
        }

        return projects;
    }
}
