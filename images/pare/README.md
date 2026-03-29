# Pare — Image Files

Place photos from the Puerto Rico project here.

| Filename    | Caption / title label            |
|-------------|----------------------------------|
| pare-01.jpg | Abandoned storefront, Ponce      |
| pare-02.jpg | Crumbling facade                 |
| pare-03.jpg | Empty road                       |
| pare-04.jpg | Derelict building                |
| pare-05.jpg | Town square                      |
| pare-06.jpg | Ruined interior                  |
| pare-07.jpg | Overgrown lot                    |
| pare-08.jpg | Street corner                    |

## How to swap in images

In `projects/pare.html`, replace each placeholder `<div>` with an `<img>` tag.
Do this in **both** the Thumbnails view and the Gallery view.

**Thumbnails** (inside `.thumb-item`):
```html
<!-- Before -->
<div class="thumb-placeholder">pare-01.jpg</div>

<!-- After -->
<img src="../images/pare/pare-01.jpg" alt="Abandoned storefront, Ponce">
```

**Gallery** (inside `.gallery-item`):
```html
<!-- Before -->
<div class="gallery-placeholder">pare-01.jpg</div>

<!-- After -->
<img src="../images/pare/pare-01.jpg" alt="Abandoned storefront, Ponce">
```

## Adding or removing images

- Add a new `.thumb-item` block in `#view-thumbs` and a matching `.gallery-item`
  block with the same `id` in `#view-gallery`.
- The `data-gallery` attribute on `.thumb-item` must match the `id` on the
  corresponding `.gallery-item` so clicking a thumbnail scrolls to the right
  gallery image.
- Update captions and labels to match your actual filenames.
