/*
 * Big Fish Apparel — catalogue + Instagram grid data.
 *
 * TODO(brand): product names, prices and colourways below are stand-ins.
 * Swap them for the real line-up from bigfishapparel.ca. To use a real
 * product photo, drop it in /images and set `image` (e.g. "images/coho.jpg");
 * until then an illustrated fleece in the listed colours is shown instead.
 * `fish` picks the print shape: coho | chinook | rockfish | herring.
 * `badge` is optional (e.g. "New", "Best seller").
 */
window.BIGFISH_PRODUCTS = [
  {
    id: "coho-fleece",
    fish: "coho",
    name: "Coho Fish Fleece",
    tagline: "Salmon-red fish on deep sea green",
    price: 98,
    category: "adult",
    colors: { base: "#1f4f4f", fish: "#e8735a" },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "images/product-coho.jpg",
  },
  {
    id: "chinook-fleece",
    fish: "chinook",
    name: "Chinook Fish Fleece",
    tagline: "Golden kings on driftwood cream",
    price: 98,
    category: "adult",
    colors: { base: "#f1e6d2", fish: "#c98a2b" },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "images/product-chinook.jpg",
  },
  {
    id: "rockfish-fleece",
    fish: "rockfish",
    name: "Rockfish Fish Fleece",
    tagline: "Coral rockfish on Salish Sea navy",
    price: 98,
    category: "adult",
    colors: { base: "#15283d", fish: "#e0664d" },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    badge: "New",
    image: "images/product-rockfish.jpg",
  },
  {
    id: "herring-fleece",
    fish: "herring",
    name: "Herring Fish Fleece",
    tagline: "A whole school on kelp green",
    price: 98,
    category: "adult",
    colors: { base: "#3d6b4f", fish: "#dfeee7" },
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    image: "images/product-herring.jpg",
  },
  {
    id: "kids-coho-fleece",
    fish: "coho",
    name: "Little Fish Fleece",
    tagline: "Coho print, sized for small fry",
    price: 68,
    category: "kids",
    colors: { base: "#6aa5b8", fish: "#fbf8f2" },
    sizes: ["2T", "4T", "6", "8", "10", "12"],
    image: "images/product-kids.jpg",
  },
  {
    id: "fish-toque",
    fish: "coho",
    name: "Big Fish Toque",
    tagline: "Warm ears for cold docks",
    price: 34,
    category: "accessories",
    colors: { base: "#e8735a", fish: "#123236" },
    sizes: ["One size"],
    image: "images/product-toque.jpg",
    kind: "toque",
  },
];

/*
 * Instagram grid. Save photos from instagram.com/bigfish.apparel into
 * /images as insta-1.jpg … insta-6.jpg and update the captions/links.
 * Missing photos fall back to illustrated tiles.
 */
window.BIGFISH_INSTAGRAM = [
  { image: "images/insta-1.jpg", alt: "Fish fleece on a misty dock morning", fish: "coho", colors: ["#1f4f4f", "#e8735a"] },
  { image: "images/insta-2.jpg", alt: "Beach fire in a Big Fish fleece", fish: "coho", colors: ["#e8735a", "#123236"] },
  { image: "images/insta-3.jpg", alt: "Close-up of the fish print", fish: "chinook", colors: ["#f1e6d2", "#c98a2b"] },
  { image: "images/insta-4.jpg", alt: "Herring fish fleece by a Saanich Peninsula creek", fish: "herring", colors: ["#3d6b4f", "#dfeee7"] },
  { image: "images/insta-5.jpg", alt: "Kids fleece at the tide pools", fish: "coho", colors: ["#6aa5b8", "#fbf8f2"] },
  { image: "images/insta-6.jpg", alt: "Rockfish fleece on the ferry deck", fish: "rockfish", colors: ["#15283d", "#e0664d"] },
];
window.BIGFISH_INSTAGRAM_URL = "https://www.instagram.com/bigfish.apparel/";
