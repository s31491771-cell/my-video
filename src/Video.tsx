import React from "react";
import {FullVideo} from "./full/scenes";

/**
 * The full 8:52 film. `PayYourselfFirst` is kept as the programmatic entry
 * point used by the README and older scripts; the actual UI lives in
 * `src/full/scenes.tsx`, which renders all 75 scenes and the master audio mix.
 */
export const PayYourselfFirst: React.FC = () => <FullVideo />;
export {FullVideo};
