import React from "react";
import {Composition} from "remotion";
import {FullVideo, PayYourselfFirst} from "./Video";
import {DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH} from "./timing";
import {Sample60} from "./sample/scenes";
import {SAMPLE_FRAMES} from "./sample/plan";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Full 8:52 film: 75 scenes, 195 SRT cues, 165 SFX cues. */}
    <Composition
      id="FullVideo"
      component={FullVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Backwards-compatible id used by older docs/scripts. */}
    <Composition
      id="PayYourselfFirst"
      component={PayYourselfFirst}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Approved 59.3 s bright-editorial sample, kept for comparison. */}
    <Composition
      id="Sample60"
      component={Sample60}
      durationInFrames={SAMPLE_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  </>
);
