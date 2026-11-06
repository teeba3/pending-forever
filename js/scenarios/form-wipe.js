import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

register({
  id: 'form-wipe', title: 'Citizen Registration Form', titleAr: 'استمارة تسجيل',
  symptom: 'One wrong field forces you to refill the whole form',
  render(box, { fixed }) {
    const tpl = () => h(`<form novalidate>
      <label>Full name</label><input name="name">
      <label>National ID (12 digits)</label><input name="nid">
      <label>Phone</label><input name="phone">
      <label>Address</label><input name="addr">
      <p class="err" id="err"></p><button>Submit</button></form>`);
    const mount = () => {
      const f = tpl(); box.replaceChildren(f);
      f.onsubmit = (e) => {
        e.preventDefault();
        const v = Object.fromEntries(new FormData(f));
        if (!/^\d{12}$/.test(v.nid)) {
          if (fixed) { f.querySelector('#err').textContent = 'National ID must be 12 digits.'; return; }
          alert('Error: invalid data.'); mount(); return; // BUG: blank form, vague error
        }
        box.replaceChildren(h('<p class="ok">Registered.</p>'));
      };
    };
    mount();
  },
});
