import { all, get } from './core/registry.js';
import { h, state } from './core/utils.js';
import './scenarios/index.js';

const app = document.getElementById('app');
const toggle = document.getElementById('fixed-toggle');
state.fixed = localStorage.getItem('pf-fixed') === '1';
toggle.checked = state.fixed;
toggle.onchange = () => { state.fixed = toggle.checked; localStorage.setItem('pf-fixed', +state.fixed); route(); };

function home() {
  app.replaceChildren(h(`<div><h1>Pending Forever</h1><p>Pick a scenario and try to finish the task. Good luck.</p></div>`));
  const grid = h('<div class="grid"></div>');
  all().forEach((s) => grid.append(h(`<a class="card" href="#/s/${s.id}" style="text-decoration:none;color:inherit">
    <h3>${s.title} <small>${s.titleAr || ''}</small></h3><span class="tag">${s.symptom}</span></a>`)));
  app.firstElementChild.append(grid);
}

function route() {
  const m = location.hash.match(/^#\/s\/([\w-]+)/);
  const s = m && get(m[1]);
  if (!s) return home();
  app.replaceChildren(h(`<div><p><a href="#/">← All scenarios</a></p><h1>${s.title}</h1>
    <div class="hint">Symptom: ${s.symptom}${state.fixed ? ' — <b>fixed version</b>' : ''}</div></div>`));
  const box = h('<div class="card"></div>');
  app.firstElementChild.append(box);
  s.render(box, state);
}
addEventListener('hashchange', route);
route();
