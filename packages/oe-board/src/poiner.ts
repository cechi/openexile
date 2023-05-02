import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";

export class Pointer extends TransformNode {

	private _ball: Mesh;

	constructor(scene: Scene) {
		super('pointer', scene);

		this._ball = MeshBuilder.CreateSphere('pointer.ball', {segments: 10, diameter: 30}, scene);
		this._ball.parent = this;
		const mat = new StandardMaterial(undefined, scene);
		mat.diffuseColor = new Color3(1, 0, 0);
		this._ball.material = mat;
		this.position.x = 100;
		this.position.z = 100;
		this.position.y = 0;
	}

}