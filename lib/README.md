# Library Documentation

## auth.ts

### Mock Data

\`\`\`typescript
const DEMO_USERS = {
  consumer: {
    id: "user-consumer-1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "consumer" as const,
    isAdmin: false,
    isSteward: false,
    ownedDatasets: [],
  },
  steward: {
    id: "user-steward-1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "steward" as const,
    isAdmin: false,
    isSteward: true,
    ownedDatasets: ["bloomberg-equity", "refinitiv-fixed-income"],
  },
  admin: {
    id: "user-admin-1",
    name: "Michael Torres",
    email: "michael.torres@example.com",
    role: "admin" as const,
    isAdmin: true,
    isSteward: false,
    ownedDatasets: [],
  },
}
\`\`\`

### API Integration

Replace the mock authentication with real API calls:

1. **Login:** `POST /auth/login`
2. **Get Current User:** `GET /auth/me`
3. **Logout:** `POST /auth/logout`

Store JWT token in localStorage or httpOnly cookies for session management.

### Functions to Update

- `getCurrentUser()`: Fetch from `GET /auth/me`
- `login()`: Call `POST /auth/login` and store token
- `logout()`: Call `POST /auth/logout` and clear token
- `canApproveRequest()`: Check user permissions from API response
