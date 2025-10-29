'use client';

import { AssignmentProvider } from '@/app/context/AssignmentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AssignmentProvider>
      {children}
    </AssignmentProvider>
  );
}