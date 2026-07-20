# GameBus Lunch Drag-and-Drop

A React and TypeScript lunch-selection game for a university canteen. Learners choose exactly one option for each meal category using compact cards, buttons, keyboard-accessible controls, and drag-and-drop where supported.

The original H5P package is a functional reference only. Its fixed layout, visual design, and scoring model are intentionally not reproduced.

## Versions

- `v0-initial-layout`: Git tag preserving the first working React replacement.
- `v1-compact-layout`: compact layout branch with a more spatially efficient interface.

Version 1 keeps the same game rules and content architecture as the initial implementation. Quantity selection is not supported yet.

## Version 1 Compact Layout

Desktop uses a two-column structure:

- Left column, about 65% width: Today's Menu, grouped by Vegetarian Lunch, Main Lunch, Soup, and Dessert.
- Right column, about 35% width: sticky Your Selection panel with progress, four compact category slots, Reset, and Submit.

Mobile layout:

- Today's Menu appears first.
- Your Selection appears below the menu.
- Reset and Submit are available in a sticky bottom action bar.
- Tap/click selection is the primary mobile interaction.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Preview A Production Build

```bash
npm run preview
```

## Project Structure

- `reference/original-lunch-game.h5p`: original H5P reference package.
- `reference/h5p-extracted`: extracted H5P contents.
- `reference/H5P_ANALYSIS.md`: documented H5P behavior and interpretation.
- `public/content/menus/current.json`: active menu pointer.
- `public/content/menus/<menu-id>/menu.json`: monthly menu configuration.
- `public/content/menus/<menu-id>/images`: monthly menu image assets.
- `src/services/menuLoader.ts`: runtime menu loading and validation.
- `src/types/menu.ts`: TypeScript menu and result types.
- `src/game`: validation, scoring, result generation, and state logic.
- `src/components`: reusable React UI components.
- `src/styles/design-tokens.css`: colors, spacing, radius, type, and shadow tokens.

## Scoring Rule

The H5P scoring is ignored.

- Valid completed submission: `20` points.
- Invalid or incomplete submission: `0` points.
- Maximum score: `20` points.
- No partial scoring.

## Submission Result

A valid submission result is generated and logged to the browser console for future GameBus integration:

```json
{
  "gameVersion": "1.0.0",
  "menuId": "initial-menu",
  "completed": true,
  "score": 20,
  "maxScore": 20,
  "submittedAt": "ISO-8601 timestamp",
  "selections": {
    "categoryId": "selectedItemId"
  }
}
```

Participants see a friendly success dialog with the score and selected items, not raw JSON.

## GameBus Integration Status

GameBus API integration is not implemented yet. The current app is a front-end-only game that prepares a structured submission object for future integration.

## Updating the Monthly Menu

1. Copy an existing folder inside `public/content/menus`, for example `initial-menu`.
2. Rename the copied folder to the new menu id, for example `2026-09-menu`.
3. Add the new images to the copied folder's `images` directory.
4. Edit the copied `menu.json`:
   - Change `id` to match the folder name.
   - Update `title` and `description`.
   - Update categories only if the required category structure changes.
   - Update each item `id`, `categoryId`, `label`, `imagePath`, `altText`, `order`, `active`, and item-specific `rules`.
   - Keep No Lunch choices configurable with `"itemType": "noLunch"` and `"rules": { "countsAsNoLunch": true }`.
5. Activate the new menu by editing `public/content/menus/current.json`:

```json
{
  "activeMenu": "2026-09-menu"
}
```

6. Test locally with `npm run dev` and complete one valid submission.
7. Roll back by changing `current.json` to the previous menu id.

Recommended images:

- Format: `.jpg`, `.jpeg`, `.png`, or `.webp`.
- Size: at least `900 x 675` for food photos.
- Aspect ratio: `4:3` works best.
- File size: keep each image under about `1 MB` where possible.
- Always provide meaningful `altText`.

## Known Limitations

- No quantity fields or quantity-based scoring.
- No GameBus API integration.
- No RAISE SDK integration.
- No authentication.
- No backend service, database storage, or admin upload interface.
- No external analytics.
- Monthly menus are edited as static JSON and image files.
