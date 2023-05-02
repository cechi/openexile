import { Scene, AssetsManager, MeshAssetTask, Mesh, ContainerAssetTask } from "@babylonjs/core";

const MODEL_PATH = '/assets/models/';

export const characterAssets = new Map<string, string>([
	['Avatar01', 'characters/avatar01.glb']
]);

export function loadAssets(scene: Scene) {
	const manager = new AssetsManager(scene);

	for (let [key, value] of characterAssets) {
		manager.addContainerTask(key, "", MODEL_PATH, value);
	}
	
	manager.onTaskSuccess = function (task: ContainerAssetTask) {
		if (task.name == "Avatar01") {
			// const m = task.loadedMeshes[0] as Mesh;
			const c = task.loadedContainer;
			//c.meshes.forEach(m => m.isVisible = false);
			c.addAllToScene();

			for (let i = 1; i <= 2; i++) {
				let entries = c.instantiateModelsToScene(s => {
					return `${s}-${i}`;
				}, false, { doNotInstantiate: true });

				for (var node of entries.rootNodes) {
					node.position.x += 150 * i;
					//node.getChildMeshes().forEach(m => m.isVisible = true);
				}
			}

			let a = scene.getAnimationGroupByName('Idle-1');
			a.start(true, 1.0, a.from, a.to, false);

			a = task.loadedAnimationGroups.find(g => g.name == 'Running');
			a.start(true, 1.0, a.from, a.to, false);
		}
	};

	return manager.loadAsync();
}