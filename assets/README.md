# Artwork

Original visual identity for the Agentic Next.js Kit. No stock imagery, third-party logos, external fonts, or paid image service is used.

| File | Purpose | Dimensions |
|---|---|---|
| [`mark.svg`](mark.svg) | Square repository mark | 512 × 512 |
| [`cover.svg`](cover.svg) | README hero and social-preview source | 1280 × 640 |
| [`social-preview.png`](social-preview.png) | GitHub social preview | 1280 × 640, under 1 MiB |

## Design notes

- Dark “engineering console” palette with teal verification accents.
- The three stages—**Doctor, Adopt, Verify**—map to the kit’s operation boundaries.
- The document panel represents the project contract and evidence, not a screenshot of a real project.
- SVG text uses system font stacks so the files remain self-contained and portable.
- Both SVGs include `<title>`, `<desc>`, and `role="img"` for accessible rendering.

## Regenerating the social preview

Edit [`cover.svg`](cover.svg), then render it locally at exactly 1280 × 640. For example, with Chromium:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1280,640 \
  --screenshot=assets/social-preview.png \
  "file://$PWD/assets/cover.svg"
```

Inspect the PNG before committing it. `scripts/presentation.test.mjs` checks the PNG signature, exact dimensions, and the 1 MiB GitHub limit; it cannot judge visual quality. Quick Look may force a square thumbnail, so use a real 1280 × 640 browser render.

## License

Copyright (c) 2026 frutit.app. Distributed under the repository’s [MIT License](../LICENSE).
