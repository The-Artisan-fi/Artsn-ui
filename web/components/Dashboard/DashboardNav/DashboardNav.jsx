'use client';

import '@/styles/DashboardNav.scss';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button, Popover, Avatar, List } from 'antd';
import { LuBell } from 'react-icons/lu';
import { LuBellDot } from 'react-icons/lu';
import { useLazyQuery } from "@apollo/client";
import { userProfileBasic } from "@/lib/queries";
import { checkLogin } from "@/components/Web3Auth/solanaRPC";
import { toastError } from '@/helpers/toast';
import dynamic from 'next/dynamic';
const LoadingSpinner = dynamic(() => import('@/components/Loading/Loading').then((mod) => mod.LoadingSpinner), { ssr: false });
const DashboardNav = () => {
  const router = useRouter();
  const pathname = usePathname()
  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { publicKey } = useWallet();
  const [variables, setVariables] = useState({ wallet: ''});
  const [profileImg, setProfileImg] = useState('');
  const [userName, setUserName] = useState('');
  const [verified, setVerified] = useState(false);
  const [getDetails, { loading, error, data }] = useLazyQuery(userProfileBasic , {variables});
  if(!loading && data != undefined && profileImg == ''){
    console.log('data', data);
    setProfileImg(data.users[0].profileImg);
    setUserName(data.users[0].userName);
    setVerified(data.users[0].idvStatus == true ? true : false)
    setProfileLoading(false);
  }
  if(!loading && error != undefined){
      console.log("error", error);
      toastError(error);
  }
  const [haveNotifications, setHaveNotifications] = useState(true);

  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  // Dummy notification data
  const notificationsData = [
    { id: 1, text: 'You have a new message.' },
    { id: 2, text: 'You have a new friend request.' },
    { id: 3, text: 'Someone liked your post.' },
  ];

  const navLinks = [
    {
      to: '/collect-fraction',
      name: 'Fragment'
    },
    {
      to: '/about',
      name: 'About Us',
    },
  ];

  const notifications = (
    <List
      dataSource={notificationsData}
      renderItem={(item) => <List.Item key={item.id}>{item.text}</List.Item>}
    />
  );

  useEffect(() => {
    if(publicKey){
      setVariables({wallet: publicKey.toBase58()});
      getDetails();
    } else {
        checkLogin().then((res) => {
          if(res){
            if(res.account){
              setVariables({wallet: res.account});
              getDetails();
            }
          } else {
            router.push('/collect-fraction');
          }
      });
    }
  }, [publicKey]);

  return (
    <div className="dashboard-nav">
      <Link className="dashboard-nav__navbrand" href="/">
        <img
          className="dashboard-nav__navbrand__img"
          src="/assets/navbrand-full.webp"
        />{' '}
      </Link>
      
        <div className="dashboard-nav__right">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
              return (
                <Link
                    href={link.to}
                    className={
                        isActive
                            ? "nav-link active-link"
                            : "nav-link"
                    }
                    key={link.name}
                >
                    {link.name}
                </Link>
              );
            }
          )}
          <p>
            |
          </p>
          {/* <Popover
            content={notifications}
            title="Notifications"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1.8rem',
              }}
              icon={notificationsData.length > 0 ? <LuBellDot /> : <LuBell />}
              type="circle"
            ></Button>
          </Popover> */}
          {profileLoading ? <LoadingSpinner /> : (
            <>
              <Avatar
                src={profileImg}
              />
              <p className="dashboard-nav__user-name">
                {userName}
              </p>
            </>
          )}
        </div>
    </div>
  );
};

export default DashboardNav;