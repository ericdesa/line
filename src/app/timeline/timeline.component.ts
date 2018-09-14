import { ProjectService } from './../services/project.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Scene, PerspectiveCamera, WebGLRenderer, Camera } from 'three';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import dat from 'dat.gui'

import { SvgIcon } from '../../assets/icon/svg-icon';

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
    public SvgIcon = SvgIcon;
    protected gui: dat.GUI;

    public curveTension = 0;

    public spline: THREE.CatmullRomCurve3;

    @ViewChild('container') container: ElementRef;

    constructor(public renderer2: Renderer2, public projectService: ProjectService) {

    }

    ngOnInit() {
        this.setupDatGui();
        this.setupScene();
        this.setupParticles();
        this.setupCurve();
        this.animate();



        this.renderer.autoClear = false;
        let composer = new THREE.EffectComposer(this.renderer);
        var sunRenderModel = new THREE.RenderPass(this.scene, this.camera);
        var effectBloom = new THREE.BloomPass(1, 25, 5);
        var sceneRenderModel = new THREE.RenderPass(this.scene, this.camera);
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
        composer.addPass(sunRenderModel);
        composer.addPass(effectBloom);
        composer.addPass(effectCopy);
    }

    public setupDatGui() {
        this.gui = new dat.GUI();

        let curve = this.gui.addFolder('curve');
        curve.add(this, 'curveTension', -10, 10).onChange(this.setupCurve.bind(this));
    }
    public setupScene() {

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
        //this.camera.position.set(200, 0, 1000);

        this.scene.add(this.camera);


        /*******
         * Lights
         *********/

        let ambientLight = new THREE.AmbientLight(0x999999);
        this.scene.add(ambientLight);

        let lights = [];
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
        let planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        planeGeometry.rotateX(- Math.PI / 2);
        let planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -200;
        plane.receiveShadow = true;
        this.scene.add(plane);

        /*******
         * Grid
         *********/

        let grid = new THREE.GridHelper(2000, 100);
        grid.position.y = 0;
        grid.material.opacity = 0.25;
        grid.material.transparent = true;
        this.scene.add(grid);

        /*
        let axes = new THREE.AxesHelper(1000);
        axes.position.set(- 500, - 500, - 500);
        this.scene.add(axes);
        */

        /*******
         * Controls
         *********/

        let controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.damping = .2;
    }


    public setupParticles() {
        /*******
         * Particles
         *********/

        this.particle = new THREE.Object3D();
        this.scene.add(this.particle);

        let material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        } as any);

        let particleGeometry = new THREE.TetrahedronGeometry(2, 0);

        for (let i = 0; i < 1000; i++) {
            let mesh = new THREE.Mesh(particleGeometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar(90 + (Math.random() * 5000));
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            this.particle.add(mesh);
        }

    }

    protected line: THREE.Line;
    protected tags: THREE.Points;

    protected setupCurve() {

        if (this.line) this.scene.remove(this.line);
        if (this.tags) this.scene.remove(this.tags);

        /*******
         * Data
         *********/

        let positions = this.projectService.getPositions();

        let vertices = [];
        positions.forEach((position) => {
            vertices.push(position.x, position.y, position.z);
        });


        /*******
         * Curves
         *********/
        let curve = new THREE.CatmullRomCurve3(positions, false, 'catmullrom', this.curveTension);

        let lineGeometry = new THREE.Geometry();
        let points2 = curve.getSpacedPoints(1000);
        lineGeometry.vertices = points2;

        let lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.35,
            linewidth: 5
        });

        this.line = new THREE.Line(lineGeometry, lineMaterial);
        this.scene.add(this.line);


        /*******
         * tags
         *********/

        let sprite = new THREE.TextureLoader().load('assets/disc.png');

        let tagGeometry = new THREE.BufferGeometry();
        tagGeometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        let spriteMaterial = new THREE.PointsMaterial({ size: 10, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
        spriteMaterial.color.setHSL(1.0, 1.0, 1.0);

        this.tags = new THREE.Points(tagGeometry, spriteMaterial);
        this.scene.add(this.tags);
    }


    public animate() {
        requestAnimationFrame(() => { this.animate() });
        this.render();
    }

    public render() {
        //this.renderer.clear();

        this.particle.rotation.y -= 0.0008;

        this.renderer.render(this.scene, this.camera);
    }

}
