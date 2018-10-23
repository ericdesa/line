import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import dat from 'dat.gui'

import { SvgIcon } from '../../assets/icon/svg-icon';

import * as d3 from 'd3';
 

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    public SvgIcon = SvgIcon;
    protected gui: dat.GUI;

    @ViewChild('container') container: ElementRef;

    constructor(public renderer2: Renderer2, public projectService: ProjectService) {

    }

    ngOnInit() {
        this.setupDatGui();
        console.log(d3.select('body'));
    }

    public setupDatGui() {
        this.gui = new dat.GUI();
    }
    
}
