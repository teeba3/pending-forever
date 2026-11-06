import { register } from '../core/registry.js';
import { h, sleep } from '../core/utils.js';

register({
  id: 'otp-expiry', title: 'Verification Code', titleAr: 'رمز التحقق',
  symptom: 'The code arrives after it already expired',
  render(box, { fixed }) {
    const TTL = 5000; // code valid for 5s (shortened for the demo)
    box.append(h(`<div><button id="send">Send code</button><p id="inbox"></p>
      <label>Enter code</label><input id="code"><button id="check">Verify</button><p id="msg"></p></div>`));
    const q = (s) => box.querySelector(s);
    let code, expiresAt;
    q('#send').onclick = async () => {
      q('#inbox').textContent = 'Sending…';
      expiresAt = Date.now() + TTL;               // timer starts at request time
      await sleep(fixed ? 500 : 6000);             // BUG: delivery slower than the TTL
      code = String(Math.floor(1000 + Math.random() * 9000));
      if (fixed) expiresAt = Date.now() + TTL;     // FIX: timer starts on delivery
      q('#inbox').textContent = `📩 Your code is ${code}`;
    };
    q('#check').onclick = () => {
      const ok = code && q('#code').value === code && Date.now() < expiresAt;
      q('#msg').className = ok ? 'ok' : 'err';
      q('#msg').textContent = ok ? 'Verified.' : 'Invalid or expired code.';
    };
  },
});
