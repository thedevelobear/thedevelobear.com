# The Develobear mascot

## Files

| File | Use |
| --- | --- |
| `assets/thedevelobearlogo.svg` | The original drawing. |
| `public/img/mascot/bear.svg` | The same paths, cropped to the art, with shorter numbers. Home hero, About, 404, footer and social cards. |

Favicons in `public/` are exports of the head and do not update by themselves.

## Style

One ink (`#161616`), flat shapes, wobbly hand-drawn edges. Eyes, teeth and inner ears are holes, so each post or section colour shows through. It therefore needs a light background, or the footer, where the head merges into the ink.

## Changing the art

`lib/mascot.ts` is the only place that defines it: file, size (the viewBox), `belly` (where light text goes) and `headHeight` (where the footer cuts the head).

The drawing is three compound paths with no named parts. Adding props or recolouring works as it is. To pose it (move an arm, change the grin), export it with named groups: `head`, `eyes`, `mouth`, `body`, `arm-left`, `arm-right`, `legs`, each drawn complete behind any overlap.

## Covers for new posts

Pose your SVG with props on one flat background in the post's colour, with the same ink line. Export a 1600 × 900 PNG or JPG (keep covers as bitmaps, since search engines and feed readers handle them better) to `public/img/<post-name>/`. Then set `image` and `color` in the post's front matter. No code changes.
