// https://creazilla.com/nodes/1403679-rpg-characters-3d-model
// https://free-game-assets.itch.io/free-medieval-3d-people-low-poly-pack

import { Scene, AssetsManager, ContainerAssetTask, AssetContainer, AnimationGroup, MeshAssetTask, MeshBuilder, Mesh } from "@babylonjs/core";
import { AssetMap } from "./types";

const MODEL_PATH = '/assets/models/';

export const characterAssets = new Map<string, string>([
	['Avatar01', 'characters/avatar01.glb']
]);

export async function loadAssets(scene: Scene) {
	const manager = new AssetsManager(scene);

	for (let [key, value] of characterAssets) {
		manager.addMeshTask(key, "", MODEL_PATH, value);
	}

	const assets: AssetMap = new Map();
	
	manager.onTaskSuccess = function (task: MeshAssetTask) {
		const animationGroups = new Map<string, AnimationGroup>();
		const body = task.loadedMeshes[0] as Mesh;
		body.getChildMeshes().forEach(m => m.isPickable = false);
		task.loadedMeshes.forEach(m => m.isVisible = false);
		
		task.loadedAnimationGroups.forEach(g => animationGroups.set(g.name, g));
		assets.set(task.name, {mesh: body, animationGroups: animationGroups});

		// if (task.name == "Avatar01") {
		// 	// const m = task.loadedMeshes[0] as Mesh;
			//c.meshes.forEach(m => m.isVisible = false);
		//c.addAllToScene();
			
		// 	// for (let i = 1; i <= 2; i++) {
		// 	// 	let entries = c.instantiateModelsToScene(s => {
		// 	// 		return `${s}-${i}`;
		// 	// 	}, false, { doNotInstantiate: true });

		// 	// 	for (var node of entries.rootNodes) {
		// 	// 		node.position.x += 150 * i;
		// 	// 		//node.getChildMeshes().forEach(m => m.isVisible = true);
		// 	// 	}
		// 	// }

		// 	// let a = scene.getAnimationGroupByName('Idle-1');
		// 	// a.start(true, 1.0, a.from, a.to, false);

		// 	// a = task.loadedAnimationGroups.find(g => g.name == 'Running');
		// 	// a.start(true, 1.0, a.from, a.to, false);
		// }
	};

	await manager.loadAsync();
	return assets;
}