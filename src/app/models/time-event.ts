
export enum TimeEventType {
    On,
    Off,
    Comment,
    Finished,
    Work,
}

export class TimeEvent {

    public dateStart: Date;
    public dateEnd: Date;

    constructor(public type: TimeEventType = TimeEventType.Work, public text?: string) {

    }

}
