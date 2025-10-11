import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Header from "@/components/header";
import { getProfileByIdAction, createProfileAction } from "@/actions/profiles-actions";
import { getProfileByEmail } from "@/db/queries/profiles-queries";
import { autoAcceptInvitationAction } from "@/actions/onboarding-actions";
import { Providers } from "@/components/utilities/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("=== LAYOUT RENDERED ===");
  const { userId } = await auth();
  const user = await currentUser();
  console.log("Layout userId:", userId);
  console.log("Layout user email:", user?.emailAddresses?.[0]?.emailAddress);
  let isAdmin = false;

  if (userId) {
    // Check if profile exists
    const profileResult = await getProfileByIdAction(userId);
    
    // If profile doesn't exist, create a basic one (without invitation handling)
    if (!profileResult.data && user) {
      try {
        const userEmail = user.emailAddresses[0]?.emailAddress || "";
        
        // Check if a profile with this email already exists
        const existingProfile = await getProfileByEmail(userEmail);
        if (existingProfile) {
          console.log("Profile with email already exists, skipping creation for user:", userId);
        } else {
          await createProfileAction({
            userId: userId,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: userEmail,
            role: "agency_member" as "admin" | "agency_admin" | "agency_member" | "supplier_admin" | "supplier_member",
            agencyId: null,
            supplierId: null
          });
          console.log("Basic profile created for user:", userId);
          
          // After creating the profile, check for pending invitations
          console.log("=== LAYOUT INVITATION CHECK ===");
          console.log("Checking for invitations for email:", userEmail);
          try {
            const inviteResult = await autoAcceptInvitationAction(userId, userEmail);
            console.log("Layout invitation result:", JSON.stringify(inviteResult, null, 2));
            
            if (inviteResult.isSuccess) {
              console.log("Invitation accepted in layout, profile should now have organization");
            } else {
              console.log("No invitation found in layout:", inviteResult.message);
            }
          } catch (error) {
            console.error("Error checking invitations in layout:", error);
          }
        }
      } catch (error) {
        // If it's a duplicate key error, the profile already exists, just continue
        if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
          console.log("Profile already exists for user:", userId);
        } else {
          console.error("Failed to create profile for user:", userId, error);
        }
      }
    }
    
    // Get the profile to check admin status
    const updatedProfileResult = await getProfileByIdAction(userId);
    const updatedProfile = updatedProfileResult.data;
    isAdmin = updatedProfile?.role === 'admin';
    
    // If user has a profile but no organization, check for invitations
    if (updatedProfile && !updatedProfile.agencyId && !updatedProfile.supplierId) {
      console.log("=== LAYOUT INVITATION CHECK FOR EXISTING PROFILE ===");
      console.log("User has profile but no organization, checking for invitations");
      try {
        const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
        const inviteResult = await autoAcceptInvitationAction(userId, userEmail);
        console.log("Layout invitation result for existing profile:", JSON.stringify(inviteResult, null, 2));
        
        if (inviteResult.isSuccess) {
          console.log("Invitation accepted for existing profile in layout");
        } else {
          console.log("No invitation found for existing profile in layout:", inviteResult.message);
        }
      } catch (error) {
        console.error("Error checking invitations for existing profile in layout:", error);
      }
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange
          >
            <Header isAdmin={isAdmin} />
            <main className="pt-16">
              {children}
            </main>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
