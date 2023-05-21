function volumeMutedSvg() {
  return new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 -10 28 40">\n  <path fill="#fff" transform="scale(0.0220625 0.0220625)" d="M358.4 358.4h-204.8v307.2h204.8l256 256v-819.2l-256 256z"></path>\n  <path fill="#fff" transform="scale(0.0220625 0.0220625)" d="M920.4 439.808l-108.544-109.056-72.704 72.704 109.568 108.544-109.056 108.544 72.704 72.704 108.032-109.568 108.544 109.056 72.704-72.704-109.568-108.032 109.056-108.544-72.704-72.704-108.032 109.568z"></path>\n</svg>\n', "image/svg+xml").firstChild;
}
export { volumeMutedSvg as default };
