"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCostConsultantOnboardingAction } from "@/actions/onboarding-actions"
import { notifyActionResult, notifyUnexpectedError } from "@/lib/client-action-feedback"

export function CreateCostConsultantForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [country, setCountry] = useState("South Africa")
  const [serviceCategories, setServiceCategories] = useState("")
  const [about, setAbout] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createCostConsultantOnboardingAction({
        name,
        contactName,
        email,
        location: { city, province, country },
        serviceCategories: serviceCategories.split(",").map((s) => s.trim()).filter(Boolean),
        about,
      })

      if (
        notifyActionResult(res, {
          successMessage: "Cost consultant onboarding complete",
          errorMessage: "Failed to complete cost consultant onboarding",
        })
      ) {
        router.push("/organization")
      }
    } catch {
      notifyUnexpectedError("complete cost consultant onboarding")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><Label>Organization Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div><Label>Contact Name</Label><Input value={contactName} onChange={(e) => setContactName(e.target.value)} required /></div>
      <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} required /></div>
        <div><Label>Province</Label><Input value={province} onChange={(e) => setProvince(e.target.value)} required /></div>
        <div><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} required /></div>
      </div>
      <div><Label>Service Categories (comma separated)</Label><Input value={serviceCategories} onChange={(e) => setServiceCategories(e.target.value)} /></div>
      <div><Label>About</Label><Textarea value={about} onChange={(e) => setAbout(e.target.value)} /></div>
      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Cost Consultant"}</Button>
    </form>
  )
}
