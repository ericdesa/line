import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;

  public spotlight: THREE.SpotLight;
  public ARC_SEGMENTS = 10;

  public spline: THREE.CatmullRomCurve3;

  @ViewChild('container') container: ElementRef;

  constructor(public renderer2: Renderer2, public projectService: ProjectService) {

  }

  ngOnInit() {
    this.init();
    this.animate();
  }


  public init() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.far = 9999;
    this.camera.near = 0;
    this.camera.position.set(0, 250, 1000);
    this.scene.add(this.camera);

    this.scene.add(new THREE.AmbientLight(0xf0f0f0));
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.castShadow = true;
    light.shadow = new THREE.SpotLightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
    this.spotlight = light;

    var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);
    var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    this.scene.add(plane);

    var helper = new THREE.GridHelper(2000, 100);
    helper.position.y = - 199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.scene.add(helper);

    var axes = new THREE.AxesHelper(1000);
    axes.position.set(- 500, - 500, - 500);
    this.scene.add(axes);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.renderer2.appendChild(this.container.nativeElement, this.renderer.domElement);


    /*******
     * Curves
     *********/

    let positions = this.projectService.getPositions();


    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

    let curve: any = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'centripetal';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.35,
      linewidth: 2
    }));
    curve.mesh.castShadow = true;
    this.spline = curve;
    this.scene.add(curve.mesh);


    var spline: any = this.spline;

    var position = spline.mesh.geometry.attributes.position;

    for (var i = 0; i < this.ARC_SEGMENTS; i++) {

      var t = i / (this.ARC_SEGMENTS - 1);
      let point = this.spline.getPoint(t);
      position.setXYZ(i, point.x, point.y, point.z);

    }

    position.needsUpdate = true;






    console.log(this.camera, this.renderer.domElement);
    debugger

    // Controls

    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.damping = 0.2;

  }


  public animate() {
    requestAnimationFrame(() => { this.animate() });
    this.render();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

}
