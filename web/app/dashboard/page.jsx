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

// Graph configurations

const optionsWithDisabled = [
  // { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
];

const data = [
  { day: 'Jan', value: 3 },
  { day: 'Feb', value: 4 },
  { day: 'Mar', value: 3.5 },
  { day: 'Apr', value: 5 },
  { day: 'May', value: 4.2 },
  { day: 'Jun', value: 4.8 },
  { day: 'July', value: 3.7 },
  { day: 'Aug', value: 3.5 },
  { day: 'Sep', value: 4.2 },
  { day: 'Oct', value: 4.5 },
  { day: 'Nov', value: 4.7 },
  { day: 'Dec', value: 3.8 },
];

const config = {
  data,
  xField: 'day',
  yField: 'value',

  autoFit: true,

  theme: 'classicDark',
  point: {
    shapeField: 'square',
    sizeField: 4,
  },
  interaction: {
    tooltip: {
      marker: false,
    },
  },
  style: {
    lineWidth: 3,
    lineFill: 'green',
  },
};

const Dashboard = () => {
  const [value4, setValue4] = useState('Weekly');
  const [fractions] = useState([]);
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const { publicKey, sendTransaction } = useWallet();
  const [web3AuthPublicKey, setWeb3AuthPublicKey] = useState(null);
  const [rpc, setRpc] = useState(null);
  const [variables, setVariables] = useState({ mintAddress: '' });
  const [queryItem, setQueryItem] = useState('');
  const [listingAddress, setListingAddress] = useState('');
  const onChange4 = ({ target: { value } }) => {
    console.log('radio4 checked', value);
    setValue4(value);
  };

  const [getListing, { loading, error, data }] = useLazyQuery(getListingByMintAddress , {variables});
  if(!loading && data != undefined && listingAddress == ''){
    console.log('data', data);
    if(data.listings.length > 0 && fractions.filter((item) => item.associatedId == data.listings[0].associatedId).length == 0){

      fractions.push({
        ...queryItem,
        associatedId: data.listings[0].associatedId
      });

      setListingAddress(data.listings[0].associatedId);
    }
  }
  if(!loading && error != undefined){
      console.log("error", error);
  }

  async function getListingAddress(data){
    setVariables({mintAddress: data.mint});
    await getListing();
    return;
  }

  const columns = [
    {
      title: '',
      dataIndex: 'no',
      key: 'no',
  
      width: 10,
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
  
      render: (text, record) => (
        <Image
          width={40}
          height={50}
          src={Audemars}
          alt="Audemars Piguet Royal Oak Extra Thin, 2019"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
  
      render: (text, record) => <p>{`$${text}`}</p>,
    },
  
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
  
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
  
      render: (text, record) => (
        <div className="dashboard-inventory__body__table__action">
          <button
            className="btn-table"
            onClick={async () => {
              // console.log('record', record);
              window.location.href = `/product/${record.associatedId}`;
            }}
          >
            See
          </button>
          <button className="btn-table"
            onClick={async () => {
              buyMore(record);
            }}
          >Buy More</button>
          <button className="btn-table" disabled={true}>Trade</button>
        </div>
      ),
    },
  ];

  async function buyMore(product) {
    try{
        const data = await fetchProductDetails(product.associatedId);
        // console.log('data', data)
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        if(publicKey && data){
          const tx = await buyTx(data.id, data.reference, publicKey.toBase58(), 1);
          const getProvider = () => {
            if ('phantom' in window) {
              const provider = window.phantom?.solana;
          
              if (provider?.isPhantom) {
                return provider;
              }
            }
          
            window.open('https://phantom.app/', '_blank');
          };
          const provider = getProvider();
           const signature = await provider.signAndSendTransaction(tx)
           console.log('signature from buy', signature);
           await toastPromise(signature)
        } else if(web3AuthPublicKey && data){ 
          const tx = await buyTx(data.id, data.reference, web3AuthPublicKey, 1);
          const signature = await rpc.sendTransaction(tx); 
          await toastPromise(signature)
        }
    } catch (error) {
        toastError(`Error: ${error.message}`);
    };
  };
  const getTokens = async (key) => {
    // only execute if tokenAccounts is empty
    if (tokenAccounts.length == 0) {
      console.log('key', key)
      const data = await getTokenAccounts(key);
      console.log('data', data)
      setTokenAccounts(data);
      if(!data){
        return;
      }
      for(let i = 0; i < data.length; i++){
        setQueryItem(data[i]);
        await getListingAddress(data[i]);
        setListingAddress('');
      }
    }
  }

  useEffect(() => {
    if (publicKey && tokenAccounts?.length == 0) {
      getTokens(publicKey);
    }
  }, [publicKey, tokenAccounts]);

  useEffect(() => {
    if (publicKey && tokenAccounts.length == 0) {
      getTokens(publicKey);
    } else {
        checkLogin().then((res) => {
          if(res){
              if(res.account){
                  setWeb3AuthPublicKey(new PublicKey(res.account));
              }
              if(res.rpc !== null){
                  setRpc(res.rpc);
              }
          }
      });
    }
  }, []);


  return (
    <div className="dashboard-inventory">
      <div className="dashboard-inventory__top">
        <div className="dashboard-inventory__top__graph">
          <div className="dashboard-inventory__top__graph__head">
            <p className="caption-2">Wallet Value</p>
            <Radio
              options={optionsWithDisabled}
              onChange={onChange4}
              value={value4}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div className="dashboard-inventory__top__graph__stats">
            <h4 className="heading-4">
              <span>$845,900</span> <FiArrowUpRight />
            </h4>
            <div className="dashboard-inventory__top__graph__stats__percent">
              <p className="p-4">+2.5%</p>
              <p className="p-5">Last 24hr</p>
            </div>
          </div>
          <div className="dashboard-inventory__top__graph__graph">
            <div className="graph-container">
              <Line {...config} />
            </div>
          </div>
        </div>
        <div className="dashboard-inventory__top__gainer item-card">
          <p className="caption-1">Top Gainer</p>
          <div className="item-body">
            <p className="p-4">+18.4%</p>
            <Image
              src={Audemars}
              className="item-img"
              alt="Audemars Piguet Royal Oak Extra Thin, 2019"
            />
            <p className="p-4">Gained</p>
          </div>
          <p className="caption-2">
            Audemars Piguet Royal Oak Extra Thin, 2019
          </p>
        </div>
        <div className="dashboard-inventory__top__valued item-card">
          <p className="caption-1">Most Valued</p>
          <div className="item-body">
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
          </p>
        </div>
      </div>
      {fractions.length > 0 ? (
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
      )}
    </div>
  );
};

export default Dashboard;