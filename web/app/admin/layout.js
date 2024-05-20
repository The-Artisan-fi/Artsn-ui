import React from 'react';
import dynamic from 'next/dynamic';
const DashboardLayout = dynamic(() => import('@/components/AdminDashboard/DashboardLayout/DashboardLayout'), { ssr: false });
const DashboardNav = dynamic(() => import('@/components/AdminDashboard/DashboardNav/DashboardNav'), { ssr: false });

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