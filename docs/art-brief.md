# The Develobear mascot

## The bear on the site

`public/img/mascot/bear.png` is the bear from the Amazon Cognito cover (`bearverless.jpg`). Its background was removed, the AWS logo painted out, and a wobbly ink line added along the edges between its flat colours. Nothing was redrawn. It is used on the home page, About, the 404 page, the footer (head and the top of the shirt) and social cards.

It is a bitmap built from about 500 × 800 source pixels, with one pose and no separate parts.

Favicons in `public/` are separate files.

## Changing the art

`lib/mascot.ts` is the only place that defines it: file, size, `shirt` (where text goes) and `headHeight` (where the footer cuts the bear). The file must stay in `public/img/mascot/`.

For a vector replacement: front-facing, full body, feet touching the bottom of the artboard, a plain light shirt front, flat fills, a closed ink outline, and named groups (`head`, `eyes`, `mouth`, `body`, `shirt`, `arm-left`, `arm-right`, `legs`).

## Covers for new posts

Pose your SVG with props on one flat background in the post's colour, with the same ink line. Export a 1600 × 900 PNG or JPG (keep covers as bitmaps, since search engines and feed readers handle them better) to `public/img/<post-name>/`. Then set `image` and `color` in the post's front matter. No code changes.
