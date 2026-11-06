import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

const GOVS = ['Baghdad', 'Basra', 'Nineveh', 'Erbil', 'Najaf', 'Karbala', 'Anbar', 'Diyala'];

register({
  id: 'governorate', title: 'Select Governorate', titleAr: 'اختيار المحافظة',
  symptom: 'You select one governorate, the site selects another',
  render(box, { fixed }) {
    box.append(h(`<div><label>Governorate</label>
      <select id="g"><option value="">-- choose --</option>${GOVS.map((g) => `<option>${g}</option>`).join('')}</select>
      <p id="out"></p></div>`));
    const sel = box.querySelector('#g');
    sel.onchange = () => {
      if (!fixed) sel.selectedIndex = (sel.selectedIndex % GOVS.length) + 1; // BUG: off by one
      box.querySelector('#out').textContent = `Selected: ${sel.value}`;
    };
  },
});
