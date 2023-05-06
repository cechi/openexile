import { Mesh, Scene, TransformNode, AnimationGroup, Vector3, MeshBuilder, Matrix } from "@babylonjs/core";
import { AssetProps } from "./types";

export type CharacterAnimation = 'running'|'idle';

export class Character extends TransformNode {

	private _mesh: Mesh; //outer collisionbox of player
	get mesh() { return this._mesh }

	private animationGroups = new Map<CharacterAnimation, AnimationGroup>();
	
	private createOuterMesh() {
		const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, this.scene);
		outer.isVisible = false;
		outer.isPickable = false;
		outer.checkCollisions = true;
		//move origin of box collider to the bottom of the mesh (to match player mesh)
		outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
		//for collisions
		outer.ellipsoid = new Vector3(1, 1.5, 1);
		outer.ellipsoidOffset = new Vector3(0, 1.5, 0);
		// outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
		outer.parent = this;
		return outer;
	}

	constructor(name: string, assetProps: AssetProps, private scene: Scene) {
		super(name, scene);

		this._mesh = this.createOuterMesh();

		const inner = assetProps.mesh.clone();
		inner.getChildMeshes().forEach(m => m.isVisible = true);
		inner.parent = this._mesh;
		inner.isPickable = false;
		// this._mesh.parent = 

		// let entries = assetProps.mesh.instantiateModelsToScene(s => {
		// 	return `${s}`;
		// }, false, { doNotInstantiate: true });

		assetProps.animationGroups.forEach(g => this.animationGroups.set((g.name.toLowerCase()) as CharacterAnimation, g));
		
		this._targetLoc = this._mesh.position;
		// this._mesh = assetProps.container.meshes[0] as Mesh;	
		// this._mesh.moveWithCollisions(new Vector3(1000, 0, 0));
	}

	startAnimation(name: CharacterAnimation) {
		const a = this.animationGroups.get(name);
		a.start(true, 1.0, a.from, a.to, false);
	}

	stopAnimation(name: CharacterAnimation) {
		const a = this.animationGroups.get(name);
		a.stop();
	}

	startRunningAnimation = () => this.startAnimation("running");
	startIdleAnimation = () => this.startAnimation("idle");

	private _targetLoc: Vector3;

	goto(x: number, z: number) {
		this.startRunningAnimation();
		this._targetLoc = new Vector3(x, 0, z);
	}

	updatePosition() {
		const deltaTime = this.scene.getEngine().getDeltaTime() / 2;
		const moveDirection = this._targetLoc.subtract(this.mesh.position).normalize();
		// console.log(deltaTime);
		this.mesh.moveWithCollisions(moveDirection.scale(deltaTime));

		const len = this.mesh.position.subtract(this._targetLoc).length();
		if (Math.abs(len) < 5) {
			this.mesh.position = this._targetLoc;
			this.stopAnimation('running');
			// a.start(true, 1.0, a.from, a.to, false);
			// this.startIdleAnimation();
		}		
	}
	

}

export class Player extends Character {

}

export class Mob extends Character {
	
}