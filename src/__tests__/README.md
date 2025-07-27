# Unit Tests for Project

This directory contains unit tests for the project's services, store, and lib files.

## Test Structure

```
src/__tests__/
├── services/
│   ├── chatApi.test.js
│   ├── socket.test.js
│   └── drugAlert.test.js
├── store/
│   ├── useAdvertise.test.js
│   ├── useUserDetails.test.js
│   └── useFav.test.js
├── lib/
│   └── utils.test.js
├── hooks/
│   └── (hook test files)
└── jest.setup.js
```

## Running Tests

To run the tests, use one of the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests for a specific file
npm test -- chatApi.test.js

# Run tests with coverage
npm test -- --coverage
```

## Linter Errors

The test files may show linter errors related to Jest globals and Node.js globals. To fix these, you can:

### Option 1: Add ESLint Configuration

Add the following to your `.eslintrc.js` or `eslint.config.js`:

```javascript
module.exports = {
  // ... other config
  env: {
    // ... other env
    jest: true,
    node: true,
  },
  globals: {
    // ... other globals
    global: 'readonly',
    require: 'readonly',
  },
};
```

### Option 2: Add Global Comments

Add this comment at the top of each test file:

```javascript
/* global jest, describe, it, expect, beforeEach, afterEach, global, require */
```

### Option 3: Create .eslintignore

Add test files to `.eslintignore`:

```
src/__tests__/**/*.test.js
```

## Test Coverage

The tests cover:

### Services
- **chatApi.js**: API calls for chat functionality
- **socket.js**: WebSocket connection and event handling
- **drugAlert.js**: Drug alert notifications

### Store (Zustand)
- **useAdvertise.js**: Advertisement state management
- **useUserDetails.js**: User details fetching and state
- **useFav.js**: Favorites management with optimistic updates

### Lib
- **utils.js**: Utility functions for class name merging

## Mocking Strategy

- **API calls**: Mocked using `jest.mock()`
- **localStorage/sessionStorage**: Mocked globally
- **fetch**: Mocked globally
- **Socket.io**: Mocked using `jest.mock()`
- **External libraries**: Mocked as needed

## Test Patterns

Each test file follows these patterns:

1. **Setup**: Mock dependencies and clear mocks before each test
2. **Test cases**: Test happy path, error cases, and edge cases
3. **Cleanup**: Restore mocks after each test
4. **Assertions**: Verify function calls, state changes, and return values

## Adding New Tests

When adding new tests:

1. Create the test file in the appropriate directory
2. Mock all external dependencies
3. Test both success and error scenarios
4. Use descriptive test names
5. Follow the existing patterns

## Example Test Structure

```javascript
/* global jest, describe, it, expect, beforeEach, afterEach */
import { renderHook, act } from '@testing-library/react';
import { someFunction } from '../../path/to/file';

// Mock dependencies
jest.mock('../../path/to/dependency', () => ({
  someApi: jest.fn(),
}));

describe('someFunction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should do something successfully', async () => {
    // Arrange
    const mockData = { id: 1, name: 'test' };

    // Act
    const result = await someFunction(mockData);

    // Assert
    expect(result).toEqual(expectedValue);
  });

  it('should handle errors', async () => {
    // Arrange
    const error = new Error('Test error');

    // Act & Assert
    await expect(someFunction()).rejects.toThrow('Test error');
  });
});
```
