import { 
	Scene, Engine, Camera, Vector3, HemisphericLight, MeshBuilder, 
	Mesh, Light, StandardMaterial, Color3, Color4, DynamicTexture, ArcFollowCamera,
	AssetsManager, PointerInput
} from "@babylonjs/core";
import { GridMaterial } from '@babylonjs/materials';
import { AssetMap } from "./types";
import { loadAssets } from "./assets";
import { Player } from "./character";
import { Pointer } from "./poiner";
import { FireballProjectile } from "./weapons/projectiles/fireball";

export class Board {

	private engine: Engine;
	private scene: Scene;
	private camera: Camera;
	private ground: Mesh;
	private light: Light;
	private assetManager: AssetsManager;
	private assets: AssetMap;
	private player: Player;
	private pointer: Pointer;
	private inputIndex: PointerInput;

	private createCamera(target: Mesh) {
		// const camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2, 500, new Vector3(100, 0, 0), this.scene);
		// camera.attachControl(this.engine.inputElement, true, false);
		// camera.panningAxis = new Vector3(1, 1, 0);
		// camera.upperBetaLimit = Math.PI / 2;
		// camera.wheelPrecision = 0.1;
		// camera.panningSensibility = 1;
		// camera.inertia = 0.1;
		// camera.panningInertia = 0.2;
		// //camera._panningMouseButton = 0; // change functionality from left to right mouse button
		// camera.angularSensibilityX = 500;
		// camera.angularSensibilityY = 500;
		
		// const camera = new UniversalCamera("cam1", new Vector3(0, 0, 0), this.scene);

		this.camera = new ArcFollowCamera("FollowCam", Math.PI / 4, Math.PI / 4, 750, target, this.scene);
		// this.camera.radius = 30;
		// this.camera.heightOffset = 10;
		// this.camera.rotationOffset = 0;
		// this.camera.cameraAcceleration = 0.005;
		// this.camera.maxCameraSpeed = 10;
		// this.camera.attachControl(canvas, true);
		// this.camera.target = targetMesh; // version 2.4 and earlier
		// this.camera.lockedTarget = targetMesh; //version 2.5 onwards

		return this.camera;
	}

	private createLight() {
		const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
		light.intensity = 0.7;
		return light;
	}

	private createGround() {
		const ground = MeshBuilder.CreateTiledGround("ground", {
			xmin: -500, 
			xmax: 500, 
			zmin: -500, 
			zmax: 500, 
			subdivisions: {
				w: 5,
				h: 5,
			}
		}, this.scene);
		const mat = new GridMaterial("groundMaterial", this.scene);
		mat.gridRatio = 5;
		mat.mainColor = new Color3(0.7, 0.7, 0.7);
		mat.lineColor = new Color3(0.9, 0.9, 0.9);
		mat.minorUnitVisibility = 0;
		ground.material = mat;
		ground.position.x = 0;
        ground.position.y = 0;
        ground.position.z = 0;
		// const mat = new StandardMaterial('mat1');
		// mat.emissiveColor = Color3.Green();
		// ground.material = mat;
		return ground;

		// const ground  = MeshBuilder.CreatePlane("ground", {size: 350}, this.scene);
        // ground.position.x = 150;
        // ground.position.y = 150;
		// const mat = new StandardMaterial('mat1');
		// mat.emissiveColor = Color3.Green();
        // ground.material = mat
		// return ground;
	}

	constructor(private canvas: HTMLCanvasElement) {
		this.engine = new Engine(this.canvas, true);
		this.scene = new Scene(this.engine);
		//this.scene.debugLayer.show({embedMode: true});
		this.scene.clearColor = new Color4(0, 0, 0);
		this.light = this.createLight();
		this.ground = this.createGround();
		this.load();
	}

	setTargetToPointer() {
		const pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY, m => m == this.ground);
		if (pickResult.hit) {
			this.pointer.position = new Vector3(pickResult.pickedPoint.x, this.pointer.position.y, pickResult.pickedPoint.z);
			var diffX = pickResult.pickedPoint.x - this.player.mesh.position.x;
			var diffY = pickResult.pickedPoint.z - this.player.mesh.position.z;
			this.player.mesh.rotation.y = Math.atan2(diffX, diffY);
			this.player.goto(this.pointer.position.x, this.pointer.position.z);
		}
	}

	async load() {
		this.assets = await loadAssets(this.scene);

		this.engine.runRenderLoop(() =>	this.scene.render());
		this.showWorldAxis(300, 100);

		this.player = new Player("player1", this.assets.get("Avatar01"), this.scene);
		this.player.startIdleAnimation();
		
		const testProjectile = new FireballProjectile(this.scene);
		testProjectile.position = new Vector3(0, 200, 0);

		this.camera = this.createCamera(this.player.mesh);
		this.pointer = new Pointer(this.scene);

		this.scene.onPointerDown = (e, pickInfo, type) => {
			this.inputIndex = e.inputIndex;
			if (e.inputIndex == PointerInput.LeftClick) {
				this.setTargetToPointer();
			}
		};

		this.scene.onPointerUp = (e, pickInfo, type) => {
			this.inputIndex = null;
		}

		this.scene.registerBeforeRender(() => {
			if (this.inputIndex == PointerInput.LeftClick) {
				this.setTargetToPointer();
			}
			this.player.updatePosition();
		});
	}

	resize() {
		this.engine.resize();
	}

	// public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
	// 	// This creates a basic Babylon Scene object (non-mesh)
	// 	var scene = new Scene(engine);

	// 	// This creates and positions a free camera (non-mesh)
	// 	var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

	// 	// This targets the camera to scene origin
	// 	camera.setTarget(Vector3.Zero());

	// 	// This attaches the camera to the canvas
	// 	camera.attachControl(canvas, true);

	// 	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	// 	var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

	// 	// Default intensity is 1. Let's dim the light a small amount
	// 	light.intensity = 0.7;

	// 	// Our built-in 'sphere' shape. Params: name, options, scene
	// 	var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

	// 	// Move the sphere upward 1/2 its height
	// 	sphere.position.y = 1;

	// 	// Our built-in 'ground' shape. Params: name, options, scene
	// 	var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

	// 	return scene;
	// }

	showWorldAxis(size: number, heightAboveGround: number) {
        const makeTextPlane = (text: string, color: string, size: number) => {
            const dynamicTexture = new DynamicTexture("DynamicTexture", 50, this.scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            const plane = MeshBuilder.CreatePlane("TextPlane", { size, }, this.scene);
            const mat = new StandardMaterial("TextPlaneMaterial", this.scene);
            mat.backFaceCulling = false;
            mat.specularColor = new Color3(0, 0, 0);
            mat.diffuseTexture = dynamicTexture;
			plane.material = mat;
            return plane;
        };
        const axisX = MeshBuilder.CreateLines("axisX", {
			points: [
				new Vector3(0, heightAboveGround, 0), new Vector3(size, heightAboveGround, 0), new Vector3(size * 0.95, 0.05 * size + heightAboveGround, 0),
				new Vector3(size, heightAboveGround, 0), new Vector3(size * 0.95, -0.05 * size + heightAboveGround, 0)
        	]
		}, this.scene);
        axisX.color = new Color3(1, 0, 0);
        const xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size + heightAboveGround, 0);
        const axisY = MeshBuilder.CreateLines("axisY", {
			points: [
				Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
				new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
        	]
		}, this.scene);
        axisY.color = new Color3(0, 1, 0);
        const yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);
        const axisZ = MeshBuilder.CreateLines("axisZ", {
			points: [
				new Vector3(0, heightAboveGround, 0), new Vector3(0, heightAboveGround, size), new Vector3(0, -0.05 * size + heightAboveGround, size * 0.95),
				new Vector3(0, heightAboveGround, size), new Vector3(0, 0.05 * size + heightAboveGround, size * 0.95)
			]
		}, this.scene);
        axisZ.color = new Color3(0, 0, 1);
        const zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    };
}