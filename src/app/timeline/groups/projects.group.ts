
import { DefaultSelection, axisHeight, projectHeight, projectsWidth, projectTitleWidth } from "../utils/consts";

import { Project } from "../../models/project";

import * as d3 from "d3";

export class ProjectsGroup {

    public group: DefaultSelection;

    // Setup
    // -----------------------------------------------------
    
    constructor(svg: DefaultSelection, projects: Project[]) {
        this.setupGroup(svg);
        this.setupProjets(projects);
    }
    
    protected setupGroup(svg: DefaultSelection): DefaultSelection {
        this.group = svg
            .append('g')
            .attr('transform', `translate(0, ${axisHeight})`);

        return this.group;
    }

    protected setupProjets(projects: Project[]) {
        let offset = 0;

        for(let project of projects) {
            let group = this.group.append('g')
                .attr("transform", `translate(0, ${offset})`);
                
            group.append('rect')
                .attr('fill', '#f6f8f8')
                .attr('stroke', '#e9ebeb')
                .attr('stroke-width', '1')
                .attr('height', projectHeight)
                .attr('width', projectsWidth);

            group.append('rect')
                .attr('fill', '#51ddd4')
                .attr('stroke', '#e9ebeb')
                .attr('stroke-width', '1')
                .attr('height', projectHeight)
                .attr('width', 15);
            
            this.addText(project.name, 'white', 3, 3, group, projectHeight, true);
            this.addText(`🚩 ${d3.timeFormat("%d/%m/%Y")(project.deadline)}`, '#4d5059', 22, 15, group);

            let remainingTime = this.remainingTimeToDate(project.deadline);
            let emoji = remainingTime > 0 ? '⏳' : '⌛';
            this.addText(`${emoji} ${this.formatRemainingTime(remainingTime)}`, '#4d5059', 20, 37, group);

            this.addProgressBar(project.hourEstimate*60*60, project.consommedTime(), '#51ddd4', group);

            offset += projectHeight;
        }
    }

    protected addText(text: string, color: string, x: number, y: number, group: DefaultSelection, width?: number, rotation?: boolean): DefaultSelection {
        let label = group.append("text")
            .attr("text-anchor", "start")
            .attr("transform", `translate(${x}, ${y}) ${rotation ? 'rotate(90)' : ''}`)
            .attr("width", width || 'auto')
            .text(text)
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", color);

        return label;
    }

    protected addProgressBar(estimatedTime: number, consommedTime: number, color: string, group: DefaultSelection): DefaultSelection {
        let padding = 5;
        let width = projectsWidth - 2*padding - projectTitleWidth;
        let height = 10;

        let progressRange = d3.scaleLinear()
            .range([0, width])
            .domain([0, Math.max(estimatedTime, consommedTime)]);

        let svg = group.append('svg')
            .attr('height', height)
            .attr('width', width)
            .attr('x', projectTitleWidth + padding)
            .attr('y', projectHeight - height - padding);

        svg.append('rect')
            .attr('rx', height/2)
            .attr('ry', height/2)
            .attr('fill', 'white')
            .attr('height', height)
            .attr('width', width)
            .attr('x', 0);

        svg.append('rect')
            .attr('fill', color)
            .attr('height', height)
            .attr('width', progressRange(consommedTime))
            .attr('rx', height/2)
            .attr('ry', height/2)
            .attr('x', 0);

        svg.append('rect')
            .attr('rx', height/2)
            .attr('ry', height/2)
            .attr('fill', 'transparent')
            .attr('stroke', '#e9ebeb')
            .attr('stroke-width', '1')
            .attr('height', height)
            .attr('width', width)
            .attr('x', 0);

        return svg;
    }

    public remainingTimeToDate(date: Date): number {
        let seconds = (date.getTime() - new Date().getTime())/1000;
        return seconds;
    }

    public formatRemainingTime(seconds: number): string {
        let minutes = Math.floor(seconds/60);
        let hours = Math.floor(minutes/60);
        let days = Math.floor(hours/24);

        if (days == 1) return `demain`;
        else if (Math.abs(days) == 0) return `aujourd'hui`;
        else if (Math.abs(days) > 1) return `${days} jours`;
        else {
            let formattedHours = hours-(days*24)+"";
            if (+formattedHours < 10) formattedHours = `0${formattedHours}`;        
    
            let formattedMinutes = minutes-(days*24*60)-(hours*60)+"";
            if (+formattedMinutes < 10) formattedMinutes = `0${formattedMinutes}`;  
    
            return `${formattedHours}:${formattedMinutes}`
        }
    }
}