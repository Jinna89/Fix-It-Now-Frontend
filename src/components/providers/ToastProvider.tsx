'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#16232E',
          color: '#F6F5F1',
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
          border: '1px solid #2C4356',
        },
        success: { iconTheme: { primary: '#E8A33D', secondary: '#16232E' } },
        error: { iconTheme: { primary: '#C53030', secondary: '#16232E' } },
      }}
    />
  );
}
