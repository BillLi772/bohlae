# Home Slideshow Images

Place full-resolution photos here. Images should be landscape-oriented and
high enough resolution to fill the viewport at retina density (recommend
2400px wide minimum). They are displayed with `object-fit: cover`.

| Filename     | Caption shown in slideshow       | Suggested source project |
|--------------|----------------------------------|--------------------------|
| slide-01.jpg | Puerto Rico, 2025                | Pare                     |
| slide-02.jpg | Ponce, Puerto Rico               | Pare                     |
| slide-03.jpg | St. Louis, 2025                  | Regrowth                 |
| slide-04.jpg | Tornado Recovery, St. Louis      | Regrowth                 |
| slide-05.jpg | Along the Railway                | Railway                  |
| slide-06.jpg | National Old Trails Road         | Railway                  |

## How to swap in images

In `index.html`, replace each placeholder `<div>` with an `<img>` tag:

```html
<!-- Before -->
<div class="img-placeholder">images/home/slide-01.jpg</div>

<!-- After -->
<img src="images/home/slide-01.jpg" alt="Puerto Rico, 2025">
```

You can use any number of slides. Add or remove `.slide` blocks and matching
`.dot` buttons in `index.html` to match the count.
