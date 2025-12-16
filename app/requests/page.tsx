"use client"

import { useEffect } from "react"

export default function RequestsPage() {
  useEffect(() => {
    window.location.href = "/corp-actions"
  }, [])

  return null
}
