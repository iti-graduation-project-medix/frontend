# Frontend Architecture (src/)

This document details the architectural decisions and structure of the Dawaback frontend application, residing within the `src/` directory.

## Table of Contents

1.  [Core Principles](#1-core-principles)
2.  [Folder Structure](#2-folder-structure)
3.  [State Management (Zustand)](#3-state-management-zustand)
4.  [API Integration](#4-api-integration)
5.  [Routing](#5-routing)
6.  [UI Components (Shadcn/ui & Custom)](#6-ui-components-shadcnui--custom)
7.  [Utility Functions](#7-utility-functions)

## 1. Core Principles

- **Modularity**: Code is organized into small, independent, and reusable modules.
- **Separation of Concerns**: Different aspects of the application (UI, logic, data fetching) are handled in distinct layers/folders.
- **Maintainability**: Emphasize clear, readable code with consistent patterns.
- **Performance**: Optimize for fast loading times and smooth user interactions.
- **Scalability**: Design allows for easy addition of new features and components.

## 2. Folder Structure

```
src/
├── api/            # Centralized location for all API service calls.
│   ├── auth/       # Authentication related API calls (SignIn, SignUp, ResetPassword).
│   └── ...         # Other feature-specific API calls (deals, pharmacies, profile, etc.).
├── assets/         # Static assets like images, SVG icons, fonts.
├── components/     # Reusable UI components.
│   ├── ui/         # Components from shadcn/ui library (button, input, card, etc.).
│   ├── Footer/     # Layout-specific components (e.g., Footer).
│   ├── Navbar/     # Layout-specific components (e.g., Navbar).
│   └── ...         # General-purpose components (DealCard, LoginForm, SignUpForm, etc.).
├── hooks/          # Custom React Hooks for encapsulating reusable logic (e.g., useDebounce, usePWA).
├── layouts/        # Defines the overall page structures.
│   ├── MainLayout.jsx # Main application layout with routing.
│   └── SharedLayout.jsx # Layout for components shared across multiple routes (e.g., Navbar, Footer).
├── lib/            # Utility functions that are not React-specific (e.g., `utils.js` for `cn` helper).
├── pages/          # Top-level components representing distinct application views/pages.
│   ├── Auth/       # Authentication-related pages (Login, SignUp, ResetPassword).
│   ├── Deals/      # Deals-related pages (AvailableDeals, MyDeals, DealDetails).
│   └── ...         # Other feature-specific pages (Settings, Profile, ContactUs, etc.).
├── services/       # External service integrations beyond simple API calls (e.g., WebSocket client).
├── store/          # Zustand store modules for global state management.
│   ├── useAuth.js      # Authentication state.
│   ├── useDeals.js     # Deals-related state.
│   └── ...             # Other feature-specific stores.
├── utils/          # General utility functions and helpers (e.g., error handling, PWA setup).
├── App.jsx         # Main application component.
├── main.jsx        # Entry point for the React application.
└── index.css       # Global styles.
```

## 3. State Management (Zustand)

Zustand is used for managing global application state. Each major feature or domain has its own Zustand store (e.g., `useAuth.js`, `useDeals.js`).

**Key benefits of Zustand here:**

- **Simplicity**: Minimal boilerplate, easy to define and consume state.
- **Performance**: Rerenders only components that use the changed state.
- **Scalability**: Allows for modular state definition that grows with the application.

**Example (`store/useAuth.js`):**

```javascript
// Pseudo-code example
import { create } from "zustand";
import { signIn, signUp } from "../api/auth";

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signIn(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
      });
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  // ... other auth actions
}));
```

## 4. API Integration

API calls are centralized in the `src/api/` directory. `axios` is used as the HTTP client. Each API file (`src/api/auth/SignIn.js`, `src/api/deals.js`, etc.) exports functions responsible for making specific API requests.

**Example (`api/auth/SignIn.js`):**

```javascript
// Pseudo-code example
import axiosInstance from "../axios";

export const signIn = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};
```

## 5. Routing

`react-router-dom` is used for client-side routing. Routes are defined in `src/layouts/MainLayout.jsx`.

- **`MainLayout.jsx`**: Defines the main application routes, including public, authenticated, and role-based routes.
- **`ProtectedRoute.jsx`**: A component that wraps routes requiring authentication, redirecting unauthenticated users to the login page.
- **`SubscriptionRoute.jsx`**: A component that wraps routes requiring an active subscription, redirecting users without one.

## 6. UI Components (Shadcn/ui & Custom)

Components are primarily located in `src/components/`.

- **`src/components/ui/`**: Houses components generated or adapted from `shadcn/ui`. These are generally low-level, highly reusable UI primitives (e.g., Button, Input, Card, Dialog).
- **`src/components/` (root)**: Contains higher-order, application-specific components (e.g., `LoginForm`, `DealCard`, `Navbar`, `Footer`) that often compose `ui` components.

## 7. Utility Functions

General utility functions are organized across `src/lib/` and `src/utils/`.

- **`src/lib/`**: Contains small, generic helper functions that can be used across the application (e.g., `cn` for concatenating Tailwind CSS classes).
- **`src/utils/`**: Contains application-specific utility functions, such as `errorHandler.js` for centralized error handling, or `pwa.js` for Progressive Web App related functionalities.

This architecture aims to provide a clear, maintainable, and scalable foundation for the Dawaback frontend application.
