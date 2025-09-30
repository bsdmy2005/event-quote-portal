import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Header from "@/components/header";
import { getProfileByIdAction, createProfileAction, updateProfileAction } from "@/actions/profiles-actions";
import { getOrgInviteByEmail, updateOrgInvite } from "@/db/queries/invites-queries";
import { Providers } from "@/components/utilities/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();
  let isAdmin = false;

  if (userId) {
    // Check if profile exists
    const profileResult = await getProfileByIdAction(userId);
    
    // If profile doesn't exist, create one using Clerk user data
    if (!profileResult.data && user) {
      try {
        const userEmail = user.emailAddresses[0]?.emailAddress || "";
        
        // Check if user has a pending invitation
        const pendingInvite = await getOrgInviteByEmail(userEmail);
        
        let defaultRole = "agency_member";
        let agencyId = null;
        let supplierId = null;
        
        // If user has a valid pending invitation, use that data
        if (pendingInvite && !pendingInvite.acceptedAt && pendingInvite.expiresAt > new Date()) {
          defaultRole = pendingInvite.role;
          if (pendingInvite.orgType === "agency") {
            agencyId = pendingInvite.orgId;
          } else {
            supplierId = pendingInvite.orgId;
          }
          
          // Mark invite as accepted
          await updateOrgInvite(pendingInvite.id, { acceptedAt: new Date() });
          console.log("User auto-assigned to organization via invitation:", pendingInvite.orgId);
        }
        
        await createProfileAction({
          userId: userId,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: userEmail,
          role: defaultRole,
          agencyId: agencyId,
          supplierId: supplierId
        });
        console.log("Profile created for user:", userId);
      } catch (error) {
        console.error("Failed to create profile for user:", userId, error);
      }
    }
    
    // Get the profile (either existing or newly created) to check admin status
    const updatedProfileResult = await getProfileByIdAction(userId);
    isAdmin = updatedProfileResult.data?.role === 'admin';
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
