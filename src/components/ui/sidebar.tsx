// src/components/ui/sidebar.tsx

import React from "react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex flex-col w-80 bg-gray-100 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800">
      {children}
    </div>
  );
}