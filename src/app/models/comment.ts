import { JsonObject, JsonProperty } from "json2typescript";
import { DateConverter } from "./date.converter";

@JsonObject("Comment")
export class Comment {

    @JsonProperty("date", DateConverter) public date: Date = undefined;
    @JsonProperty("text", String) public text: string = undefined;

}