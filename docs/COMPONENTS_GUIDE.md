# UI Components Guide

This document outlines the structure, usage, and best practices for UI components within the Dawaback frontend application.

## 1. Component Philosophy

Our frontend adopts a component-based architecture using React.js. This approach promotes modularity, reusability, and easier maintenance of the user interface. Components are designed to be:

- **Reusable**: Can be used in multiple parts of the application or even in different projects.
- **Modular**: Each component is responsible for a single piece of UI or functionality.
- **Testable**: Isolated components are easier to test.
- **Maintainable**: Changes in one component should ideally not break others.

## 2. Folder Structure

All UI components are primarily located within the `src/components/` directory, which is further subdivided:

```
src/components/
├── ui/             # Components from shadcn/ui (e.g., button, input, card, dialog).
│   └── ...         # Low-level, highly reusable UI primitives.
├── Footer/         # Layout-specific components (e.g., Footer.jsx).
├── Navbar/         # Layout-specific components (e.g., Navbar.jsx).
├── __tests__/      # Unit tests for components.
│   └── Hello.test.jsx # Example test file
└── ...             # General-purpose, application-specific components
    ├── DealCard.jsx
    ├── LoginForm.jsx
    ├── SignUpForm.jsx
    ├── MedicineDealCard.jsx
    └── DatePicker.jsx
```

## 3. Shadcn/ui Components (`src/components/ui/`)

`shadcn/ui` is a collection of reusable components that are built on top of Tailwind CSS and Radix UI. These components provide a solid foundation for common UI elements and are directly integrated into our codebase (not installed as a dependency, but copied into `src/components/ui/` and customizable).

**Key aspects:**

- **Customizable**: Easily themeable and extendable using Tailwind CSS.
- **Accessible**: Built with accessibility in mind (Radix UI).
- **Primitves**: Designed to be composable. You often combine several `ui` components to build a larger application-specific component.

**Usage:**
Import components directly from `src/components/ui/`.

```javascript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function MyForm() {
  return (
    <Card>
      <CardContent>
        <Input placeholder="Email" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 4. Application-Specific Components (`src/components/`)

These are components that encapsulate specific business logic or combine multiple `ui` primitives to form a distinct part of the application UI. Examples include `LoginForm`, `DealCard`, `Navbar`, etc.

**Best Practices:**

- **Clear Naming**: Component names should clearly reflect their purpose.
- **Props**: Define clear `propTypes` or use TypeScript (if applicable) for expected props.
- **Single Responsibility**: Aim for components to do one thing well.
- **State vs. Props**: Understand when to use local component state and when to pass data via props or global state (Zustand).
- **Composition**: Prefer composing smaller components rather than creating monolithic ones.

**Example: `src/components/LoginForm.jsx`**

```javascript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useFormik } from "formik"; // For form management
import { useAuth } from "../store/useAuth"; // For state interaction

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <Card>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {/* ... password input, submit button, error display */}
          <Button type="submit" disabled={isLoading}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## 5. Layout Components (`src/layouts/`)

Layout components define the overall page structure and often include common elements like headers, footers, and sidebars. They are responsible for arranging other components.

- **`MainLayout.jsx`**: The root layout that includes the `BrowserRouter` and defines top-level routes.
- **`SharedLayout.jsx`**: A layout component used for pages that share a common navigation (e.g., Navbar and Footer).

## 6. Testing Components

Component tests are located in `src/__tests__/components/`. We use Vitest and React Testing Library for testing React components.

**Example (`src/__tests__/components/Hello.test.jsx`):**

```javascript
import { render, screen } from "@testing-library/react";
import { Hello } from "../../components/Hello"; // Assuming a simple Hello component
import { describe, it, expect } from "vitest";

describe("Hello component", () => {
  it("renders greeting with name", () => {
    render(<Hello name="World" />);
    expect(screen.getByText(/Hello World!/i)).toBeInTheDocument();
  });
});
```

This guide provides a comprehensive overview of how UI components are structured, developed, and used within Dawaback. For specific implementation details, refer to the component files directly.
