import { TimeEventType } from "./time-event";

export class TaskTime {

    public date: Date;
    public type: TimeEventType = TimeEventType.Work;
    public comment: string;

}
