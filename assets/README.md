# Assets

Drop your files in here with these exact names and the placeholders on the
site will pick them up automatically — no code changes needed.

| File | Used on | Suggested size |
|---|---|---|
| `profile.jpg` | Homepage hero | ~800×1000px (portrait) |
| `profile-small.jpg` | Contact section (circular) | ~400×400px (square) |
| `unitree-g1.gif` | Unitree G1 project page | 16:9, keep under ~5MB |
| `nav-sandbox.gif` | Nav sandbox project page | 16:9, keep under ~5MB |
| `cartpole-reinforce.gif` | Cartpole project page | 16:9, keep under ~5MB |
| `marjanator.gif` | Marjanator project page | 16:9, keep under ~5MB |

Until a file is added, that spot on the page shows a dashed placeholder
with its expected filename — nothing breaks, it just looks empty.

Tip: GitHub has a 100MB per-file limit, but for page-load speed keep GIFs
well under 5MB each — a short 3-5 second loop of the sim/robot in action
is usually enough. If a GIF is heavy, converting it to a looping muted MP4
and swapping the `<img>` for a `<video autoplay loop muted playsinline>`
tag will load much faster.
