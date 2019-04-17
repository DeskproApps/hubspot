import { access } from '../../src/util';

it('Accesses', () => {
  const o = {a:{b:{c:"ok"}}};
  expect(access(o, "a.b.c", "nope")).toBe("ok");
  expect(access(o, "a.b.d", "nope")).toBe("nope");
  expect(access(o, "a.a", "nope")).toBe("nope");
  expect(access(o, "d", "nope")).toBe("nope");
  expect(access(o.a.b, "c", "nope")).toBe("ok");
  expect(access("ok", "", "nope")).toBe("ok");
});

it('Defaults', () => {
  const o = {a:{b:{c:"ok"}}};
  expect(access(o, "a.b.d", "nope")).toBe("nope");
  expect(access(o, "a.a", "nope")).toBe("nope");
  expect(access(o, "d", "nope")).toBe("nope");
  expect(access("what", "d", "nope")).toBe("nope");
  expect(access(3, "d", "nope")).toBe("nope");
});
