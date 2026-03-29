# Paintings & Sculptures — Image & Video Files

Place sculpture photos and video here.

| Filename        | Used for                    | Orientation      |
|-----------------|-----------------------------|------------------|
| sculpture-01.jpg| Left column sculpture photo | Portrait (3:4)   |
| sculpture-02.jpg| Right column sculpture photo| Portrait (3:4)   |
| video-01.mp4    | Full-width video below      | Landscape (16:9) |

## How to swap in images

In `paintings.html`, replace each placeholder `<div>` with the real element.

**Sculpture photos:**
```html
<!-- Before -->
<div class="sculpture-placeholder">images/paintings/sculpture-01.jpg</div>

<!-- After -->
<img src="images/paintings/sculpture-01.jpg" alt="Untitled I">
```

**Video** — replace the placeholder div with a `<video>` element:
```html
<!-- Before -->
<div class="video-placeholder">images/paintings/video-01.mp4</div>

<!-- After -->
<video controls preload="metadata">
  <source src="images/paintings/video-01.mp4" type="video/mp4">
</video>
```

The `<video>` tag in `paintings.html` already has `controls` set and no
`autoplay`, matching the spec. Update the caption text below each element
to reflect the actual title, medium, and year.
