import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

register({
  id: 'back-logout', title: 'Multi-step Application', titleAr: 'تقديم طلب',
  symptom: 'Clicking Back logs you out and erases progress',
  render(box, { fixed }) {
    let step = 1, data = '', loggedIn = true;
    const draw = () => {
      if (!loggedIn) { box.replaceChildren(h('<p class="err">Session expired. Please log in again. (Progress lost.)</p>')); return; }
      box.replaceChildren(h(`<div><p>Step ${step} of 3 — user: <b>citizen01</b></p>
        <input id="v" placeholder="Step ${step} data" value="${step === 1 ? data : ''}">
        <button id="next">${step < 3 ? 'Next' : 'Finish'}</button></div>`));
      box.querySelector('#next').onclick = () => {
        data = box.querySelector('#v').value;
        if (step < 3) { step++; history.pushState({ step }, ''); draw(); }
        else box.replaceChildren(h('<p class="ok">Application submitted.</p>'));
      };
    };
    const onPop = (e) => {
      if (!document.body.contains(box)) return removeEventListener('popstate', onPop);
      if (fixed) { step = e.state?.step || 1; draw(); }
      else { loggedIn = false; data = ''; draw(); }      // BUG: back = logout + wipe
    };
    addEventListener('popstate', onPop);
    history.replaceState({ step: 1 }, '');
    draw();
    box.append(h('<p class="hint">Go to step 2 or 3, then press the browser Back button.</p>'));
  },
});
