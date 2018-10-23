import { Injectable } from '@angular/core';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projects: Project[] = Project.mock();

  constructor() { }

  public getPositions(): any[] {
    return [];
  }

}
