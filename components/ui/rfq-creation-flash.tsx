"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function RfqCreationFlash() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rfqCreationSuccess")
      if (!raw) return

      const payload = JSON.parse(raw) as { title?: string }
      toast.success(payload?.title ? `RFQ created: ${payload.title}` : "RFQ created successfully")
      localStorage.removeItem("rfqCreationSuccess")
    } catch {
      // Ignore parse/localStorage errors.
    }
  }, [])

  return null
}

