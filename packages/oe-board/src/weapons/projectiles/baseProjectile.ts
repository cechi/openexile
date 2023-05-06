import { Color3, Color4, Mesh, MeshBuilder, ParticleSystem, Scene, SphereParticleEmitter, StandardMaterial, Texture, TransformNode, Vector3 } from "@babylonjs/core";

export class BaseProjectile extends TransformNode {

	protected _mesh: Mesh;

	constructor(scene: Scene) {
		super('projectile', scene);

		const coreSphere = MeshBuilder.CreateSphere(null, {diameter: 20, segments: 16}, scene);
		this._mesh = coreSphere;
		this._mesh.parent = this;
		this._mesh.isVisible = false;
		/*
		// Create a particle system
		const surfaceParticles = new ParticleSystem("surfaceParticles", 1600, scene);
		const flareParticles = new ParticleSystem("flareParticles", 20, scene);
		const coronaParticles = new ParticleSystem("coronaParticles", 600, scene);
	
		// Texture of each particle
		surfaceParticles.particleTexture = new Texture("/assets/textures/T_SunSurface.png", scene);
		flareParticles.particleTexture = new Texture("/assets/textures/T_SunFlare.png", scene);
		coronaParticles.particleTexture = new Texture("/assets/textures/T_Star.png", scene);
	
		// Create core sphere
		const coreSphere = MeshBuilder.CreateSphere("coreSphere", {diameter: 20, segments: 16}, scene);
		this._mesh = coreSphere;
		this._mesh.parent = this;

		var coreMat = new StandardMaterial("coreMat", scene)
		coreMat.emissiveColor = new Color3(0.3773, 0.0930, 0.0266); 
		coreMat.disableLighting = true;
		// Assign core material to sphere
		coreSphere.material = coreMat;
		
	
		
		// Pre-warm
		surfaceParticles.preWarmStepOffset = 10;
		surfaceParticles.preWarmCycles = 100;

		flareParticles.preWarmStepOffset = 10;
		flareParticles.preWarmCycles = 100;

		coronaParticles.preWarmStepOffset = 10;
		coronaParticles.preWarmCycles = 100;

		// Initial rotation
		surfaceParticles.minInitialRotation = -2 * Math.PI;
		surfaceParticles.maxInitialRotation = 2 * Math.PI;

		flareParticles.minInitialRotation = -2 * Math.PI;
		flareParticles.maxInitialRotation = 2 * Math.PI;

		coronaParticles.minInitialRotation = -2 * Math.PI;
		coronaParticles.maxInitialRotation = 2 * Math.PI;

		var sunEmitter = new SphereParticleEmitter();
		sunEmitter.radius = 1;
		sunEmitter.radiusRange = 0; // emit only from shape surface

		surfaceParticles.emitter = coreSphere; // the starting object, the emitter
		surfaceParticles.particleEmitterType = sunEmitter;

		flareParticles.emitter = coreSphere; // the starting object, the emitter
		flareParticles.particleEmitterType = sunEmitter;

		// coronaParticles.emitter = coreSphere; // the starting object, the emitter
		// coronaParticles.particleEmitterType = sunEmitter;

		surfaceParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
		surfaceParticles.addColorGradient(0.4, new Color4(0.6259, 0.3056, 0.0619, 0.5));
		surfaceParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.5));
		surfaceParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));

		flareParticles.addColorGradient(0, new Color4(1, 0.9612, 0.5141, 0.0));
		flareParticles.addColorGradient(0.25, new Color4(0.9058, 0.7152, 0.3825, 1.0));
		flareParticles.addColorGradient(1.0, new Color4(0.6320, 0.0, 0.0, 0.0));

		// coronaParticles.addColorGradient(0, new Color4(0.8509, 0.4784, 0.1019, 0.0));
		// coronaParticles.addColorGradient(0.5, new Color4(0.6039, 0.2887, 0.0579, 0.12));
		// coronaParticles.addColorGradient(1.0, new Color4(0.3207, 0.0713, 0.0075, 0.0));

		surfaceParticles.minSize = 15; //0.4;
		surfaceParticles.maxSize = 25; //0.7;

		flareParticles.minScaleX = 15;
		flareParticles.minScaleY = 15;
		flareParticles.maxScaleX= 25;
		flareParticles.maxScaleY = 25;

		// coronaParticles.minScaleX = 15;
		// coronaParticles.minScaleY = 15;
		// coronaParticles.maxScaleX = 25;
		// coronaParticles.maxScaleY = 30;

		flareParticles.addSizeGradient(0, 0);
		flareParticles.addSizeGradient(1, 1);

		surfaceParticles.minLifeTime = 8.0;
		surfaceParticles.maxLifeTime = 8.0;

		flareParticles.minLifeTime = 10.0;
		flareParticles.maxLifeTime = 10.0;

		// coronaParticles.minLifeTime = 2.0;
		// coronaParticles.maxLifeTime= 2.0;

		surfaceParticles.emitRate = 200;
		flareParticles.emitRate = 1;
		// coronaParticles.emitRate = 300;

		surfaceParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
		flareParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
		// coronaParticles.blendMode = ParticleSystem.BLENDMODE_ADD;
		
		surfaceParticles.gravity = new Vector3(0, 0, 0);
		flareParticles.gravity = new Vector3(0, 0, 0);
		// coronaParticles.gravity = new Vector3(0, 0, 0);
	
		surfaceParticles.minAngularSpeed = -0.4;
		surfaceParticles.maxAngularSpeed = 0.4;

		flareParticles.minAngularSpeed = 0.0;
		flareParticles.maxAngularSpeed = 0.0;

		// coronaParticles.minAngularSpeed = 0.0;
		// coronaParticles.maxAngularSpeed = 0.0;
		
		surfaceParticles.minEmitPower = 0;
		surfaceParticles.maxEmitPower = 0;
		surfaceParticles.updateSpeed = 0.05;

		flareParticles.minEmitPower = 0.001;
		flareParticles.maxEmitPower = 0.01;

		// coronaParticles.minEmitPower = 0.0;
		// coronaParticles.maxEmitPower = 0.0;

		surfaceParticles.isBillboardBased = false;
		flareParticles.isBillboardBased = true;
		// coronaParticles.isBillboardBased = true;
		
		// coronaParticles.renderingGroupId = 1;
		// flareParticles.renderingGroupId = 2;
		// surfaceParticles.renderingGroupId = 3;
		// coreSphere.renderingGroupId = 3;

		surfaceParticles.start();
		flareParticles.start();
		// coronaParticles.start();
		*/

	}

}

export class ParticleProjectile extends BaseProjectile {

	protected _particleSystem: ParticleSystem;

	constructor(scene: Scene, capacity = 200) {
		super(scene);
		this._particleSystem = new ParticleSystem(null, capacity, scene);
		this._particleSystem.minSize = 5;
		this._particleSystem.maxSize = 20;
	}

}