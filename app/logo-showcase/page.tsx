"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Logo Variation 1: Original with gradient stroke
function Logo1({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <mask id="notch1">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad1)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L198 198"/>
      </g>
      <g fill="none" stroke="url(#grad1)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch1)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 2: Solid dark with thicker stroke
function Logo2({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <mask id="notch2">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="20" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="#0B1F3B" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L198 198"/>
      </g>
      <g fill="none" stroke="#0B1F3B" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch2)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 3: Double ring portal
function Logo3({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <mask id="notch3">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="16" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad3)" strokeWidth="8" strokeLinecap="round" opacity="0.4">
        <circle cx="120" cy="120" r="90"/>
      </g>
      <g fill="none" stroke="url(#grad3)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L198 198"/>
      </g>
      <g fill="none" stroke="url(#grad3)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch3)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 4: Teal/Emerald gradient
function Logo4({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <mask id="notch4">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad4)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L198 198"/>
      </g>
      <g fill="none" stroke="url(#grad4)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch4)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 5: Minimal (no notch, clean)
function Logo5({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#grad5)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="120" cy="120" r="70"/>
        <path d="M165 165 L200 200"/>
      </g>
    </svg>
  );
}

// Logo Variation 6: With inner dot/portal center
function Logo6({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <mask id="notch6">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <circle cx="120" cy="120" r="20" fill="url(#grad6)" opacity="0.3"/>
      <g fill="none" stroke="url(#grad6)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L195 195"/>
      </g>
      <g fill="none" stroke="url(#grad6)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch6)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 7: Orange/Amber warm gradient
function Logo7({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <mask id="notch7">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad7)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L198 198"/>
      </g>
      <g fill="none" stroke="url(#grad7)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch7)">
        <circle cx="120" cy="120" r="70"/>
      </g>
    </svg>
  );
}

// Logo Variation 8: Thin elegant with larger notch
function Logo8({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad8" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <mask id="notch8">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="45" r="25" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad8)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path d="M165 165 L205 205"/>
      </g>
      <g fill="none" stroke="url(#grad8)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch8)">
        <circle cx="120" cy="120" r="75"/>
      </g>
    </svg>
  );
}

// ============ Q+P VARIATIONS (diagonal starts inside, extends out as Q tail) ============

// Logo Variation 9: Q+P diagonal - blue gradient
function Logo9({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <mask id="notch9">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad9)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch9)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="url(#grad9)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        {/* Diagonal: starts inside circle, extends out at bottom-right as Q tail */}
        <path d="M70 70 L198 198"/>
      </g>
    </svg>
  );
}

// Logo Variation 10: Q+P diagonal bold dark
function Logo10({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <mask id="notch10">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="20" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="#0B1F3B" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch10)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="#0B1F3B" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 70 L200 200"/>
      </g>
    </svg>
  );
}

// Logo Variation 11: Q+P diagonal blue-purple
function Logo11({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad11" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <mask id="notch11">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="16" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad11)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch11)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="url(#grad11)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 70 L195 195"/>
      </g>
    </svg>
  );
}

// Logo Variation 12: Q+P diagonal teal
function Logo12({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad12" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <mask id="notch12">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad12)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch12)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="url(#grad12)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 70 L198 198"/>
      </g>
    </svg>
  );
}

// Logo Variation 13: Q+P diagonal minimal (no notch)
function Logo13({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad13" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#grad13)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="120" cy="120" r="70"/>
        <path d="M70 70 L200 200"/>
      </g>
    </svg>
  );
}

// Logo Variation 14: Q+P diagonal with double ring
function Logo14({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad14" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <mask id="notch14">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="16" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad14)" strokeWidth="8" strokeLinecap="round" opacity="0.3">
        <circle cx="120" cy="120" r="90"/>
      </g>
      <g fill="none" stroke="url(#grad14)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch14)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="url(#grad14)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 70 L198 198"/>
      </g>
    </svg>
  );
}

// Logo Variation 15: Q+P diagonal warm amber
function Logo15({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad15" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <mask id="notch15">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="50" r="18" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad15)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch15)">
        <circle cx="120" cy="120" r="70"/>
      </g>
      <g fill="none" stroke="url(#grad15)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 70 L198 198"/>
      </g>
    </svg>
  );
}

// Logo Variation 16: Q+P diagonal elegant thin
function Logo16({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}>
      <defs>
        <linearGradient id="grad16" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <mask id="notch16">
          <rect width="256" height="256" fill="white"/>
          <circle cx="120" cy="45" r="25" fill="black"/>
        </mask>
      </defs>
      <g fill="none" stroke="url(#grad16)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" mask="url(#notch16)">
        <circle cx="120" cy="120" r="75"/>
      </g>
      <g fill="none" stroke="url(#grad16)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path d="M67 67 L205 205"/>
      </g>
    </svg>
  );
}

const logoVariations = [
  {
    id: 1,
    name: "Original Gradient",
    description: "Blue to indigo gradient with portal notch",
    Logo: Logo1
  },
  {
    id: 2,
    name: "Bold Dark",
    description: "Thick dark ink stroke, strong presence",
    Logo: Logo2
  },
  {
    id: 3,
    name: "Double Ring",
    description: "Outer aura ring for depth effect",
    Logo: Logo3
  },
  {
    id: 4,
    name: "Teal Fresh",
    description: "Teal to emerald, modern and fresh",
    Logo: Logo4
  },
  {
    id: 5,
    name: "Minimal Clean",
    description: "No notch, pure and simple Q",
    Logo: Logo5
  },
  {
    id: 6,
    name: "Portal Center",
    description: "Inner glow suggesting depth",
    Logo: Logo6
  },
  {
    id: 7,
    name: "Warm Amber",
    description: "Orange to amber, energetic feel",
    Logo: Logo7
  },
  {
    id: 8,
    name: "Elegant Thin",
    description: "Refined thin stroke, larger opening",
    Logo: Logo8
  },
  // Q+P Variations: diagonal starts inside, extends out as Q tail
  {
    id: 9,
    name: "Q+P Slash",
    description: "Slash through circle with Q tail",
    Logo: Logo9
  },
  {
    id: 10,
    name: "Q+P Bold Dark",
    description: "Strong dark slash with tail",
    Logo: Logo10
  },
  {
    id: 11,
    name: "Q+P Blue-Purple",
    description: "Blue-purple slash with Q tail",
    Logo: Logo11
  },
  {
    id: 12,
    name: "Q+P Teal",
    description: "Teal slash through with tail",
    Logo: Logo12
  },
  {
    id: 13,
    name: "Q+P Minimal",
    description: "No notch, clean slash with tail",
    Logo: Logo13
  },
  {
    id: 14,
    name: "Q+P Double Ring",
    description: "Slash with tail, outer ring",
    Logo: Logo14
  },
  {
    id: 15,
    name: "Q+P Amber",
    description: "Warm amber slash with tail",
    Logo: Logo15
  },
  {
    id: 16,
    name: "Q+P Elegant",
    description: "Thin slash with tail, larger notch",
    Logo: Logo16
  },
];

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-4">
            Brand Identity
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Qoute Portal Logo Variations
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select your preferred logo style. Each variation maintains the Q-portal concept
            while offering different visual treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {logoVariations.map(({ id, name, description, Logo }) => (
            <Card
              key={id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
            >
              <CardContent className="p-8 flex flex-col items-center">
                <div className="mb-6 p-6 bg-white rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Logo className="h-24 w-24" />
                </div>
                <Badge variant="outline" className="mb-2">#{id}</Badge>
                <h3 className="text-lg font-semibold text-slate-900 text-center">
                  {name}
                </h3>
                <p className="text-sm text-slate-500 text-center mt-2">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview with text */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Preview with Brand Name
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logoVariations.map(({ id, Logo }) => (
              <div
                key={id}
                className="flex items-center justify-center space-x-3 p-6 bg-white rounded-xl shadow-md"
              >
                <Logo className="h-12 w-12" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Qoute Portal
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dark background preview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            On Dark Background
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {logoVariations.map(({ id, Logo }) => (
              <div
                key={id}
                className="flex items-center justify-center space-x-3 p-6 bg-slate-900 rounded-xl shadow-md"
              >
                <Logo className="h-12 w-12" />
                <span className="text-2xl font-bold text-white">
                  Qoute Portal
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
