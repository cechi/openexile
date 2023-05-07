import { Mesh, MeshBuilder, ParticleSystem, Scene, Texture, TransformNode, Vector3 } from "@babylonjs/core";
import { Board } from "../../board";

export class BaseProjectile extends TransformNode {

	static i = -1;

	protected _mesh: Mesh;
	get mesh() { return this._mesh }
	
	protected _direction: Vector3 = Vector3.Zero();
	get direction() { return this._direction }
	set direction(v: Vector3) { this._direction = v }
	
	public index: number;

	constructor(public readonly board: Board) {
		super('projectile', board.scene);
		this.index = ++BaseProjectile.i;

		const coreSphere = MeshBuilder.CreateSphere(null, {diameter: 20, segments: 16}, board.scene);
		this._mesh = coreSphere;
		this._mesh.parent = this;
		this._mesh.isVisible = false;
	}

	updatePosition(deltaTime: number) {
		this._mesh.moveWithCollisions(this.direction.scale(1 * deltaTime));
	}

}

export class ParticleProjectile extends BaseProjectile {

	protected _particleSystem: ParticleSystem;

	constructor(public readonly board: Board, capacity = 200) {
		super(board);
		this._particleSystem = new ParticleSystem(null, capacity, board.scene);
		this._particleSystem.minSize = 10;
		this._particleSystem.maxSize = 30;
	}

}