import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";
import {FONT_FAMILY_NAME} from "./theme";

/**
 * Load the bundled Bengali font through Remotion's font API.
 *
 * Why not `@font-face { src: url("/fonts/...") }` in CSS? Webpack treats that
 * absolute URL as a module request during bundling and fails with
 * "Can't resolve '/fonts/NotoSansBengali.ttf'". loadFont() resolves the file
 * through staticFile() at runtime, where public/ is actually served, and it
 * blocks the render until the font is ready.
 */
loadFont({
  family: FONT_FAMILY_NAME,
  url: staticFile("fonts/NotoSansBengali.ttf"),
  format: "truetype",
  weight: "100 900",
  style: "normal",
  display: "block",
}).catch((error) => {
  throw new Error(`Bengali font failed to load: ${String(error)}`);
});
