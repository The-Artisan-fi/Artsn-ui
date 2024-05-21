'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/styles/DashboardInventory.scss';
import { FiArrowUpRight } from 'react-icons/fi';
import { fetchProductDetails } from "@/hooks/fetchProductDetails";
import dynamic from 'next/dynamic';
import { getTokenAccounts } from '@/components/Protocol/functions';
const Table  = dynamic(() => import('antd').then((mod) => mod.Table), { ssr: false });
const Radio  = dynamic(() => import('antd').then((mod) => mod.Radio.Group), { ssr: false });
const Line = dynamic(() => import('@ant-design/plots').then((mod) => mod.Line), {
  ssr: false,
});
import Audemars from "@/public/assets/home/products/Audemars-piguet-Royaloak.webp"
import { useWallet } from '@solana/wallet-adapter-react';
import { buyTx } from "@/components/Protocol/functions";
import { getListingByMintAddress } from '@/lib/queries';
import { useLazyQuery } from '@apollo/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { checkLogin } from "@/components/Web3Auth/solanaRPC";
import { toastError, toastPromise } from '@/helpers/toast';


const Dashboard = () => {

  return (
    <div className="dashboard-inventory">
      <div className="dashboard-inventory__top">
        <div className="dashboard-inventory__top__graph">
          {/* <div className="dashboard-inventory__top__graph__head">
            <p className="caption-2">Wallet Value</p>
            <Radio
              options={optionsWithDisabled}
              onChange={onChange4}
              value={value4}
              optionType="button"
              buttonStyle="solid"
            />
          </div> */}
          <div className="dashboard-inventory__top__graph__stats">
            <h4 className="heading-4">
              <span>KYC</span> <FiArrowUpRight />
            </h4>
            <div className="dashboard-inventory__top__graph__stats__percent">
              <p className="p-4">+2.5%</p>
              <p className="p-5">Last 24hr</p>
            </div>
          </div>
          {/* <div className="dashboard-inventory__top__graph__graph">
            <div className="graph-container">
              <Line {...config} />
            </div>
          </div> */}
        </div>
        <div className="dashboard-inventory__top__gainer item-card">
          <p className="caption-1">Create Token</p>
          {/* <div className="item-body">
            <p className="p-4">+18.4%</p>
            <Image
              src={Audemars}
              className="item-img"
              alt="Audemars Piguet Royal Oak Extra Thin, 2019"
            />
            <p className="p-4">Gained</p>
          </div> */}
          {/* <p className="caption-2">
            Create Token
          </p> */}
        </div>
        <div className="dashboard-inventory__top__valued item-card">
          <p className="caption-1">Create Admin</p>
          {/* <div className="item-body">
            <p className="p-4">$5631</p>
            <Image
              src={Audemars}
              className="item-img"
              alt="Audemars Piguet Royal Oak Extra Thin, 2019"
            />
            <p className="p-4">Fraction Value</p>
          </div>
          <p className="caption-2">
            Audemars Piguet Royal Oak Extra Thin, 2019
          </p> */}
        </div>
      </div>
      {/* {fractions.length > 0 ? (
        <div className="dashboard-inventory__body">
          <Table
            style={{
              border: '1px solid #3d3d3d',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#1e1e22',
            }}
            size="medium"
            scroll={{ x: 'max-content' }}
            // bordered={true}
            dataSource={fractions}
            columns={columns}
            lazy={true}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '2rem',
            marginTop: '5rem',
          }}
        >
          <p className="caption-1">No fractions found</p>
            <button
                className="btn"
                onClick={() => {
                  window.location.href = '/collect-fraction';
                }
              }
            >
              Start Collecting
            </button>
        </div>
      )} */}
      
    </div>
  );
};

export default Dashboard;