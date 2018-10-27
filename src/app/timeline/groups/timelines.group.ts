
import { DefaultSelection } from "../utils/consts";

import { Project } from "../../models/project";

import * as d3 from "d3";

export class TimelinesGroup {

    public group: DefaultSelection;

    constructor(svg: DefaultSelection, projects: Project[]) {
        this.setupGroup(svg);
    }
    
    private setupGroup(svg: DefaultSelection): DefaultSelection {
        this.group = svg.append('g').attr('transform', `translate(0, 30)`);
        return this.group;
    }
}