# Adding a scenario
1. Create `js/scenarios/my-bug.js`:
```js
import { register } from '../core/registry.js';
register({ id: 'my-bug', title: '…', titleAr: '…', symptom: '…',
  render(box, { fixed }) { /* build UI in box; branch on `fixed` */ } });
```
2. Add `import './my-bug.js';` to `js/scenarios/index.js`.
3. Mark the bug line with `// BUG:` and make `fixed` show the correct behavior.
