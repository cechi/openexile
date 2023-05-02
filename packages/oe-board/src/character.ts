import { Mesh, Scene, TransformNode, AnimationGroup } from "@babylonjs/core";
import { AssetProps } from "./types";

export type CharacterAnimation = 'running'|'idle';

export class Character extends TransformNode {

	private _mesh: Mesh; //outer collisionbox of player
	get mesh() { return this._mesh }

	private animationGroups = new Map<CharacterAnimation, AnimationGroup>();
	
	constructor(name: string, assetProps: AssetProps) {
		super(name, assetProps.container.scene);

		let entries = assetProps.container.instantiateModelsToScene(s => {
			return `${s}`;
		}, false, { doNotInstantiate: true });

		entries.animationGroups.forEach(g => this.animationGroups.set((g.name.toLowerCase()) as CharacterAnimation, g));
		console.log(this.animationGroups);
		
		this._mesh = assetProps.container.createRootMesh();	
        this._mesh.parent = this;
	}

	startAnimation(name: CharacterAnimation) {
		const a = this.animationGroups.get(name);
		a.start(true, 1.0, a.from, a.to, false);
	}

	startRunningAnimation = () => this.startAnimation("running");
	startIdleAnimation = () => this.startAnimation("idle");

	goto(x: number, z: number) {
		this.startRunningAnimation();
	}
	

}

export class Player extends Character {

}

export class Mob extends Character {
	
}