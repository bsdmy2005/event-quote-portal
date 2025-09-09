import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Tag, Settings, Home, BarChart3, FileText, Shield } from "lucide-react";

interface AdminSidebarProps {
  categoriesCount: number;
  agenciesCount: number;
  suppliersCount: number;
  activeSection: 'dashboard' | 'categories' | 'agencies' | 'suppliers' | 'analytics' | 'reports' | 'settings';
}

export function AdminSidebar({ categoriesCount, agenciesCount, suppliersCount, activeSection }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Event Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/admin" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'dashboard' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/admin/categories" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'categories' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Tag className="h-5 w-5" />
          <span>Categories</span>
          <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5">
            {categoriesCount}
          </Badge>
        </Link>
        
        <Link 
          href="/admin/agencies" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'agencies' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Agencies</span>
          <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5">
            {agenciesCount}
          </Badge>
        </Link>
        
        <Link 
          href="/admin/suppliers" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'suppliers' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Building2 className="h-5 w-5" />
          <span>Suppliers</span>
          <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5">
            {suppliersCount}
          </Badge>
        </Link>
        
        <Separator className="my-6 bg-gray-100" />
        
        <Link 
          href="/admin/analytics" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'analytics' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Analytics</span>
        </Link>
        
        <Link 
          href="/admin/reports" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'reports' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Reports</span>
        </Link>
        
        <Link 
          href="/admin/settings" 
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
            activeSection === 'settings' 
              ? 'text-blue-600 bg-blue-50 border border-blue-200 shadow-sm' 
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-100'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-sm font-semibold text-white">A</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@eventportal.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
