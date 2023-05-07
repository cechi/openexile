import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from "@babylonjs/core";

export class Pointer extends TransformNode {

	private _ball: Mesh;
	private _material: StandardMaterial;
	
	get color() { return this._material.diffuseColor }
	set color(c: Color3) { this._material.diffuseColor = c }

	constructor(scene: Scene) {
		super('pointer', scene);
		this._ball = MeshBuilder.CreateSphere('pointer.ball', {segments: 10, diameter: 30}, scene);
		this._ball.parent = this;
		this._material = new StandardMaterial(undefined, scene);
		this._material.diffuseColor = new Color3(1, 0, 0);
		this._ball.material = this._material;
		this.position.x = 0;
		this.position.z = 0;
		this.position.y = 0;
	}

}