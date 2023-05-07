import { Mesh, MeshBuilder, ParticleSystem, Scene, Texture, TransformNode, Vector3 } from "@babylonjs/core";

export class BaseProjectile extends TransformNode {

	static i = -1;

	protected _mesh: Mesh;
	get mesh() { return this._mesh }
	
	protected _direction: Vector3 = Vector3.Zero();
	get direction() { return this._direction }
	set direction(v: Vector3) { this._direction = v }
	
	public index: number;

	constructor(scene: Scene) {
		super('projectile', scene);
		this.index = ++BaseProjectile.i;

		const coreSphere = MeshBuilder.CreateSphere(null, {diameter: 20, segments: 16}, scene);
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

	constructor(public readonly scene: Scene, capacity = 200) {
		super(scene);
		this._particleSystem = new ParticleSystem(null, capacity, scene);
		this._particleSystem.minSize = 10;
		this._particleSystem.maxSize = 30;
	}

}