
import {JsonObject, JsonProperty} from "json2typescript";
import { DateConverter } from "../utils/date.converter";
import { Activity } from "./activity";
import { Comment } from "./comment";
import * as d3 from "d3";

@JsonObject("Project")
export class Project {

    @JsonProperty("name", String) public name: string = undefined;
    @JsonProperty("hour-estimate", Number) public hourEstimate: number = undefined;
    @JsonProperty("deadline", DateConverter) public deadline: Date = undefined;
    @JsonProperty("activities", [Activity]) public activities: Activity[] = undefined;
    @JsonProperty("comments", [Comment]) public comments: Comment[] = undefined;

    public getDomaine(): Date[] {
        let allCommentsDates = this.comments.map((comment) => comment.date);
        let allActivitiesStartDates = this.activities.map((activity) => activity.start);
        let allActivitiesStopDates = this.activities.map((activity) => activity.stop);
        let allDates = allCommentsDates.concat(allActivitiesStartDates).concat(allActivitiesStopDates);
        let domaine = [d3.min(allDates), d3.max(allDates)];
        return domaine;
    }

    public consommedTime(): number {
        let consommedTime = this.activities
            .map((activity) => activity.stop.getTime()-activity.start.getTime())
            .reduce((acc, cur) => acc+cur)/ 1000;

        return consommedTime;
    }
}

