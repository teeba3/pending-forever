import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

register({
  id: 'password-rules', title: 'Choose Password', titleAr: 'اختيار كلمة المرور',
  symptom: 'Password rejected without explaining why',
  render(box, { fixed }) {
    box.append(h(`<form><label>Password</label><input id="p" type="password">
      <button>Set password</button><p id="msg"></p></form>`));
    box.querySelector('form').onsubmit = (e) => {
      e.preventDefault();
      const p = box.querySelector('#p').value, miss = [];
      if (p.length < 10) miss.push('at least 10 characters');
      if (!/[A-Z]/.test(p)) miss.push('an uppercase letter');
      if (!/\d/.test(p)) miss.push('a number');
      if (!/[^\w\s]/.test(p)) miss.push('a symbol');
      const msg = box.querySelector('#msg');
      msg.className = miss.length ? 'err' : 'ok';
      msg.textContent = !miss.length ? 'Password accepted.'
        : fixed ? `Password needs: ${miss.join(', ')}.` : 'Invalid password.'; // BUG: no reason
    };
  },
});
