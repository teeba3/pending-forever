import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

register({
  id: 'fake-active', title: 'Create Account', titleAr: 'إنشاء حساب',
  symptom: 'Account marked Active before email verification',
  render(box, { fixed }) {
    box.append(h(`<div><label>Email</label><input id="em" type="email">
      <button id="go">Register</button><p id="msg"></p>
      <p>Account status: <b id="status">—</b></p>
      <button id="verify" class="secondary" hidden>I clicked the email link</button></div>`));
    const q = (s) => box.querySelector(s);
    q('#go').onclick = () => {
      q('#msg').textContent = 'Verification email sent.';
      q('#status').textContent = fixed ? 'Pending verification' : 'Active ✅'; // BUG: active immediately
      q('#verify').hidden = false;
    };
    q('#verify').onclick = () => { q('#status').textContent = 'Active ✅'; };
  },
});
