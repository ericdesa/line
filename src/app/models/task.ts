import { TaskTime } from "./task-time";

export class Task {

    public planifiedTime: number; // in minutes
    public times: TaskTime[] = [];

    constructor(public name: string, public deadline: Date, nbDays: number) {
        this.planifiedTime = nbDays * 8;
    }
}
