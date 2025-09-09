"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface SelectCategoryProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selected: string[]) => void;
  disabled?: boolean;
}

export function SelectCategory({
  categories = [],
  selectedCategories = [],
  onSelectionChange,
  disabled = false,
}: SelectCategoryProps) {
  const [open, setOpen] = useState(false);

  // Ensure we have valid arrays
  const safeCategories = Array.isArray(categories) ? categories.filter(cat => cat && cat.id && cat.name) : [];
  const safeSelectedCategories = Array.isArray(selectedCategories) ? selectedCategories : [];

  const handleToggle = (categoryId: string, checked: boolean) => {
    if (!categoryId) return;
    
    const newSelection = checked
      ? [...safeSelectedCategories, categoryId]
      : safeSelectedCategories.filter(id => id !== categoryId);
    
    onSelectionChange(newSelection);
  };

  const handleRemove = (categoryId: string) => {
    const newSelection = safeSelectedCategories.filter(id => id !== categoryId);
    onSelectionChange(newSelection);
  };

  const selectedCategoryNames = safeCategories
    .filter(cat => safeSelectedCategories.includes(cat.id))
    .map(cat => cat.name);

  // If no categories, show a simple message
  if (safeCategories.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-3 border rounded bg-gray-50">
        No categories available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-11 border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
            disabled={disabled}
          >
            {safeSelectedCategories.length === 0
              ? "Select categories..."
              : `${safeSelectedCategories.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-lg">
          <div className="p-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Categories</Label>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {safeCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 hover:border hover:border-gray-200 rounded-lg transition-all duration-150">
                      <Checkbox
                        id={category.id}
                        checked={safeSelectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleToggle(category.id, checked as boolean)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={category.id} className="text-sm text-gray-700 cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedCategoryNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategoryNames.map((name) => {
            const category = safeCategories.find(cat => cat.name === name);
            return (
              <Badge key={name} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-150">
                {name}
                <button
                  type="button"
                  onClick={() => category && handleRemove(category.id)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-150"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
