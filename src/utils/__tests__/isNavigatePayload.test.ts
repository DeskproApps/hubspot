import { isNavigatePayload } from "../isNavigatePayload";

describe("utils", () => {
  describe("isNavigatePayload", () => {
    test("should navigate payload", () => {
      expect(isNavigatePayload({ type: "changePage", path: "/home" })).toBeTruthy();
      expect(isNavigatePayload({
        type: "changePage",
        path: { pathname: "/view", search: "?foo=bar" },
      })).toBeTruthy();
    });
  });
});
