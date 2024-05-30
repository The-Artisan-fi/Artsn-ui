'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/DashboardInventory.scss';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { auth } from '@/lib/constants';


const Dashboard = () => {
  const { publicKey } = useWallet();
  const router = useRouter();
  return (
    <div className="dashboard-inventory">
      {publicKey && publicKey.toString() === auth ? (
        <div className="dashboard-inventory__top">
          <button 
            onClick={() => router.push('/admin/admin')}
            className="dashboard-inventory__top__gainer item-card"
            style={{ cursor: 'pointer' }}
          >
            <p className="caption-1">Create Admin</p>
          </button>
          <button 
            onClick={() => router.push('/admin/token')}
            className="dashboard-inventory__top__gainer item-card"
            style={{ cursor: 'pointer' }}
          >
            <p className="caption-1">Create Token</p>
          </button>
          <button 
            onClick={() => router.push('/admin/kyc')}
            className="dashboard-inventory__top__gainer item-card"
            style={{ cursor: 'pointer' }}
          >
            <p className="caption-1">KYC</p>
          </button>
        </div>
        ) : (
          <div className="dashboard-inventory__top__gainer item-card">
            <p className="caption-1">You are not authorized to view this page</p>
          </div>
        )}
    </div>
  );
};

export default Dashboard;