import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

import { ProjectService } from './../services/project.service';
import { GUID } from '../utils/guid';
import { screenHeight, screenWidth } from './utils/consts';
import { AxisGroup } from './groups/axis.group';
import { ProjectsGroup } from './groups/projects.group';
import { TimelinesGroup } from './groups/timelines.group';


@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    protected containerId = GUID.generate();

    constructor(public projectService: ProjectService) { }

    ngOnInit() {
        let projects = this.projectService.projects;

        let svg = d3.select(`svg`)
            .attr("width", screenWidth)
            .attr("height", screenHeight);

        let axis = new AxisGroup(svg, projects);
        let projectsGroup = new ProjectsGroup(svg, projects);
        let timelineGroup = new TimelinesGroup(svg, projects);
    }
}
 