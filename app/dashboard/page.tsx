import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByIdAction } from "@/actions/profiles-actions";
import OnboardingRedirect from "@/components/onboarding-redirect";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has completed onboarding
  const profileResult = await getProfileByIdAction(userId);
  const profile = profileResult.data;

  // If user doesn't belong to any organization, they need to complete onboarding
  if (profile && !profile.agencyId && !profile.supplierId) {
    redirect("/onboard");
  }

  return (
    <div className="container mx-auto p-8">
      <OnboardingRedirect />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      
      {profile && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
          <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {profile.agencyId && <p><strong>Organization:</strong> Agency</p>}
          {profile.supplierId && <p><strong>Organization:</strong> Supplier</p>}
        </div>
      )}
    </div>
  );
} 
