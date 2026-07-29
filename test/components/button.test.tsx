import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should apply default variant classes", () => {
    render(<Button>Default</Button>);
    const button = screen.getByText("Default");
    expect(button).toHaveClass("bg-primary");
  });

  it("should apply destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-destructive");
  });

  it("should apply outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText("Outline");
    expect(button).toHaveClass("border");
  });

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText("Ghost");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("should apply size classes", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText("Small");
    expect(button).toHaveClass("h-8");
  });

  it("should render as disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("should apply additional className", () => {
    render(<Button className="extra-class">Styled</Button>);
    expect(screen.getByText("Styled")).toHaveClass("extra-class");
  });
});
