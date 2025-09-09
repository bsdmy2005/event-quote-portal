"use client"

import { SignUp } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function AgencySignUpPage() {
  useEffect(() => {
    // Store the selected role in localStorage
    localStorage.setItem("selectedSignUpRole", "agency")
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as an Agency</h1>
          <p className="text-gray-600">Create your account to start connecting with suppliers</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
              card: "shadow-xl border-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
              formFieldInput: "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
              footerActionLink: "text-blue-600 hover:text-blue-700"
            }
          }}
          redirectUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  )
}
