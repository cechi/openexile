import { 
	Scene, Engine, Camera, Vector3, HemisphericLight, MeshBuilder, 
	Mesh, Light, StandardMaterial, Color3, Color4, DynamicTexture, ArcFollowCamera,
	AssetsManager, PointerInput
} from "@babylonjs/core";
import { GridMaterial } from '@babylonjs/materials';
import { AssetMap, Options } from "./types";
import { loadAssets } from "./assets";
import { Player } from "./character";
import { Pointer } from "./poiner";

export class Board {

	private _scene: Scene;
	get scene() { return this._scene }

	private engine: Engine;
	private camera: Camera;
	private ground: Mesh;
	private light: Light;
	private assetManager: AssetsManager;
	private assets: AssetMap;
	private player: Player;
	private pointer: Pointer;
	private targetPointer: Pointer;
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
		mat.lineColor = new Color3(0.4, 0.4, 0.4);
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

	constructor(private canvas: HTMLCanvasElement, public readonly options: Options) {
		this.engine = new Engine(this.canvas, true);
		this._scene = new Scene(this.engine);
		//this.scene.debugLayer.show({embedMode: true});
		this.scene.clearColor = new Color4(0, 0, 0);
		this.light = this.createLight();
		this.ground = this.createGround();
		this.load();
	}

	setTargetToPointer(goto = true) {
		const pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY, m => m == this.ground);
		if (pickResult.hit) {
			this.pointer.position = new Vector3(pickResult.pickedPoint.x, this.pointer.position.y, pickResult.pickedPoint.z);
			var diffX = pickResult.pickedPoint.x - this.player.mesh.position.x;
			var diffY = pickResult.pickedPoint.z - this.player.mesh.position.z;
			this.player.mesh.rotation.y = Math.atan2(diffX, diffY);

			this.player.setTarget(this.pointer.position.x, this.pointer.position.z);
			if (goto) this.player.gotoTarget();
			else this.player.stopMoving();
		}
	}

	async load() {
		this.assets = await loadAssets(this.scene, this.options);

		this.engine.runRenderLoop(() =>	this.scene.render());
		// this.showWorldAxis(300, 100);

		this.player = new Player(this, this.assets.get("sorceress"));
		this.player.startAnimation("idle");
		
		this.camera = this.createCamera(this.player.mesh);
		this.pointer = new Pointer(this.scene);
		
		this.scene.onPointerDown = (e, pickInfo, type) => {
			this.inputIndex = e.inputIndex;
			if (e.inputIndex == PointerInput.LeftClick) {
				this.setTargetToPointer();
			} else if (e.inputIndex == PointerInput.RightClick) {
				this.player.startAttack();
				this.setTargetToPointer(false);
			}
		};
		
		this.scene.onPointerUp = (e, pickInfo, type) => {
			this.inputIndex = null;
			if (e.inputIndex == PointerInput.RightClick) {
				this.player.stopAttack();
			}
		};

		this.scene.registerBeforeRender(() => {
			if (this.inputIndex == PointerInput.LeftClick) {
				this.setTargetToPointer();
			} else if (this.inputIndex == PointerInput.RightClick) {
				this.setTargetToPointer(false);
			}
			const deltaTime = this.scene.getEngine().getDeltaTime();
			this.player.updateAttacks(deltaTime);
			this.player.updatePosition(deltaTime);
		});
	}

	resize() {
		this.engine.resize();
	}

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