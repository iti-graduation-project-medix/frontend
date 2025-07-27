# State Management with Zustand

This document provides a detailed guide on how state is managed in the Dawaback frontend application using Zustand.

## 1. Why Zustand?

Zustand was chosen for state management in Dawaback due to its simplicity, minimal boilerplate, and excellent performance characteristics. It provides a straightforward API for creating and consuming state, making it highly scalable for applications ranging from small to complex.

**Key Advantages:**

- **Simplicity**: Very easy to learn and use, with a small API surface.
- **Performance**: Only re-renders components that actually consume the changed slice of state.
- **Scalability**: Allows for a modular approach where each feature or domain can have its own store.
- **Flexibility**: Works seamlessly with React hooks, enabling powerful patterns.
- **Lightweight**: Small bundle size.

## 2. Store Structure

Each major feature or domain in the application typically has its own dedicated Zustand store, located in the `src/store/` directory. This promotes separation of concerns and makes it easier to locate and manage related state and actions.

**Common structure for a store:**

```javascript
// src/store/use[FeatureName].js
import { create } from 'zustand';
// Import any necessary API calls or utilities

export const use[FeatureName] = create((set, get) => ({
  // --- State Variables ---
  data: null,
  isLoading: false,
  error: null,

  // --- Actions (Functions to modify state or perform side effects) ---
  fetchData: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiCall(params);
      set({ data: response.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateData: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  // You can also access other state or actions using `get()`
  // For example, to log current state after an action:
  logState: () => {
    console.log(get().data);
  }
}));
```

## 3. Creating a Store

To create a new Zustand store:

1.  Create a new file in `src/store/`, e.g., `src/store/useProducts.js`.
2.  Import `create` from `zustand`.
3.  Define your initial state and actions within the `create` function.
4.  Export the hook.

**Example: `src/store/useAuth.js`**

```javascript
import { create } from "zustand";
import { signIn, signUp, signOut } from "../api/auth";
import { toast } from "sonner";

export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  initializeAuth: () => {
    // Re-hydrate state from localStorage on app load
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthenticated: true,
      });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

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
      toast.success("Login successful!");
    } catch (err) {
      set({ error: err.message || "Login failed." });
      toast.error(err.message || "Login failed.");
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, token: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("Logged out successfully.");
  },

  clearError: () => {
    set({ error: null });
  },
}));
```

## 4. Consuming State in Components

To use a store in a React component, simply import the store hook and select the state or actions you need.

**Example:**

```javascript
import React from "react";
import { useAuth } from "../store/useAuth";

function UserProfile() {
  // Select specific state and actions using destructuring
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
```

## 5. Common Patterns and Best Practices

- **Atomic Updates**: Use `set((state) => ({ ... }))` for updates that depend on the previous state.
- **Immutable Updates**: Always return new objects/arrays when updating nested state to ensure React re-renders correctly.
- **Loading and Error States**: Each store typically manages its own `isLoading` and `error` states for asynchronous operations, which can then be easily consumed by UI components.
- **Async Actions**: Actions that perform asynchronous operations (e.g., API calls) should handle `try...catch` blocks for error management and set `isLoading` states appropriately.
- **Persistence**: For user sessions (e.g., authentication tokens, user details), `localStorage` is used to persist state across page refreshes. The `initializeAuth` action in `useAuth` handles re-hydrating the state from `localStorage`.

This guide should help in understanding and working with Zustand for state management in the Dawaback frontend.
