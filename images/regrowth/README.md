# Regrowth — Image Files

Place photos from the St. Louis tornado recovery project here.

| Filename        | Caption / title label  |
|-----------------|------------------------|
| regrowth-01.jpg | Kemper Art Museum      |
| regrowth-02.jpg | Fallen tree            |
| regrowth-03.jpg | Community cleanup      |
| regrowth-04.jpg | New growth             |
| regrowth-05.jpg | Cleared street         |
| regrowth-06.jpg | Damaged house          |
| regrowth-07.jpg | Sprouting branch       |
| regrowth-08.jpg | Volunteer crew         |

## How to swap in images

In `projects/regrowth.html`, replace each placeholder `<div>` with an `<img>`
tag in both the Thumbnails view and the Gallery view.

**Thumbnails** (inside `.thumb-item`):
```html
<!-- Before -->
<div class="thumb-placeholder">regrowth-01.jpg</div>

<!-- After -->
<img src="../images/regrowth/regrowth-01.jpg" alt="Kemper Art Museum">
```

**Gallery** (inside `.gallery-item`):
```html
<!-- Before -->
<div class="gallery-placeholder">regrowth-01.jpg</div>

<!-- After -->
<img src="../images/regrowth/regrowth-01.jpg" alt="Kemper Art Museum">
```

## Adding or removing images

- Add a new `.thumb-item` in `#view-thumbs` and a matching `.gallery-item`
  with the same `id` in `#view-gallery`.
- The `data-gallery` attribute on `.thumb-item` must match the `id` of the
  corresponding `.gallery-item`.
