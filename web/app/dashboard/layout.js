import DashboardLayout from '@/components/DashboardLayout/DashboardLayout';
import DashboardNav from '@/components/DashboardNav/DashboardNav';
import { mintToChecked } from '@solana/spl-token';

import React from 'react';

const layout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: ' 100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DashboardNav />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
};

export default layout;