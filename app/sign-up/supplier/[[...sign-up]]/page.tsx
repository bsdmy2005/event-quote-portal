"use client"

import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function SupplierSignUpPage() {
  useEffect(() => {
    // Store the selected role in localStorage
    localStorage.setItem("selectedSignUpRole", "supplier")
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Supplier</h1>
          <p className="text-gray-600">Create your account to start receiving RFQs from agencies</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
              card: "shadow-xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
              formFieldInput: "border-gray-200 focus:border-green-500 focus:ring-green-500",
              footerActionLink: "text-green-600 hover:text-green-700"
            }
          }}
          redirectUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  )
}
