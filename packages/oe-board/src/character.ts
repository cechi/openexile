import { Mesh, Scene, TransformNode, AnimationGroup, Vector3, MeshBuilder, Matrix, Vector2 } from "@babylonjs/core";
import { BaseProjectile } from "./weapons/projectiles/baseProjectile";
import { FireballProjectile } from "./weapons/projectiles/fireball";
import { AssetProps } from "./types";

export type CharacterAnimation = 'running'|'idle'|'throw01';

export class Character extends TransformNode {

	public direction: Vector3 = Vector3.Zero();

	private _mesh: Mesh; //outer collisionbox of player
	private _activeAnimation: AnimationGroup;
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

	startAnimation(name: CharacterAnimation, speedRatio = 1.0) {
		this._activeAnimation = this.animationGroups.get(name);
		this._activeAnimation.start(true, speedRatio, this._activeAnimation.from, this._activeAnimation.to, false);
		return this;
	}

	stopAnimation(name: CharacterAnimation = null) {
		if (name) {
			this.animationGroups.get(name).stop();
		} else if (this._activeAnimation) {
			this._activeAnimation.stop();
			this._activeAnimation = null;
		}
		return this;
	}

	private _targetLoc: Vector3;
	private _moveToTarget = false;
	set moveToTarget(v: boolean) { this._moveToTarget = v }
	get moveToTarget() { return this._moveToTarget }

	setTarget(x: number, z: number) {
		this._targetLoc = new Vector3(x, 0, z);
		return this;
	}

	gotoTarget() {
		this.startAnimation("running");
		this._moveToTarget = true;
		return this;
	}

	stopMoving() {
		if (this._moveToTarget) {
			this._moveToTarget = false;
			this.stopAnimation().startAnimation("idle");
			return this;
		}
	}

	private _projectiles = new Map<number, BaseProjectile>();
	private _lastFireTime: number = 0;

	fire() {
		const projectile = new FireballProjectile(this.scene);
		const position = this.mesh.position.clone();
		position.y = 150;
		projectile.mesh.position = position;
		//this._targetLoc.subtract(this.mesh.position).normalize();
		projectile.direction = this._targetLoc.subtract(this.mesh.position).normalize();
		this._projectiles.set(projectile.index, projectile);
		this._lastFireTime = performance.now();
		this.startAnimation('throw01', 5);
	}

	private _isAttacking = false;

	startAttack() {
		this._isAttacking = true;
		return this;
	}

	stopAttack() {
		this._isAttacking = false;
		this.stopAnimation().startAnimation('idle');
		return this;
	}

	updateAttacks(deltaTime: number) {
		if (this._isAttacking) {
			if (performance.now() - this._lastFireTime >= 400) {
				this.fire();
			}
		}
		this._projectiles.forEach(p => {
			if (p.mesh.position.subtract(this.mesh.position).length() > 2000) {
				this._projectiles.delete(p.index);
				p.dispose();
			} else {
				p.updatePosition(deltaTime);
			}
		});
	}

	updatePosition(deltaTime: number) {
		if (!this._moveToTarget) return;
		deltaTime = deltaTime / 2;
		const moveDirection = this._targetLoc.subtract(this.mesh.position).normalize();
		// console.log(deltaTime);
		this.mesh.moveWithCollisions(moveDirection.scale(deltaTime));

		const len = this.mesh.position.subtract(this._targetLoc).length();
		if (Math.abs(len) < 5) {
			this.mesh.position = this._targetLoc;
			this.stopAnimation();
			// a.start(true, 1.0, a.from, a.to, false);
			// this.startIdleAnimation();
		}
	}
	
}

export class Player extends Character {

}

export class Mob extends Character {
	
}