import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Wrench, Settings, Home, FileText, Plus, ClipboardList, UserPlus } from "lucide-react";

interface OrganizationSidebarProps {
  orgType: "agency" | "supplier";
  organizationName: string;
  activeSection: 'overview' | 'edit' | 'team' | 'rfps' | 'quotations' | 'received-rfps';
}

export function OrganizationSidebar({ orgType, organizationName, activeSection }: OrganizationSidebarProps) {
  const isAgency = orgType === "agency";
  
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 bg-gradient-to-br ${isAgency ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} rounded-xl shadow-sm`}>
            {isAgency ? (
              <Building2 className="h-6 w-6 text-white" />
            ) : (
              <Wrench className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isAgency ? 'Agency' : 'Supplier'}</h1>
            <p className="text-sm text-gray-500 truncate">{organizationName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/organization" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'overview' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Overview</span>
        </Link>
        
        <Link 
          href="/organization/edit" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'edit' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Edit Organization</span>
        </Link>
        
        <Link 
          href="/organization/team" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'team' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <UserPlus className="h-5 w-5" />
          <span>Manage Team</span>
        </Link>
        
        
        <Separator className="my-6 bg-gray-100" />
        
        {/* Agency-specific navigation */}
        {isAgency && (
          <>
            <Link 
              href="/rfqs/new" 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'rfps' 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Issue New RFP</span>
            </Link>
            
            <Link 
              href="/rfqs" 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'rfps' 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Manage RFPs</span>
            </Link>
          </>
        )}
        
        {/* Supplier-specific navigation */}
        {!isAgency && (
          <>
            <Link 
              href="/quotations" 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'quotations' 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>View Quotations</span>
            </Link>
            
            <Link 
              href="/rfqs/received" 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                activeSection === 'received-rfps' 
                  ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>Received RFPs</span>
            </Link>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className={`w-8 h-8 bg-gradient-to-br ${isAgency ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} rounded-full flex items-center justify-center shadow-sm`}>
            <span className="text-sm font-semibold text-white">
              {organizationName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 truncate">{organizationName}</p>
            <p className="text-xs text-gray-500">{isAgency ? 'Event Agency' : 'Service Supplier'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
