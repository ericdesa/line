import { JsonConverter, JsonCustomConvert } from "json2typescript";
import * as d3 from "d3";

@JsonConverter
export class DateConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): string {
        return d3.timeFormat("%d/%m/%Y %H:%M:%S")(date);
    }
    deserialize(date: string): Date { 
        return d3.timeParse("%d/%m/%Y %H:%M:%S")(date);
    }
}