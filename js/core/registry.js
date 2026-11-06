// Scenario registry: add a scenario by calling register() — nothing else to wire up.
const scenarios = [];
export const register = (s) => scenarios.push(s);
export const all = () => scenarios;
export const get = (id) => scenarios.find((s) => s.id === id);
