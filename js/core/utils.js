export const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const state = { fixed: false };
