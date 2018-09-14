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

        // paris
        let lgtParis = this.getMockTask("Paris", "06/01/2018", "06/15/2018", 10);
        lgt.tasks.push(lgtParis);

        // london
        let lgtLondon = this.getMockTask("London", "06/20/2018", "06/30/2018", 10);
        lgt.tasks.push(lgtLondon);

        // montmartre
        let lgtMontmartre = this.getMockTask("Montmartre", "07/03/2018", "08/12/2018", 6);
        lgt.tasks.push(lgtMontmartre);

        return projects;
    }

    private static getMockTask(name: string, startDateString: string, deadlineDateString: string, nbDays: number): Task {
        let task = new Task(name, new Date(deadlineDateString), nbDays);

        let day = 60 * 60 * 24 * 1000;
        let previousState = TimeEventType.Off;

        let startDate = new Date(startDateString);
        for (let i = 0; i <= nbDays; i++) {
            let timeStart = new TaskTime();
            timeStart.date = new Date(startDate.getTime() + day * i);
            task.times.push(timeStart);

            if (i === 0 || i === nbDays / 2) {
                timeStart.type = TimeEventType.On;
            }
            else if (i === nbDays / 2 + 1 || i === nbDays) {
                timeStart.type = TimeEventType.Off;
            }

            if (previousState !== timeStart.type) {
                let previous = new TaskTime();
                let delta = -day / 2;
                previous.date = new Date(timeStart.date.getTime() + delta);
                previous.type = previousState;
                task.times.push(previous);
            }

            previousState = timeStart.type;
        }

        return task;
    }
}
