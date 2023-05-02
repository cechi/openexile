import { AnimationGroup, Mesh } from "@babylonjs/core";

export type AssetProps = {mesh: Mesh, animationGroups: Map<string, AnimationGroup>};
export type AssetMap = Map<string, AssetProps>;