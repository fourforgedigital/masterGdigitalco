# Master G Digital Co. - Website

## Folder structure
```
index.html        page structure (every section is labelled with a comment)
css/style.css     all styling, split into numbered-style headings (search a heading to jump to it)
js/main.js        all behaviour, split into numbered sections
images/           logo.png, founder.jpg, work/ (client posters)
```
To host: upload this whole folder (keep the structure) to your hosting. Open `index.html` to start.

## Common edits
| What | Where |
|---|---|
| Colors / fonts | `css/style.css` -> "DESIGN TOKENS" at the top |
| Add a work photo or group | add the image to `images/work/`, then add it in the `PJ` list in `js/main.js` (section 7) |
| Client cards / reviews | `R` list in `js/main.js` (section 2). Add a rating (1-5) and quote only when a real client gives them |
| Phone / WhatsApp number | `index.html` (contact section, floating WhatsApp button, structured data) and `js/main.js` (section 12, contact form) |
| Email | `index.html` (contact section, structured data) |
| Social links | `index.html` (founder, contact, footer, structured data) |
| Counters (1500+, 98%, 11+) | `index.html` -> STATS section (`data-n` = number, `data-s` = suffix) |
| SEO title / description | top of `index.html` |

## After hosting
- Add the two lines shown in the SEO comment in `index.html` (og:image and canonical) with your real domain.
- Photos are compressed (about 950 px wide) to keep the site fast.
