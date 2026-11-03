# jordan huynh — portfolio

A Flash-era style portfolio. Plain HTML, CSS and JavaScript with GSAP for the motion. There's no build step, so any static host can serve it.

```
index.html            page shell
css/style.css         all styles (palette tokens at the top)
js/data.js            ALL your content: edit this one
js/app.js             menu, screens, cards, loader, sounds, radio, recruiter mode
js/vendor/gsap.min.js GSAP 3.12.5, self-hosted
fonts/                M PLUS Rounded 1c, Dela Gothic One, Silkscreen (subset, self-hosted)
images/               headshot + project screenshots
resume/               your resume PDF
```

## Editing

Everything you'd change lives in `js/data.js`:

- **Projects:** copy a block in `projects`. `color` picks the card color and `motif` picks the shapes on it.
- **Real screenshots:** put an image in `images/` and add `image: "images/owner-support.jpg"` to the project. It replaces the generated shapes on the card.
- **Your own music on the radio:** make an `audio/` folder, drop in MP3s, then list them in `radio.tracks`. While `radio.tracks` is empty, the radio plays a synth loop that's generated live in the browser.
- **Katakana:** set `katakana: false` to hide it everywhere.
- **Resume:** replace `resume/Jordan-Huynh-Resume.pdf`, keeping the same file name.

## How visitors use it

- **First visit:** a short loading screen with *Enter with sound* or *Enter without sound*. It only shows once per browser session.
- **Keyboard:** ▲ ▼ switch sections, ◀ ▶ browse items, 1–6 jump to a section, M toggles sound effects.
- **Mouse:** click the big words, the PREV/NEXT buttons, or the numbered tabs.
- **Touch:** the menu becomes a row of tabs at the top. Swipe left or right on a screen to browse.
- **Recruiter mode:** the switch in the top right shows a plain one-page resume.
- **Direct links:** `yoursite.com/#work` opens Work and `#work-3` opens the third project. `#recruiter` opens recruiter mode.

## Preview locally

Run a local server from this folder (fonts don't load over `file://`):

```
python3 -m http.server 8000
```

Then open http://localhost:8000. VS Code's Live Server extension works too.

---

# Hosting with your own domain

**Recommended setup:** code on **GitHub**, hosted on **Vercel**, domain from **Cloudflare Registrar**.

It costs about **$10–11 a year** (only the domain). Hosting is free.

This is the most common setup for front-end developer portfolios. Every `git push` redeploys the site automatically, and each branch gets its own preview link.

## 1. Buy the domain (~$10–11/yr)

1. Make a free account at **dash.cloudflare.com**.
2. Go to **Domain Registration → Register Domains** and search. Ideas: `jordanhuynh.com`, `jordanhuynh.dev`, `jrdnhynh.com`.
3. Buy it. Cloudflare charges what the registry charges with no markup, and renewals cost the same.

`.com` is the safest choice. `.dev` is popular with developers and costs about the same.

## 2. Put the code on GitHub

1. Create a new repo, for example `jrdnhynh/portfolio`.
2. Upload everything in this folder to the root of the repo, either by dragging it onto the GitHub page or with `git push`.

## 3. Deploy on Vercel (free)

1. Sign up at **vercel.com** with your GitHub account. The Hobby plan is free and meant for personal projects like this.
2. Click **Add New → Project** and import `portfolio`.
3. Set Framework Preset to **Other**. Leave the build command empty and the output directory as the root.
4. Click **Deploy**. You'll get a URL like `portfolio-jrdnhynh.vercel.app`.

## 4. Connect your domain

1. In Vercel, open the project and go to **Settings → Domains**. Add `jordanhuynh.com`, and when Vercel offers it, also add `www.jordanhuynh.com` redirecting to it.
2. Vercel shows you the DNS records it needs, usually an **A** record for the root domain and a **CNAME** for `www`.
3. In Cloudflare, go to **your domain → DNS → Records** and add exactly those records. Set **Proxy status to "DNS only"** (grey cloud). If the cloud is orange, it can conflict with Vercel's SSL.
4. Wait a few minutes. Vercel issues the HTTPS certificate automatically.

## 5. Nice extras (all free)

- **Professional email:** Cloudflare **Email Routing** can forward `hello@jordanhuynh.com` to your Gmail. Put that on your resume instead of the Gmail address.
- **Analytics:** turn on **Vercel Web Analytics** in the project to see visits without cookie banners.
- **Old CV link:** your old site can stay at `jrdnhynh.github.io/cv`. You can also replace its `index.html` with a redirect to the new domain.

## Alternatives

- **Cloudflare (all-in-one):** host on Cloudflare too, so the domain and site live in one dashboard. It's also free and very fast.
- **GitHub Pages:** works with a custom domain too. You already know it, but it has no preview deployments or analytics.

All three are free for a static site like this, so the only thing you pay for is the domain.

## Credits

Fonts are under the SIL Open Font License (see `fonts/`). GSAP is free under its standard license.
