# Third-party software and assets

The project's MIT license applies to its original code and documentation, not
to third-party dependencies or archive media. Keep upstream copyright and license
notices when redistributing dependencies, including in deployed bundles.

## JavaScript dependencies

`package.json` lists direct dependencies, and `package-lock.json` records the
resolved dependency tree and upstream license metadata. The authoritative terms
are the license and notice files distributed with each package. Install the
locked tree with `npm ci` to inspect those files under `node_modules/`.

In particular:

- Inter (`@fontsource/inter`) and Newsreader (`@fontsource/newsreader`) are
  distributed under the SIL Open Font License 1.1. Their license and copyright
  notices are included in the installed font packages. Preserve them when
  redistributing font files. Sources: [Inter](https://github.com/rsms/inter) and
  [Newsreader](https://github.com/productiontype/Newsreader).
- `@resvg/resvg-js`, its platform packages, and `satori` use the Mozilla Public
  License 2.0.
  Follow the upstream source-availability and notice requirements when
  redistributing these components or modifications to them. Sources:
  [resvg-js](https://github.com/yisibl/resvg-js) and
  [Satori](https://github.com/vercel/satori); the package versions used here are
  recorded in `package-lock.json`.
- Other packages retain their respective MIT, Apache-2.0, BSD, ISC, or other
  upstream terms. The root license does not replace those terms.

The Netlify social-preview function includes the Inter, Newsreader, resvg-js,
and Satori license files together with this notice in its deployment bundle.

## Collection tools

The optional Python collection tools are installed separately through
`requirements.txt`. `youtube-transcript-api` and `yt-dlp` retain their upstream
licenses and notices; they are not vendored in this repository.

## Archive media

For the separate treatment of transcripts, descriptions, recordings, artwork,
and branding, see [CONTENT_LICENSE.md](CONTENT_LICENSE.md).
