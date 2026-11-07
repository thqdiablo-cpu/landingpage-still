# The Things I Didn't Do — landing page

Static landing page for the series *The Things I Didn't Do* (TTIDD), rebuilt from
[ttiddtv.com](https://www.ttiddtv.com) with smooth, cinematic motion.

## Running locally

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Structure

```
index.html            page markup
css/style.css         styles (design tokens at the top, in :root)
js/main.js            interactions and animation
js/vendor/            GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 (self-hosted)
assets/img/           optimized WebP images
assets/video/         hero-loop.mp4 (muted background), trailer.mp4 (with audio)
```

## Motion

- **Preloader**: the logo is "written" in (clip wipe) while a progress bar fills, then two panels open like a curtain.
- **Hero**: the video zooms out slowly, the title is revealed left to right like handwriting, and the buttons rise in. On scroll the content fades out and the video moves in parallax.
- **Smooth scroll** (Lenis) wired into ScrollTrigger; anchor links glide to their sections.
- **Headings** reveal word by word (masked slide-up).
- **Question block**: the words light up as you scroll (scrubbed).
- **Parallax** backgrounds in every section (illustrations and set photos).
- **Topics**: cards with a hover glow that follows the cursor; the icons float gently.
- **Marquee** that skews with scroll speed.
- **Cast**: cards enter in batches, the photo goes from black and white to colour on hover, with a 3D tilt.
- **Crew**: the department accordion animates its height.
- **Gallery**: horizontal pinned scroll on desktop with parallax inside each photo; native swipe on mobile; lightbox with keyboard navigation.
- **Header** hides on scroll down and reappears on scroll up; a progress bar runs along the top; a film grain overlay sits over the page.
- `prefers-reduced-motion` is respected: animation is turned off and all content is shown immediately. If the scripts fail to load, the content still shows.

## Forms

The contact and newsletter forms send JSON to the URLs in `FORM_ENDPOINTS`
at the top of `js/main.js` (for example a Formspree or Getform endpoint, or
your own API). While those are empty, a submit shows an error message and
nothing is sent.
