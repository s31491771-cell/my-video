import React from "react";
import {Audio, Composition, Sequence, staticFile} from "remotion";
import {PayYourselfFirst} from "./Video";
import {DURATION_IN_FRAMES, FPS, HEIGHT, SFX_CUES, WIDTH} from "./timing";

/**
 * Master mix:
 *  - original voiceover, untouched (primary track, never re-timed or re-levelled)
 *  - planned SFX as separate <Audio> elements at their exact frames
 */
const MasterMix: React.FC = () => (
  <>
    <PayYourselfFirst />
    <Audio src={staticFile("audio/voiceover.wav")} />
    {SFX_CUES.map((cue, index) => {
      const from = Math.round(cue.atSeconds * FPS);
      return (
        <Sequence
          key={`sfx-${cue.sound}-${index}`}
          from={from}
          durationInFrames={Math.max(1, DURATION_IN_FRAMES - from)}
          name={`SFX ${cue.sound} @ ${cue.atSeconds}s`}
        >
          <Audio src={staticFile(`audio/sfx/${cue.sound}.wav`)} volume={cue.gain} />
        </Sequence>
      );
    })}
  </>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PayYourselfFirst"
    component={MasterMix}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
