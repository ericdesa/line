import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projects: Project[] = Project.mock();

  constructor() { }

  public getPositions(): THREE.Vector3[] {
    let y = 0;

    let positions: THREE.Vector3[] = [];

    this.projects.forEach((project) => {
      project.tasks.forEach((task) => {

        task.times.forEach((time) => {
          positions.push(new THREE.Vector3(time.date.getTime(), y, 0));
        });

        y += 50;
      })

      y += 50;
    });

    positions = positions.sort((p1: THREE.Vector3, p2: THREE.Vector3) => {
      return p1.x < p2.x ? -1 : 1;
    });

    let minX = positions[0].x;
    positions.forEach((p1: THREE.Vector3, ) => {
      p1.x -= minX;
      p1.x /= 100000;
    });

    return positions;
  }

}
