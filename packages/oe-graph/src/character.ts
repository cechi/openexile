import { Mesh, Scene, TransformNode } from "@babylonjs/core";

export class Character extends TransformNode {
	
	constructor(name: string, scene: Scene) {
		super(name, scene);
	}

}

export class Player extends Character {

}

export class Mob extends Character {
	
}