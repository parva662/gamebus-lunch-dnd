# H5P Analysis: Plate Builder

Source file: `reference/original-lunch-game.h5p`

Extraction folder: `reference/h5p-extracted`

## Referenced H5P Package

- `h5p.json` title: `Plate Builder`
- Language: `en`
- Main library: `H5P.DragQuestion`
- Dependency: `H5P.DragQuestion 1.14`
- Content file: `content/content.json`
- Canvas size: `1332 x 1800`
- Background asset: `content/images/background-6a4387c9864fe.png`

The `.h5p` is used as a functional reference only. The replacement app should preserve the intended task and interaction rules, but should not reproduce the original visual design, layout, styling, or scoring model.

## Intended Task

The activity asks the learner to build a lunch menu by placing one option into each lunch category. The background image says:

- `Build your lunch menu`
- `Drag one item to each category to plan your perfect lunch.`

The H5P interaction is a drag question with category-specific drop zones. Each category accepts three possible items: two food choices and one explicit "No ..." choice.

## Menu Categories

All categories are treated as required in the source H5P because every drop zone is single-choice and there is no optional-zone metadata.

| Category | H5P drop zone label | Required | Accepted H5P element indexes |
| --- | --- | --- | --- |
| Vegetarian Lunch | `Vegeterian lunch menu name` | Yes | `5`, `6`, `13` |
| Main Lunch | `Main lunch menu name` | Yes | `4`, `7`, `12` |
| Soup | `The soup names` | Yes | `8`, `3`, `14` |
| Dessert | `Dessert names` | Yes | `10`, `11`, `15` |

The category labels visible to users are baked into the background image as `VegeLunch`, `Lunch`, `Soup`, and `Dessert`. The new app uses clearer labels while preserving the same category structure.

## Draggable Items

The H5P has 16 elements. Four are text elements and twelve are image choices.

### Text Elements

These are positioned in the upper-left content area. They are present in `task.elements`, but they do not match the useful category acceptance rules and are not useful as first-menu image cards in the replacement app.

| Index | Text |
| --- | --- |
| `0` | `A lunch menu for meatlovers` |
| `1` | `The soup of the day full od vitamins` |
| `2` | `A vegeterian lunch full of flavours` |
| `9` | `The dessert, targeting an special place in your stomach` |

### Image Choice Elements

| Index | H5P alt | File | Category |
| --- | --- | --- | --- |
| `5` | `Veglunch1` | `file-6a43892e40e10.jpg` | Vegetarian Lunch |
| `6` | `veglunch2` | `file-6a4389965b69d.jpg` | Vegetarian Lunch |
| `13` | `no vegi lunch for me` | `file-6a4b794507e5e.png` | Vegetarian Lunch |
| `4` | `mainlunch1` | `file-6a4b6907efef6.jpg` | Main Lunch |
| `7` | `mainlunch2` | `file-6a438a5180415.jpg` | Main Lunch |
| `12` | `no lunch` | `file-6a4b79303034c.png` | Main Lunch |
| `3` | `soup` | `file-6a4b79f8c6abf.jpg` | Soup |
| `8` | `soup2` | `file-6a438c143b9cd.jpg` | Soup |
| `14` | `no soup` | `file-6a4b797256c6d.png` | Soup |
| `10` | `desert choco` | `file-6a4b66f2df9bc.jpg` | Dessert |
| `11` | `cheesecake` | `file-6a4b67223a163.jpg` | Dessert |
| `15` | `no dessert` | `file-6a4b79a37ec67.png` | Dessert |

## Coordinates And Dimensions

The original H5P stores positions and sizes as percentages of the `1332 x 1800` stage.

### Drop Zones

| Zone | x% | y% | w% | h% | Approx pixels |
| --- | ---: | ---: | ---: | ---: | --- |
| Vegetarian Lunch | `41.0798` | `55.5874` | `46.5035` | `11.7254` | `547,1001 619x211` |
| Main Lunch | `41.0798` | `66.8786` | `46.5045` | `12.7025` | `547,1204 619x229` |
| Soup | `41.0798` | `78.1698` | `46.5045` | `11.7254` | `547,1407 619x211` |
| Dessert | `41.0798` | `88.5924` | `46.5045` | `12.7025` | `547,1595 619x229` |

The new application does not use these coordinates directly because the H5P layout is obsolete and not responsive.

## Optional And Required Rules

- No category is optional in the H5P data.
- Every category has `single: true`, so each category should accept exactly one selected item.
- A completed valid submission requires one valid selected item per category.
- Each draggable item is category-specific.
- Placing an item into a category outside its accepted rule is invalid.

## No Lunch Behaviour

The H5P treats "No Lunch" style entries as valid category choices:

- `no vegi lunch for me` is valid for Vegetarian Lunch.
- `no lunch` is valid for Main Lunch.
- `no soup` is valid for Soup.
- `no dessert` is valid for Dessert.

These are not skip markers and are not invalid answers. In the replacement app they remain configurable items with `itemType: "noLunch"` and `rules.countsAsNoLunch: true`.

## Submission Rules

Original H5P behavior:

- Check/submit is enabled.
- Retry/reset is enabled.
- Drop-zone highlighting occurs while dragging.
- Auto-align is enabled.
- Fullscreen is disabled.
- Score points are hidden.

Replacement behavior:

- Submit rejects incomplete selections.
- Submit rejects invalid item/category combinations.
- Submit accepts a completed valid selection.
- Submit is guarded against duplicate submission while processing.
- Reset restores the initial empty state.
- A successful result is displayed in a dialog and logged to the browser console.

## Existing Scoring Configuration

The original H5P says:

- `Correct answers give +1 point. Incorrect answers give -1 point. The lowest possible score is 0.`
- `singlePoint: false`
- `applyPenalties: false`
- `showScorePoints: false`
- `enableScoreExplanation: false`

This scoring configuration is intentionally ignored.

The replacement scoring rule is:

- Valid completed submission: `20` points.
- Invalid or incomplete submission: `0` points.
- Maximum score: `20` points.
- No partial scoring.

## Feedback And Instructions

Useful source text:

- Instruction: `Drag one item to each category to plan your perfect lunch.`
- Submit label: `Submit`
- Retry label: `Retry`
- Overall feedback: `Thank for helping to reduce the waste`

The replacement app uses shorter, corrected, user-facing copy while preserving the feedback intent.

## Useful Assets

Useful first-menu assets were copied from:

`reference/h5p-extracted/content/images`

to:

`public/content/menus/initial-menu/images`

The original background image is documented but not used in the redesigned app because it would reproduce the H5P visual design.

## Obsolete H5P Limitations

- Fixed `1332 x 1800` coordinate layout.
- Category labels are baked into a background image.
- Drop zones are positioned visually instead of expressed as responsive UI structure.
- Several visible labels contain spelling or grammar errors.
- Text elements are mixed with choice elements in the drag list.
- Scoring is tied to H5P's per-element answer model rather than the required 20-point completion rule.

## Assumptions

- The twelve image elements are the intended selectable lunch options.
- The four text elements are reference content only and should not be selectable menu choices in the replacement game.
- All four categories are required.
- "No Lunch" choices are valid selections for their own categories.
- A selected item should replace the previous selection in that category.
- The new monthly menu structure should be the source of truth for future menu changes.
