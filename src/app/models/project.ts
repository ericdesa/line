import { Task } from "./task";
import { TaskTime } from "./task-time";

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

        let startDate = new Date(startDateString);
        for (let i = 0; i <= nbDays; i++) {
            let time = new TaskTime();
            task.times.push(time);
            
            time.startDate = new Date(startDate.getTime() + day * i);
            time.endDate = new Date(time.startDate.getTime() + (5*60*60*1000));
        }

        return task;
    }
}
