import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import dat from 'dat.gui'

import * as d3 from 'd3';
 

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    protected pointsGroup: any;
    protected xScale: any;
    protected xAxis: any;
    protected xAxisGroup: any;

    protected yScale: any;
    protected yAxis: any;
    protected yAxisGroup: any;

    protected gui: dat.GUI;

    @ViewChild('container') container: ElementRef;

    constructor(public renderer2: Renderer2, public projectService: ProjectService) {

    }

    ngOnInit() {
        this.setupDatGui();
        this.setupChart();
        this.reloadData();
    }

    public setupDatGui() {
        this.gui = new dat.GUI();
    }

    public setupChart() {

        // container
        const width = 960;
        const height = 480;
        
        let svg = d3.select('app-timeline svg')
            .attr('width', width)
            .attr('height', height);


        // plots
        let plotMargins = {
            top: 30,
            bottom: 30,
            left: 150,
            right: 30
        };

        let plotGroup = svg.append('g')
            .classed('plot', true)
            .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
        
        let plotWidth = width - plotMargins.left - plotMargins.right;
        let plotHeight = height - plotMargins.top - plotMargins.bottom;


        // x axis
        this.xScale = d3.scaleTime()
            .range([0, plotWidth]);

        this.xAxis = d3.axisBottom(this.xScale);
        this.xAxisGroup = plotGroup.append('g')
            .classed('x', true)
            .classed('axis', true)
            .attr('transform', `translate(${0},${plotHeight})`)
            .call(this.xAxis);


        // y axis
        this.yScale = d3.scaleLinear()
            .range([plotHeight, 0]);

        this.yAxis = d3.axisLeft(this.yScale);
        this.yAxisGroup = plotGroup.append('g')
            .classed('y', true)
            .classed('axis', true)
            .call(this.yAxis);


        // points
        this.pointsGroup = plotGroup.append('g')
            .classed('points', true);
    }

    protected reloadData() {
        // data
        let prepared = new Array(15).fill(0).map(() => {
            return {
                date: this.randomDate(new Date(2012, 0, 1), new Date()),
                score: Math.floor(Math.random()*500)
            }
        }); 

        console.log(prepared);
        
        // axis
        this.xScale.domain(d3.extent(prepared, d => d.date)).nice();
        this.xAxisGroup.transition().call(this.xAxis);
        
        this.yScale.domain(d3.extent(prepared, d => d.score)).nice();
        this.yAxisGroup.transition().call(this.yAxis);
        
        var dataBound = this.pointsGroup.selectAll('.post').data(prepared);
    
        // delete extra points
        dataBound
            .exit()
            .remove();

        // add new points
        var enterSelection = dataBound
            .enter()
            .append('g')
            .classed('post', true);
    
        // update all existing points
        enterSelection.merge(dataBound)
		    .transition()
            .attr('transform', (d, i) => `translate(${this.xScale(d.date)}, ${this.yScale(d.score)})`);

        enterSelection.append('circle')
            .attr('r', 2)
            .style('fill', 'red');
    }

    private randomDate(start: Date, end: Date) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    
    public reloadHandler() {
        this.reloadData();
    }
}
 