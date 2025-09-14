import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Quote Portal</h1>
          <p className="text-gray-600 mb-4">Create your account to get started</p>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">1.</span>
                <span>Sign up with your email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">2.</span>
                <span>Choose your role: Agency or Supplier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">3.</span>
                <span>Complete your organization profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">4.</span>
                <span>Start connecting with the community</span>
              </li>
            </ol>
          </div>
        </div>
        <SignUp 
          redirectUrl="/onboard"
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
        />
      </div>
    </div>
  )
}
