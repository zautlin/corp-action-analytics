export type UserRole = "consumer" | "steward" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  roleLabel: string
  ownedDatasets?: string[] // For stewards - datasets they manage
}

const DEMO_USERS: Record<string, User> = {
  consumer: {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@hedgefund.com",
    role: "consumer",
    roleLabel: "Data Consumer",
  },
  steward: {
    id: "2",
    name: "Michael Rodriguez",
    email: "michael.r@bloomberg.com",
    role: "steward",
    roleLabel: "Data Steward",
    ownedDatasets: ["bloomberg-equity", "bloomberg-fx", "ice-fixed-income"],
  },
  admin: {
    id: "3",
    name: "Jennifer Park",
    email: "jennifer.park@datahex.com",
    role: "admin",
    roleLabel: "Administrator",
  },
}

export function setCurrentUser(userType: keyof typeof DEMO_USERS) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", userType)
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userType = localStorage.getItem("currentUser") as keyof typeof DEMO_USERS
    return userType ? DEMO_USERS[userType] : null
  }
  return null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
    window.location.href = "/login"
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isAdmin(user: User): boolean {
  return user.role === "admin"
}

export function isSteward(user: User): boolean {
  return user.role === "steward"
}

export function isConsumer(user: User): boolean {
  return user.role === "consumer"
}

export function canAccessAnalytics(user: User): boolean {
  return user.role === "admin" || user.role === "steward"
}

export function canAccessAdminPortal(user: User): boolean {
  return user.role === "admin"
}

export function canManageDataset(user: User, datasetId: string): boolean {
  if (user.role === "admin") return true
  if (user.role === "steward" && user.ownedDatasets) {
    return user.ownedDatasets.includes(datasetId)
  }
  return false
}

export function canApproveRequest(user: User, datasetId: string): boolean {
  return canManageDataset(user, datasetId)
}
