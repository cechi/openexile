import { AnimationGroup, AssetContainer } from "@babylonjs/core";

export type AssetProps = {container: AssetContainer, animationGroups: Map<string, AnimationGroup>};
export type AssetMap = Map<string, AssetProps>;