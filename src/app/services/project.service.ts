import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import * as THREE from 'three';
import { TimeEventType } from '../models/time-event';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projects: Project[] = Project.mock();

  constructor() { }

  public getPositions(): THREE.Vector3[] {

    let positions: THREE.Vector3[] = [];

    let y = 0;
    let lineSize = 200;

    this.projects.forEach((project) => {

      y -= lineSize;
      project.tasks.forEach((task) => {

        task.times.forEach((time) => {
          positions.push(new THREE.Vector3(time.date.getTime(), (time.type === TimeEventType.Off) ? 0 : y, 0));
        });

        y -= lineSize;
      })
    });

    positions = positions.sort((p1: THREE.Vector3, p2: THREE.Vector3) => {
      return p1.x < p2.x ? -1 : 1;
    });


    let hour = 60 * 60 * 1000;
    let minX = positions[0].x;
    positions.forEach((p1: THREE.Vector3, ) => {
      p1.x -= minX;
      p1.x /= hour;
    });

    return positions;
  }

}
