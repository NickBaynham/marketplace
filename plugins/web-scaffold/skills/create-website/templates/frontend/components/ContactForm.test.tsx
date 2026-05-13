import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits name, email, and message to /contact", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 202 }));
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Ada");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/contact$/);
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there.",
      website: "",
    });
    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
  });

  it("shows an error when the request fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "Ada");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/could not send/i)).toBeInTheDocument();
  });
});
