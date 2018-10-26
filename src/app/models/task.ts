import { TaskTime } from "./task-time";
import * as d3 from "d3";

export class Task {

    public planifiedTime: number; // in minutes
    public times: TaskTime[] = [];

    constructor(public name: string, public deadline: Date, nbDays: number) {
        this.planifiedTime = nbDays * 8;
    }

    public firstTaskAt(): Date {
        return d3.min(this.times.map((time) => time.startDate));
    }

    public lastTaskAt(): Date {
        return d3.max(this.times.map((time) => time.endDate));
    }
}
