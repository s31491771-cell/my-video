import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Backdrop} from "./components/Backdrop";
import {SCENES} from "./timing";
import {Scene01Friends} from "./scenes/Scene01Friends";
import {Scene02TenYears} from "./scenes/Scene02TenYears";
import {Scene03Habit} from "./scenes/Scene03Habit";
import {Scene04PayFirst} from "./scenes/Scene04PayFirst";
import {Scene05SpendRest} from "./scenes/Scene05SpendRest";
import {Scene06Math} from "./scenes/Scene06Math";
import {Scene07Compounding} from "./scenes/Scene07Compounding";
import {Scene08AutoTransfer} from "./scenes/Scene08AutoTransfer";
import {Scene09TenYears} from "./scenes/Scene09TenYears";
import {Scene10Outro} from "./scenes/Scene10Outro";

const SCENE_COMPONENTS: React.FC[] = [
  Scene01Friends,
  Scene02TenYears,
  Scene03Habit,
  Scene04PayFirst,
  Scene05SpendRest,
  Scene06Math,
  Scene07Compounding,
  Scene08AutoTransfer,
  Scene09TenYears,
  Scene10Outro,
];

export const PayYourselfFirst: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#F7F4EC"}}>
      <Backdrop accent="#398CE5" />
      {SCENES.map((scene, index) => {
        const Component = SCENE_COMPONENTS[index];
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={`${scene.id} ${Component.displayName ?? ""}`}
          >
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
