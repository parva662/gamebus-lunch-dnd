# GameBus Lunch Drag-and-Drop

A modern React and TypeScript lunch-selection game for a university canteen. Learners choose one option for each meal category using drag-and-drop, click/tap buttons, or keyboard-accessible controls.

The original H5P file is a functional reference only. Its visual layout and scoring model are intentionally replaced.

## Setup

```bash
npm install
```

Dependencies are already recorded in `package.json` and `package-lock.json`.

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
- `public/content/menus/initial-menu/menu.json`: first menu configuration.
- `public/content/menus/initial-menu/images`: menu image assets.
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

## Submission Result Format

A valid submission result contains:

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

For now, the result is shown in a success dialog and logged to the browser console. It is not sent to an external system.

## GameBus Integration Status

GameBus API integration is not implemented yet. The current app is a local, front-end-only game that prepares a clean submission result for a future integration.

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

- No GameBus API integration.
- No RAISE SDK integration.
- No authentication.
- No backend service, database storage, or admin upload interface.
- No external analytics.
- Monthly menus are edited as static JSON and image files.
- The app validates image loading in the browser at runtime, not at compile time.
