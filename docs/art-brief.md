# The Develobear mascot

## The bear on the site

`public/img/mascot/bear.svg` is a vector trace of the bear from the Amazon Cognito cover (`bearverless.jpg`), cleaned up by hand. It is used on the home page, About, the 404 page, the footer (head and the top of the shirt) and social cards.

It has one pose, in named layers (`legs`, `arm-left`, `arm-right`, `head`, `shirt` and more). The outlines are uneven on purpose, to look hand-drawn. They are filled shapes, separate from the colour under them, and exist only where they show. Outlines, glasses, nose and trousers are charcoal (`#161616`), not black. The light comes from the top left; shadows are translucent shapes with `class="shadow"`.

Favicons in `public/` are separate files.

## Changing the art

`lib/mascot.ts` is the only place that defines it: file, size, `shirt` (where text goes) and `headHeight` (where the footer cuts the bear). The file must stay in `public/img/mascot/`.

For new art: front-facing, full body, feet touching the bottom of the artboard, a plain light shirt front, flat fills, a closed hand-drawn outline in charcoal, and colours as attributes (the social card renderer has no CSS variables).

## Covers for new posts

Pose your SVG with props on one flat background in the post's colour, with the same ink line. Export a 1600 × 900 PNG or JPG (keep covers as bitmaps, since search engines and feed readers handle them better) to `public/img/<post-name>/`. Then set `image` and `color` in the post's front matter. No code changes.
