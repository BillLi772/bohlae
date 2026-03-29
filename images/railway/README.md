# Along the Railway — Image Files

Place photos from the railway project here.

| Filename       | Caption / title label  |
|----------------|------------------------|
| railway-01.jpg | Track at dusk          |
| railway-02.jpg | Steel plant            |
| railway-03.jpg | Crossing signal        |
| railway-04.jpg | Greenway path          |
| railway-05.jpg | Local resident         |
| railway-06.jpg | Rusted rail            |
| railway-07.jpg | Freight car            |
| railway-08.jpg | Open field             |

## How to swap in images

In `projects/railway.html`, replace each placeholder `<div>` with an `<img>`
tag in both the Thumbnails view and the Gallery view.

**Thumbnails** (inside `.thumb-item`):
```html
<!-- Before -->
<div class="thumb-placeholder">railway-01.jpg</div>

<!-- After -->
<img src="../images/railway/railway-01.jpg" alt="Track at dusk">
```

**Gallery** (inside `.gallery-item`):
```html
<!-- Before -->
<div class="gallery-placeholder">railway-01.jpg</div>

<!-- After -->
<img src="../images/railway/railway-01.jpg" alt="Track at dusk">
```

## Adding or removing images

- Add a new `.thumb-item` in `#view-thumbs` and a matching `.gallery-item`
  with the same `id` in `#view-gallery`.
- The `data-gallery` attribute on `.thumb-item` must match the `id` of the
  corresponding `.gallery-item`.
