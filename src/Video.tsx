import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Backdrop} from "./components/Backdrop";
import {SceneRenderer} from "./components/StoryTemplates";
import {SCENES} from "./story";
import {COLORS} from "./theme";

/**
 * 75 scenes, each cut on an SRT beat. A scene owns its own backdrop so the
 * palette wash matches the accent of the current beat, and every element
 * inside it enters on the cue for the syllable being spoken.
 */
export const PayYourselfFirst: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.cream}}>
    {SCENES.map((scene) => {
      const tone = (scene.data as {tone?: "light" | "dark"}).tone ?? "light";
      return (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`${scene.id} ${scene.type}`}
        >
          <Backdrop accent={scene.accent} tone={tone} />
          <SceneRenderer scene={scene} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
