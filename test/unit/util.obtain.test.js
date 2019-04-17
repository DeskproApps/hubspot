import { obtain } from '../../src/util';

it('Accesses', () => {
  const o = {a:{b:{c:"ok"}}};
  expect(obtain(o, "a.b.c", (x) => x, () => "nope")).toBe("ok");
});

it('Defaults', () => {
  const o = {a:{b:{c:"ok"}}};
  expect(obtain(o, "a.b.d", (x) => x, () => "nope")).toBe("nope");
});

it('Runs the failure function', () => {
  const o = {a:{b:{c:"ok"}}};
  let side_effect = false;
  expect(obtain(o, "a.b.d", (x) => x, () => side_effect = true)).toBe(true);
  expect(side_effect).toBe(true);
});
