import { register } from '../core/registry.js';
import { h, sleep } from '../core/utils.js';

register({
  id: 'no-confirmation', title: 'Submit Request', titleAr: 'تقديم الطلب',
  symptom: 'Click Submit: no confirmation, or it loads forever',
  render(box, { fixed }) {
    box.append(h(`<div><label>Request details</label><input id="d">
      <button id="go">Submit</button><p id="out"></p></div>`));
    const out = box.querySelector('#out'), btn = box.querySelector('#go');
    btn.onclick = async () => {
      out.innerHTML = '<span class="spinner"></span> Loading…';
      if (!fixed) return; // BUG: spinner never resolves
      btn.disabled = true;
      await sleep(1200);
      out.className = 'ok';
      out.textContent = `Request received. Reference #${Math.floor(Math.random() * 1e6)}`;
      btn.disabled = false;
    };
  },
});
