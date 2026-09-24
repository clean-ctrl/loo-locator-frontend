# Big Fish Apparel — website

A static, no-build site for Big Fish Apparel (Victoria, BC): cozy fish fleeces, 5% of profits to local stream restoration.

Open `index.html` in a browser, or serve the folder with any static host (Netlify, GitHub Pages, Railway static, etc.):

```bash
npx serve big-fish-apparel
```

## Files

| File | What it is |
|------|------------|
| `index.html` | Page layout and copy |
| `styles.css` | Brand colours, type and layout (tokens at the top of the file) |
| `products.js` | Product catalogue + Instagram grid — edit this to change what's for sale |
| `main.js` | Cart, filters, Instagram grid, newsletter, mobile menu |
| `images/` | Drop real photos here (see below) |

## Adding the real photos

Every photo spot shows an illustrated fleece until a real photo exists at its path. Save images from
[@bigfish.apparel](https://www.instagram.com/bigfish.apparel/) or the product shots from bigfishapparel.ca using these names:

| File | Where it shows |
|------|----------------|
| `images/hero.jpg` | Big hero photo (portrait, ~900×1100) |
| `images/streams.jpg` | 5% for Streams section (landscape) |
| `images/story.jpg` | Our Story circle (square) |
| `images/product-coho.jpg` … `product-toque.jpg` | Product cards (square) — names set in `products.js` |
| `images/insta-1.jpg` … `insta-6.jpg` | Instagram grid (square) |

To link a grid tile to a specific post, add `url: "https://www.instagram.com/p/…"` to that entry in `products.js`.

## Before launch — confirm with the brand

- Product names, prices and colourways in `products.js` are stand-ins; replace with the real line-up.
- The Checkout button links to bigfishapparel.ca; point it at the real cart/checkout.
- The newsletter form only shows a thank-you message; connect it to the mailing-list provider.
