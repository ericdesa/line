import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Scene, PerspectiveCamera, WebGLRenderer, Camera } from 'three';
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
  public camera: Camera;
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

    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000000000);
    //this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000000000);
    //this.camera.position.set(0, 250, 1000);
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

    var grid = new THREE.GridHelper(2000, 100);
    grid.position.y = 0;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    this.scene.add(grid);

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
    lineGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * positions.length), 3));

    let spline: any = new THREE.CatmullRomCurve3(positions);
    spline.curveType = 'centripetal';
    spline.mesh = new THREE.Line(lineGeometry.clone(), new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.35,
      linewidth: 2
    }));
    this.spline = spline;
    this.scene.add(spline.mesh);


    var position = spline.mesh.geometry.attributes.position;

    for (var i = 0; i < this.ARC_SEGMENTS; i++) {

      var t = i / (this.ARC_SEGMENTS - 1);
      let point = this.spline.getPoint(t);
      position.setXYZ(i, point.x, point.y, point.z);

    }

    position.needsUpdate = true;


    /*******
     * tags
     *********/

    var sprite = new THREE.TextureLoader().load('assets/disc.png');
    var vertices = [];
    positions.forEach((position) => {
      vertices.push(position.x, position.y, position.z);
    });

    var tagGeometry = new THREE.BufferGeometry();
    tagGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let spriteMaterial = new THREE.PointsMaterial({ size: 10, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    spriteMaterial.color.setHSL(1.0, 1.0, 1.0);

    var particles = new THREE.Points(tagGeometry, spriteMaterial);
    this.scene.add(particles);


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
