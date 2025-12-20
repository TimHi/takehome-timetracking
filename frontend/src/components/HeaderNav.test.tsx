import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HeaderNav from "./HeaderNav";

describe("HeaderNav", () => {
  it("renders navigation links", () => {
    render(
      <MemoryRouter>
        <HeaderNav />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Home")).toHaveAttribute("href", "/week");
    expect(screen.getByRole("link", { name: "Wochen" })).toHaveAttribute(
      "href",
      "/week"
    );
    expect(screen.getByRole("link", { name: "Tage" })).toHaveAttribute(
      "href",
      "/days"
    );
    expect(
      screen.getByRole("link", { name: "Arbeitstag erfassen" })
    ).toHaveAttribute("href", "/day/new");
  });
});
