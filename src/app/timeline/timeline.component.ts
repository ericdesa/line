import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import * as THREE from 'three';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;


  public stats;
  public spotlight;
  public splineHelperObjects: THREE.Mesh[] = [];
  public splineOutline;
  public splinePointsLength = 4;
  public positions: THREE.Vector3[] = [];
  public point = new THREE.Vector3();
  public options;

  public geometry = new THREE.BoxBufferGeometry(20, 20, 20);

  public ARC_SEGMENTS = 200;

  public splines: { uniform: any, centripetal: any, chordal: any } = { uniform: false, centripetal: false, chordal: false };

  @ViewChild('container') container: ElementRef;

  constructor(public renderer2: Renderer2) { }

  ngOnInit() {
    this.init();
    this.animate();
  }


  public init() {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
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

    //var axes = new THREE.AxesHelper( 1000 );
    //axes.position.set( - 500, - 500, - 500 );
    //this.scene.add( axes );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.renderer2.appendChild(this.container.nativeElement, this.renderer.domElement);


    /*******
     * Curves
     *********/

    for (var i = 0; i < this.splinePointsLength; i++) {

      this.addSplineObject(this.positions[i]);

    }

    this.positions = [];

    for (var i = 0; i < this.splinePointsLength; i++) {

      this.positions.push(this.splineHelperObjects[i].position);

    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.ARC_SEGMENTS * 3), 3));

    var curve: any = new THREE.CatmullRomCurve3(this.positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: 0.35,
      linewidth: 2
    }));
    curve.mesh.castShadow = true;
    this.splines.uniform = curve;

    curve = new THREE.CatmullRomCurve3(this.positions);
    curve.curveType = 'centripetal';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.35,
      linewidth: 2
    }));
    curve.mesh.castShadow = true;
    this.splines.centripetal = curve;

    curve = new THREE.CatmullRomCurve3(this.positions);
    curve.curveType = 'chordal';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
      color: 0x0000ff,
      opacity: 0.35,
      linewidth: 2
    }));
    curve.mesh.castShadow = true;
    this.splines.chordal = curve;

    for (var k in this.splines) {

      var spline = this.splines[k];
      this.scene.add(spline.mesh);

    }

    this.load([new THREE.Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
    new THREE.Vector3(-53.56300074753207, 171.49711742836848, -14.495472686253045),
    new THREE.Vector3(-91.40118730204415, 176.4306956436485, -6.958271935582161),
    new THREE.Vector3(-383.785318791128, 491.1365363371675, 47.869296953772746)]);

  }

  public addSplineObject(position?: any): THREE.Mesh {

    var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var object = new THREE.Mesh(this.geometry, material);

    if (position) {

      object.position.copy(position);

    } else {

      object.position.x = Math.random() * 1000 - 500;
      object.position.y = Math.random() * 600;
      object.position.z = Math.random() * 800 - 400;

    }

    object.castShadow = true;
    object.receiveShadow = true;
    this.scene.add(object);
    this.splineHelperObjects.push(object);
    return object;

  }

  public addPoint() {

    this.splinePointsLength++;

    let point = this.addSplineObject();
    this.positions.push(point.position);

    this.updateSplineOutline();

  }

  public removePoint() {

    if (this.splinePointsLength <= 4) {

      return;

    }
    this.splinePointsLength--;
    this.positions.pop();
    this.scene.remove(this.splineHelperObjects.pop());

    this.updateSplineOutline();

  }

  public updateSplineOutline() {

    for (var k in this.splines) {

      var spline = this.splines[k];

      var splineMesh = spline.mesh;
      var position = splineMesh.geometry.attributes.position;

      for (var i = 0; i < this.ARC_SEGMENTS; i++) {

        var t = i / (this.ARC_SEGMENTS - 1);
        spline.getPoint(t, this.point);
        position.setXYZ(i, this.point.x, this.point.y, this.point.z);

      }

      position.needsUpdate = true;

    }

  }

  public load(new_positions) {

    while (new_positions.length > this.positions.length) {

      this.addPoint();

    }

    while (new_positions.length < this.positions.length) {

      this.removePoint();

    }

    for (var i = 0; i < this.positions.length; i++) {

      this.positions[i].copy(new_positions[i]);

    }

    this.updateSplineOutline();

  }

  public animate() {
    requestAnimationFrame(() => { this.animate() });
    this.render();
  }

  public render() {
    this.splines.uniform.mesh.visible = true;
    this.splines.centripetal.mesh.visible = true;
    this.splines.chordal.mesh.visible = true;
    this.renderer.render(this.scene, this.camera);
  }

}
