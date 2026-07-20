# GameBus Lunch Drag-and-Drop

A React and TypeScript lunch-planning game for a university canteen. Students choose buffet dishes, set explicit quantities, or select a global `No lunch today` option.

The original H5P package is a functional reference only. Its fixed layout, visual design, and scoring model are intentionally not reproduced.

## Versions

- `v0-initial-layout`: Git tag preserving the first working React replacement.
- `v1-compact-single-selection`: Git tag preserving the published compact single-selection version.
- `v1-compact-layout`: compact layout branch with the Version 1 two-column interface.
- Current `main`: quantity-based buffet planner using the compact layout direction.

## Version 2 Quantity-Based Buffet Planner

Desktop keeps the compact two-column structure:

- Left column: Today's Menu, grouped by Vegetarian Lunch, Main Lunch, Soup, and Dessert.
- Right column: sticky Your Selection panel with selected dishes, quantities, No lunch today, Reset, and Submit.

Students can select multiple dishes, including multiple dishes in the same category and dishes from both Vegetarian Lunch and Main Lunch. Each selected dish has minus and plus controls. Drag-and-drop remains an optional desktop shortcut; click and tap controls are the primary interaction.

Mobile layout:

- Today's Menu appears first.
- Your Selection appears below the menu.
- Reset and Submit are available in a sticky bottom action bar.
- Dragging is not required.

Quantities are supported. GameBus API integration is not implemented yet.

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

GitHub Pages serves the app from `/gamebus-lunch-dnd/`. Vite uses that base path only for production builds, while local development continues to use `/`.

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
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow.

Current content paths:

- `public/content/menus/current.json`
- `public/content/menus/initial-menu/menu.json`
- `public/content/menus/initial-menu/images/`

## Menu Schema

`current.json` selects the active menu folder:

```json
{
  "activeMenu": "initial-menu"
}
```

`menu.json` contains the menu id, title, optional description, global no-lunch option, categories, and food items. Each item includes its image path and quantity settings:

```json
{
  "id": "veggie-patty",
  "categoryId": "vegetarian-lunch",
  "label": "Vegetable patty",
  "imagePath": "images/file-6a43892e40e10.jpg",
  "altText": "Crispy vegetable patties on paper squares.",
  "order": 1,
  "active": true,
  "itemType": "food",
  "unit": "pieces",
  "minQuantity": 0,
  "maxQuantity": 6,
  "quantityStep": 1,
  "defaultQuantity": 1
}
```

Quantity validation rejects missing units, negative minimum quantities, maximum quantities lower than the minimum, quantity steps of `0` or below, and default quantities outside the configured range.

The global no-lunch option is configured once:

```json
{
  "noLunch": {
    "enabled": true,
    "label": "No lunch today",
    "description": "I will not eat at the canteen."
  }
}
```

## Scoring Rule

The H5P scoring is ignored.

- At least one selected item with a valid quantity: `20` points.
- `No lunch today` selected: `20` points.
- No food and no no-lunch selection: `0` points.
- Invalid quantity configuration or invalid selection: `0` points.
- No partial scoring.
- Maximum score: `20` points.

## Submission Result

A valid submission result is generated and logged to the browser console for future GameBus integration:

```json
{
  "gameVersion": "2.0.0",
  "menuId": "initial-menu",
  "completed": true,
  "score": 20,
  "maxScore": 20,
  "submittedAt": "ISO-8601 timestamp",
  "noLunch": false,
  "selections": [
    {
      "itemId": "veggie-patty",
      "categoryId": "vegetarian-lunch",
      "quantity": 2,
      "unit": "pieces"
    }
  ]
}
```

Participants see a friendly success dialog with the score, selected dishes, quantities, and units. Raw JSON is not shown in the interface.

## GameBus Integration Status

GameBus API integration is not implemented yet. The current app is a front-end-only game that prepares a structured submission object for future integration.

## Updating the Monthly Menu

1. Copy the current menu folder inside `public/content/menus`, for example `initial-menu`.
2. Rename the copied folder, for example `august-2026`.
3. Update the copied `menu.json` id to match the folder name.
4. Replace its images.
5. Update dish names, units, and quantity limits in `menu.json`.
6. Change `activeMenu` in `public/content/menus/current.json`.
7. Test locally with `npm run dev`.
8. Commit and push.

### Image Replacement

`menu.json` contains each item's `imagePath`. Actual images are stored in the active menu's `images` folder.

Method A: keep the same filename

Replace the image file while preserving the exact filename and extension. No JSON edit is required.

Method B: use a new filename

Add the new image to the images folder and update the item's `imagePath` in `menu.json`:

```json
{
  "imagePath": "images/meatballs.jpg"
}
```

Recommended images:

- Landscape orientation.
- Consistent aspect ratio, preferably `4:3`.
- JPG or WebP.
- Compressed files, ideally under about `1 MB` each.
- Descriptive filenames.
- Matching `altText` in `menu.json`.

## Known Limitations

- No GameBus API integration.
- No RAISE SDK integration.
- No authentication.
- No backend service, database storage, or admin upload interface.
- No external analytics.
- Monthly menus are edited as static JSON and image files.
