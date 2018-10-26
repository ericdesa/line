import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import dat from 'dat.gui'

import * as d3 from 'd3';
import * as moment from 'moment';

import { Task } from '../models/task';
import { TaskTime } from '../models/task-time';
 

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    protected pointsGroup: any;
    protected xScale: d3.ScaleTime<number, number>;
    protected xAxis: d3.Axis<d3.AxisDomain>;

    protected gui: dat.GUI;

    @ViewChild('container') container: ElementRef;

    constructor(public renderer2: Renderer2, public projectService: ProjectService) {

    }

    ngOnInit() {
        this.setupDatGui();
        this.setupChart();
    }

    public setupDatGui() {
        // this.gui = new dat.GUI();
    }

    public setupChart() {

        // container
        const width = 960;
        const height = 480;
        const lineHeight = 50;
        const titleWidth = 100;
        
        let svg = d3.select('app-timeline svg')
            .attr('width', width)
            .attr('height', height);

        // data
        let data: Task[] = this.projectService.projects.map((d) => d.tasks).reduce((prev, cur) => cur);
        let allDates: Date[] = data
            .map((task) => task.deadline)
            .concat(data.map((task) => task.times.map((time) => time.startDate)).reduce((prev, cur) => cur))
            .concat(data.map((task) => task.times.map((time) => time.endDate)).reduce((prev, cur) => cur))
            .concat(moment().add(7, "days").toDate());

        // scale
        this.xScale = d3.scaleTime()
            .domain([d3.min(allDates), d3.max(allDates)])
            .range([titleWidth, width-titleWidth]);

        // svg
        let content = svg.append("g");
        
        content.selectAll()
            .data(data, (d: Task) => d.name)
            .enter()

            .append("g")
            .classed("line", true);

        let lines = content.selectAll(".line");

        // project
        lines.append("rect")
            .classed("line-content", true)
            .attr("width", width)
            .attr("height", lineHeight)
            .attr("fill", "transparent")
            .attr("y", (d, i) => (i * lineHeight));
            
        lines.append("rect")
            .classed("line-separator", true)
            .attr("width", width)
            .attr("height", 1)
            .attr("y", (d, i) => ((i+1) * lineHeight - 1));
        
        lines.append("rect")
            .classed("line-separator", true)
            .attr("width", 1)
            .attr("height", lineHeight)
            .attr("x", titleWidth)
            .attr("y", (d, i) => (i * lineHeight));

        lines.append("text")
            .classed("line-project-name", true)
            .attr("width", titleWidth)
            .attr("height", lineHeight)
            .attr("text-anchor", "middle")
            .attr("x", titleWidth/2)
            .attr("y", (d, i) => (i * lineHeight + lineHeight/2))
            .text((d: Task) => d.name);

        // timeline
        svg.append("defs")
            .append("clipPath")
            .attr("id", "timeline-clip")
            .append("rect")
            .attr("x",titleWidth)
            .attr("width", width - titleWidth)
            .attr("height", height);

        lines.append("g")
            .classed("line-timeline", true)
            .attr("clip-path", "url(#timeline-clip)");

        let timeline = content.selectAll(".line-timeline");

        timeline.append("rect")
            .classed("duration", true)
            .attr("x", (task: Task) => this.xScale(task.firstTaskAt()))
            .attr("y", (d, i) => (i * lineHeight + lineHeight/2))
            .attr("width", (task: Task) => this.xScale(task.deadline) - this.xScale(task.firstTaskAt()))
            .attr("height", 1);

        
        timeline.selectAll(".line-timeline-time")
            .data((task: Task) => {
                return task.times.map((time: TaskTime) => {
                    return { task: task, time: time }
                });
            })
            .enter()
            .append("rect")
            .classed("line-timeline-time", true)
            .attr("clip-path", "url(#timeline-clip)")
            .attr("x", (d) => this.xScale(d.time.startDate))
            .attr("y", (d) => ((data.indexOf(d.task)) * lineHeight + lineHeight/2) - 2)
            .attr("width", (d) => this.xScale(d.time.endDate) - this.xScale(d.time.startDate))
            .attr("height", 4);
        
        // now
        let xNow = this.xScale(new Date());
        content.append("line")
            .classed("now-line", true)
            .attr("stroke-dasharray", "4, 6")
            .attr("stroke", "red")
            .attr("x1", xNow)
            .attr("y1", 0)
            .attr("x2", xNow)
            .attr("y2", lineHeight * data.length);

        // axis
        this.xAxis = d3.axisBottom(this.xScale);
        content.append('g')
            .classed('axis', true)
            .attr('transform', `translate(0, ${lineHeight * data.length})`)
            .call(this.xAxis);
        
        // Zoom
        let zoom = d3.zoom()
            //.scaleExtent([1, 32])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", () => { this.zoomHandler() }); 

        svg.call(zoom);

        d3.selectAll('.line-timeline-time')
            .on("mouseover", function (data: any) {

                var xPosition = parseFloat(d3.select(this).attr("x")) + parseFloat(d3.select(this).attr("width")) / 2; 
                var yPosition = parseFloat(d3.select(this).attr("y"));

                d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .classed("hidden", false)
                    .select("#value")
                    .text(data.time.formattedDuration());
            })
            .on("mouseout", (data) =>{
                d3.select("#tooltip").classed("hidden", true);
            })
    }

    public zoomHandler() {
        let xScaleUpdated = d3.event.transform.rescaleX(this.xScale);
        d3.select('app-timeline svg .axis')
            .call(this.xAxis.scale(xScaleUpdated));
        
        d3.selectAll('app-timeline svg .duration')
            .attr("x", (task: Task) => xScaleUpdated(task.firstTaskAt()))
            .attr("width", (task: Task) => xScaleUpdated(task.lastTaskAt()) - xScaleUpdated(task.firstTaskAt()));

        d3.selectAll('app-timeline svg .line-timeline-time')
            .attr("x", (d: any) => xScaleUpdated(d.time.startDate))
            .attr("width", (d: any) => xScaleUpdated(d.time.endDate) - xScaleUpdated(d.time.startDate));

        let xNow = xScaleUpdated(new Date());
        d3.selectAll('app-timeline svg .now-line')
            .attr("x1", xNow)
            .attr("x2", xNow);

    }
}
 