# Personal website — vaibhavjnf.github.io (GitHub Pages)

Static site, **no build step**. Files:
- `index.html` — home page: fixed left identity column (name, headline, scroll-spy nav, socials) + scrolling About / Experience / Projects / Security / Contact (structure reverse-engineered from Brittany Chiang's open-source portfolio; original code and content)
- `security.html` — evidence / credits page (Jasminder-model evidence rule + Academic Pages publications-style dated entries; honest empty states, credits added only when a vendor publishes; entry template is in an HTML comment in the file)
- `style.css` — navy/slate theme with seafoam accent, sticky ice-glass column, hover résumé rows, responsive (columns stack ≤1080px, sticky section bars on mobile); v3 adds the Igloo layer: preloader, oversized hero type, marquee, film grain, custom scrollbar, footer watermark
- `script.js` — vanilla JS: preloader counter/curtain, arctic canvas scene (drifting glows + depth snow, mouse parallax), spotlight glow, scroll-spy nav, scroll reveals, custom cursor, magnetic links, thumbnail tilt (no dependencies; everything degrades to the static page under reduced motion / touch / no-JS)
- `DESIGN-PLAN.md` — palette/type/layout tokens, the anti-generic-default review, and the v3 Igloo-layer decisions

## Publish steps (GitHub Pages)
1. Create a **public** repo named exactly **`vaibhavjnf.github.io`** under the `vaibhavjnf` account.
2. Push `index.html`, `security.html`, `style.css` and `script.js` to the repo's default branch (`main`), at the repo root. (This README and DESIGN-PLAN.md can go too; Pages ignores them.)
3. Repo → Settings → Pages: Source = "Deploy from a branch", Branch = `main` / `(root)`. Save.
   For a repo named `<username>.github.io`, Pages usually serves automatically once files are on `main` — check the Pages settings page for the live URL banner.
4. Site goes live at **https://vaibhavjnf.github.io** (first deploy can take a few minutes). `security.html` is at `/security.html`.
5. After it's live: update the links in `../github-profile/README.md` and LinkedIn Featured/contact to point here, and verify both pages on mobile.

## Custom domain (optional, later)
- Buy/point a domain (e.g. vaibhavsharma.in or similar), add a `CNAME` file in the repo root containing the domain, set DNS (A/ALIAS to GitHub Pages + `www` CNAME to `vaibhavjnf.github.io`), then enable "Enforce HTTPS" in Settings → Pages once the certificate issues.
- Not required for launch — ship on `vaibhavjnf.github.io` first.

## Maintenance rule
- `security.html` changes ONLY when a vendor/maintainer publishes a credit: add a dated row + vendor link (and keep a screenshot of the credit line locally — vendor pages get taken down; archive copies, like Jasminder does).
- Never add a finding, target, or detail that is still under coordinated disclosure.

## Publishing route
The GitHub connector is already connected as **vaibhavjnf**; if Vaibhav approves publishing, the main agent can create the repo and push these files through the connector / signed-in browser. Nothing here has been published yet.
