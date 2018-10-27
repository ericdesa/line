import { JsonObject, JsonProperty } from "json2typescript";
import { DateConverter } from "../utils/date.converter";

@JsonObject("Activity")
export class Activity {
 
    @JsonProperty("start", DateConverter) public start: Date = undefined;
    @JsonProperty("stop", DateConverter) public stop: Date = undefined;

}