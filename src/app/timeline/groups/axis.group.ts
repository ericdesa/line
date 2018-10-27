import { DefaultSelection, screenWidth, projectsWidth } from "../utils/consts";

import { Project } from "../../models/project";

import * as d3 from "d3";

export class AxisGroup {

    public axis: d3.Axis<Date>;
    public scaleTime: d3.ScaleTime<number, number>;
    public group: DefaultSelection;

    public width = screenWidth - projectsWidth;


    // Setup
    // -----------------------------------------------------

    constructor(svg: DefaultSelection, projects: Project[]) {
        this.setupLocalization();
        this.setupScaleTime(projects);
        this.setupAxis(this.scaleTime);
        this.setupGroup(svg);
        this.extendTicksVertically();
    }

    protected setupScaleTime(projects: Project[]): d3.ScaleTime<number, number> {
        let allDomainesDates = projects.map(project => project.getDomaine()).reduce((acc, cur) => acc.concat(cur));
        let scaleTime = d3.scaleTime();
        scaleTime.domain([d3.min(allDomainesDates), d3.max(allDomainesDates)])
            .range([0, this.width]);
        this.scaleTime = scaleTime;
        return this.scaleTime;
    }

    protected setupAxis(scaleTime: d3.ScaleTime<number, number>): d3.Axis<Date> {
        this.axis = d3.axisTop(scaleTime) as d3.Axis<Date>;
        return this.axis;
    }

    protected setupGroup(svg: DefaultSelection): DefaultSelection {
        this.group = svg
            .append('g')
            .attr('transform', `translate(${projectsWidth}, 30)`)
            .call(this.axis);

        return this.group;
    }

    protected setupLocalization() {
        d3.timeFormatDefaultLocale({
            "dateTime": "%A, le %e %B %Y, %X",
            "date": "%d/%m/%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
            "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
            "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
            "shortMonths": ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
          });
    }


    // Styling
    // -----------------------------------------------------

    protected extendTicksVertically() {
        this.group
            .selectAll(".tick line")
            .attr("y1", "-4")
            .attr("y2", "500")
            .attr("stroke-dasharray", "4, 2");
        }
}