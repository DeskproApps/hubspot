import { isUnlinkPayload } from "../isUnlinkPayload";
import type { UnlinkPayload } from "../../types";

const payload: UnlinkPayload = {
  type: "unlink",
  contactId: "101",
};

describe("isUnlinkPayload", () => {
  test("shouldn't be unlink payload", () => {
    expect(isUnlinkPayload({ type: "unlink" } as UnlinkPayload)).toBeFalsy();
  });

  test("should unlink payload", () => {
    expect(isUnlinkPayload(payload)).toBeTruthy();
  });
});
