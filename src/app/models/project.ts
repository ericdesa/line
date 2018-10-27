
import {JsonObject, JsonProperty} from "json2typescript";
import { DateConverter } from "./date.converter";
import { Activity } from "./activity";
import { Comment } from "./comment";

@JsonObject("Project")
export class Project {

    @JsonProperty("name", String) public name: string = undefined;
    @JsonProperty("hour-estimate", Number) public hourEstimate: number = undefined;
    @JsonProperty("deadline", DateConverter) public deadline: Date = undefined;
    @JsonProperty("activities", [Activity]) public activities: Activity[] = undefined;
    @JsonProperty("comments", [Comment]) public comments: Comment[] = undefined;

    constructor() { }

}

