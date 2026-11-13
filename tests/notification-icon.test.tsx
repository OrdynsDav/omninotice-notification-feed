import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import NotificationIcon from "../src/components/atoms/NotificationIcon/NotificationIcon";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NotificationIcon", () => {
  it("sanitizes an SVG provided through picture.icon", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "image/svg+xml" },
      text: async () =>
        '<svg viewBox="0 0 10 10" onload="alert(1)"><script>alert(1)</script><path d="M0 0"/></svg>',
    });
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(
      <NotificationIcon picture={{ icon: "/icon.svg" }} />,
    );

    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    expect(container.querySelector("script")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).not.toHaveAttribute("onload");
    expect(fetchMock).toHaveBeenCalledWith("/icon.svg");
  });

  it("does not fetch an SVG provided through picture.image", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(
      <NotificationIcon picture={{ image: "/image.svg" }} />,
    );

    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/image.svg",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
