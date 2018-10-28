
import { DefaultSelection, projectHeight, projectsWidth, axisHeight, screenWidth, screenHeight } from "../utils/consts";

import { Project } from "../../models/project";

import { AxisGroup } from "./axis.group";

export class TimelinesGroup {

    public group: DefaultSelection;

    constructor(svg: DefaultSelection, projects: Project[], axis: AxisGroup) {
        this.setupGroup(svg);
        this.setupProjects(svg, projects, axis);
    }
    
    protected setupGroup(svg: DefaultSelection): DefaultSelection {
        svg.append("defs")
            .append("clipPath")
            .attr("id", "timeline-clip")
            .append("rect")
            .attr("x", projectsWidth)
            .attr("width", screenWidth - projectsWidth)
            .attr("height", screenHeight);

        this.group = svg
            .append('g')
            .attr('transform', `translate(0, ${axisHeight})`)
            .attr("clip-path", "url(#timeline-clip)");

        return this.group;
    }

    protected setupProjects(svg: DefaultSelection, projects: Project[], axis: AxisGroup) {
        let offset = 0;

        for(let project of projects) {
            let group = this.group
                .append('g')
                .attr("transform", `translate(0, ${offset})`);

            this.addBackground(group);
            this.addProgressBar(project, axis, group);

            offset += projectHeight;
        }
    }
    
    protected addBackground(group: DefaultSelection): DefaultSelection {
        let background = group.append('rect')
            .attr('fill', 'rgba(255, 255, 255, 0.5)')
            .attr('height', projectHeight)
            .attr('width', screenWidth)
            .attr('x', projectsWidth);

        group.append('line')
            .attr('stroke', '#e9ebeb')
            .attr('x1', projectsWidth)
            .attr('y1', projectHeight)
            .attr('x2', screenWidth)
            .attr('y2', projectHeight)
            .attr('stroke-width', 1);

        return background;
    }

    protected addProgressBar(project: Project, axis: AxisGroup, group: DefaultSelection): DefaultSelection {
        let startDate = project.getStartDate();
        let endDate = project.getStopDate();

        let width = axis.scaleTime(endDate) - axis.scaleTime(startDate);
        let height = 10;
        let x = axis.scaleTime(startDate);
        let y = projectHeight - height - 5;

        let svg = group.append('svg');

        svg.append('rect')
            .attr('fill', 'white')
            .attr('height', height)
            .attr('width', width)
            .attr('x', x)
            .attr('y', y)
            .attr('rx', height/2)
            .attr('ry', height/2);

        for (let activity of project.activities) {
            svg.append('rect')
                .attr('fill', '#51ddd4')
                .attr('rx', height/2)
                .attr('ry', height/2)
                .attr('x', axis.scaleTime(activity.start))
                .attr('y', y)
                .attr('width', axis.scaleTime(activity.stop) - axis.scaleTime(activity.start))
                .attr('height', height);
        }

        svg.append('rect')
            .attr('fill', 'transparent')
            .attr('stroke', '#e9ebeb')
            .attr('stroke-width', '1')
            .attr('height', height)
            .attr('width', width)
            .attr('x', x)
            .attr('y', y)
            .attr('rx', height/2)
            .attr('ry', height/2);

        return svg;
    }
}