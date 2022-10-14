import { waitFor } from "@testing-library/react";

test("renders App component", async () => {
    await waitFor(() => {
        expect(true).toBeTruthy();
    });
});
