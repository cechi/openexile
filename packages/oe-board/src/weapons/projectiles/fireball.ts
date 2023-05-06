import { Color4, NoiseProceduralTexture, ParticleSystem, Scene, Texture, Vector3 } from "@babylonjs/core";
import { BaseProjectile, ParticleProjectile } from "./baseProjectile";

export class FireballProjectile extends ParticleProjectile {

	constructor(scene: Scene) {
		super(scene, 200);
		
		this._particleSystem.particleTexture = new Texture("/assets/textures/flare_red.png", scene);
		this._particleSystem.emitter = this._mesh;
		this._particleSystem.minEmitBox = new Vector3(0, 0, 0);
		this._particleSystem.maxEmitBox = new Vector3(0, 0, 0);
		this._particleSystem.color1 = new Color4(0, 0.75, 1);
		this._particleSystem.color2 = new Color4(0.8, 0.28, 0.2);
		this._particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);
		this._particleSystem.minLifeTime = 0.3;
		this._particleSystem.maxLifeTime = 1.5;
		this._particleSystem.emitRate = 1500;
		this._particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
		this._particleSystem.gravity = new Vector3(0, -10, 0);
		this._particleSystem.direction1 = new Vector3(-1, 4, 1);
		this._particleSystem.direction2 = new Vector3(1, 4, -1);
		this._particleSystem.minAngularSpeed = 0;
		this._particleSystem.maxAngularSpeed = Math.PI;
		this._particleSystem.minEmitPower = 0;
		this._particleSystem.maxEmitPower = 0;
		this._particleSystem.updateSpeed = 0.005;
	
		const noiseTexture = new NoiseProceduralTexture("perlin", 256, scene);
		noiseTexture.animationSpeedFactor = 5;
		noiseTexture.persistence = 2;
		noiseTexture.brightness = 0.5;
		noiseTexture.octaves = 2;
	
		this._particleSystem.noiseTexture = noiseTexture;
		this._particleSystem.noiseStrength = new Vector3(100, 100, 100);
		this._particleSystem.start();
	}

}