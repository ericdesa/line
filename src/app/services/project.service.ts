import { Injectable } from '@angular/core';
import { JsonConvert } from 'json2typescript';

import { Project } from '../models/project';
import mocks from '../../assets/mocks/projects.json';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public projects: Project[] = [];

  constructor() { 
    let jsonConvert = new JsonConvert();
    this.projects = jsonConvert.deserializeArray(mocks.projects, Project);
  }

} 
