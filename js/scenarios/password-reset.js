import { register } from '../core/registry.js';
import { h } from '../core/utils.js';

register({
  id: 'password-reset', title: 'Reset Password', titleAr: 'إعادة تعيين كلمة المرور',
  symptom: 'New password doesn\'t work, but the old one does',
  render(box, { fixed }) {
    let saved = 'oldpass123';
    box.append(h(`<form>
      <label>New password</label><input id="np" type="password">
      <button>Save new password</button>
      <hr><label>Log in with password</label><input id="lp" type="password">
      <button type="button" id="login" class="secondary">Log in</button>
      <p id="msg"></p></form>`));
    const q = (s) => box.querySelector(s), msg = q('#msg');
    q('form').onsubmit = (e) => {
      e.preventDefault();
      // BUG: success shown, but the old password is never replaced.
      if (fixed) saved = q('#np').value;
      msg.className = 'ok'; msg.textContent = 'Password changed successfully.';
    };
    q('#login').onclick = () => {
      const ok = q('#lp').value === saved;
      msg.className = ok ? 'ok' : 'err'; msg.textContent = ok ? 'Logged in.' : 'Wrong password.';
    };
    box.append(h('<p class="hint">Old password is <code>oldpass123</code>.</p>'));
  },
});
