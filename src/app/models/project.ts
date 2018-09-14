import { Task } from "./task";
import { TaskTime } from "./task-time";
import { TimeEventType } from "./time-event";

export class Project {

    public tasks: Task[] = [];

    constructor(public name: string) { }


    public static mock(): Project[] {
        let projects: Project[] = [];

        let lgt = new Project("LGT");
        projects.push(lgt);


        let day = 60 * 60 * 24 * 1000;

        // paris
        let lgtParis = new Task("Paris", new Date("06/15/2018"), 28);
        lgt.tasks.push(lgtParis);

        let startDate: Date = new Date("02/01/2018");

        for (let i = 0; i <= 100; i++) {

            let timeStart = new TaskTime();
            timeStart.date = new Date(startDate.getTime() + day * i);
            lgtParis.times.push(timeStart);

            if (i === 0 || i === 51) {
                timeStart.type = TimeEventType.On;
            }

            let timeEnd = new TaskTime();
            timeEnd.date = new Date(timeStart.date.getTime() + Math.random() * 5 * 60 * 60);
            lgtParis.times.push(timeEnd);

            if (i === 50 || i === 100) {
                timeEnd.type = TimeEventType.Off;
            }
        }

        // london
        let lgtLondon = new Task("London", new Date("06/30/2018"), 4);
        lgt.tasks.push(lgtLondon);

        startDate = new Date("06/15/2018");
        for (let i = 0; i <= 10; i++) {
            let timeStart = new TaskTime();
            timeStart.date = new Date(startDate.getTime() + day * i);
            lgtLondon.times.push(timeStart);

            if (i === 0 || i === 5) {
                timeStart.type = TimeEventType.On;
            }


            let timeEnd = new TaskTime();
            timeEnd.date = new Date(timeStart.date.getTime() + Math.random() * 5 * 60 * 60);
            lgtLondon.times.push(timeEnd);

            if (i === 4 || i === 10) {
                timeEnd.type = TimeEventType.Off;
            }
        }

        // montmartre
        let lgtMontmartre = new Task("Montmartre", new Date("07/30/2018"), 6);
        lgt.tasks.push(lgtMontmartre);

        startDate = new Date("07/15/2018");
        for (let i = 0; i <= 15; i++) {
            let timeStart = new TaskTime();
            timeStart.date = new Date(startDate.getTime() + day * i);
            lgtMontmartre.times.push(timeStart);

            if (i === 0 || i === 6) {
                timeStart.type = TimeEventType.On;
            }


            let timeEnd = new TaskTime();
            timeEnd.date = new Date(timeStart.date.getTime() + Math.random() * 5 * 60 * 60);
            lgtMontmartre.times.push(timeEnd);

            if (i === 5 || i === 15) {
                timeEnd.type = TimeEventType.Off;
            }
        }

        return projects;
    }
}
