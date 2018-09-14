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
  public particle: THREE.Object3D;

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

    /*******
     * Setup scene
     *********/

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.0);

    this.renderer2.appendChild(this.container.nativeElement, this.renderer.domElement);


    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000000000);
    this.camera.position.set(0, 250, 1000);
    this.scene.add(this.camera);


    /*******
     * Lights
     *********/

    var ambientLight = new THREE.AmbientLight(0x999999);
    this.scene.add(ambientLight);

    var lights = [];
    lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    lights[0].position.set(1, 0, 0);
    lights[1] = new THREE.DirectionalLight(0x11E8BB, 1);
    lights[1].position.set(0.75, 1, 0.5);
    lights[2] = new THREE.DirectionalLight(0x8200C9, 1);
    lights[2].position.set(-0.75, -1, 0.5);
    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);


    /*******
     * debug meshs
     *********/

    var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);
    var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    this.scene.add(plane);


    /*******
     * Grid
     *********/

    var helper = new THREE.GridHelper(2000, 100);
    helper.position.y = - 199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.scene.add(helper);

    var axes = new THREE.AxesHelper(1000);
    axes.position.set(- 500, - 500, - 500);
    this.scene.add(axes);



    /*******
     * Particles
     *********/

    this.particle = new THREE.Object3D();
    this.scene.add(this.particle);

    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    } as any);

    var particleGeometry = new THREE.TetrahedronGeometry(2, 0);

    for (var i = 0; i < 250; i++) {
      var mesh = new THREE.Mesh(particleGeometry, material);
      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.position.multiplyScalar(90 + (Math.random() * 700));
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      this.particle.add(mesh);
    }



    /*******
     * Curves
     *********/

    let positions = this.projectService.getPositions();


    var lineGeometry = new THREE.BufferGeometry();
    lineGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

    let curve: any = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'centripetal';
    curve.mesh = new THREE.Line(lineGeometry.clone(), new THREE.LineBasicMaterial({
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


    /*******
     * Controls
     *********/

    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.damping = 0.2;

  }


  public animate() {
    requestAnimationFrame(() => { this.animate() });
    this.render();
  }

  public render() {
    this.renderer.clear();

    this.particle.rotation.y -= 0.0008;

    this.renderer.render(this.scene, this.camera);
  }

}
