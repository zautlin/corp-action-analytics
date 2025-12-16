"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function HomePage() {
  useEffect(() => {
    // Redirect to corporate actions page
    window.location.href = "/corp-actions"
  }, [])

  // Return null while redirecting
  return null
}
