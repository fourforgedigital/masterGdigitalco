# Master G Digital Co. - Website (dark, clean, premium)

## Folder structure
```
index.html        page structure (every section is labelled with a comment)
css/style.css     all styling, split into numbered headings (search a heading to jump to it)
js/main.js        all behaviour, split into numbered sections
images/           logo.png, founder.jpg, work/ (client posters)
```
To host: upload this whole folder (keep the structure). Open `index.html` to start.

## Common edits
| What | Where |
|---|---|
| Colors / fonts | `css/style.css` -> "1. DESIGN TOKENS" at the top. Fonts: Sora (headings) + Inter (text), loaded in `index.html` |
| Add a work photo or group | add the image to `images/work/`, then add it in the `PJ` list in `js/main.js` (section 2) |
| Client cards / reviews | `R` list in `js/main.js` (section 2). Add a rating (1-5) and quote only when a real client gives them |
| Theme (dark / light) | Dark is the default. Visitors can switch with the sun/moon button; their choice is remembered. Light colors: `css/style.css` -> `:root[data-theme="light"]` |
| Founder photo | replace `images/founder.jpg` (keep the same name; portrait photo works best) |
| WhatsApp number | `WHATSAPP` at the top of `js/main.js`, plus the links in `index.html` (contact, floating button) |
| Email / phone text | `index.html` (contact section, structured data in the head) |
| Social links | `index.html` (founder, contact, footer, structured data) |
| Counters (1500+, 98%, 11+) | `index.html` -> STATS section (`data-n` = number, `data-s` = suffix). Speed: `duration` in `js/main.js` (section 5) |
| SEO title / description | top of `index.html` |

## After hosting
- Add the two lines shown in the SEO comment in `index.html` (og:image and canonical) with your real domain.
- Photos are compressed (about 950 px wide) to keep the site fast.
