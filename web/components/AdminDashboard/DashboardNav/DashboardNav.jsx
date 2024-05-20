'use client';

import '@/styles/DashboardNav.scss';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Popover, Avatar, List } from 'antd';
import { LuBell } from 'react-icons/lu';
import { LuBellDot } from 'react-icons/lu';
import { useLazyQuery } from "@apollo/client";
import { userProfileBasic } from "@/lib/queries";
import { checkLogin } from "@/components/Web3Auth/solanaRPC";
const DashboardNav = () => {
  const [open, setOpen] = useState(false);
  const { publicKey } = useWallet();
  const [variables, setVariables] = useState({ wallet: ''});
  const [profileImg, setProfileImg] = useState('');
  const [userName, setUserName] = useState('');
  const [getDetails, { loading, error, data }] = useLazyQuery(userProfileBasic , {variables});
  if(!loading && data != undefined && profileImg == ''){
    setProfileImg(data.users[0].profileImg);
    setUserName(data.users[0].userName);
  }
  if(!loading && error != undefined){
      console.log("error", error);
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

  const notifications = (
    <List
      dataSource={notificationsData}
      renderItem={(item) => <List.Item key={item.id}>{item.text}</List.Item>}
    />
  );

  // useEffect(() => {
  //   if(publicKey){
  //     setVariables({wallet: publicKey.toBase58()});
  //     getDetails();
  //   } else {
  //       checkLogin().then((res) => {
  //         if(res){
  //           if(res.account){
  //             setVariables({wallet: res.account});
  //             getDetails();
  //           }
  //         }
  //     });
  //   }
  // }, []);

  return (
    <div className="dashboard-nav">
      {/* <Link className="dashboard-nav__navbrand" href="/">
        <img
          className="dashboard-nav__navbrand__img"
          src="/assets/navbrand-full.webp"
        />{' '}
      </Link> */}
      {/* <div className="dashboard-nav__right">
        <Popover
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
        </Popover>
        <Avatar
          src={profileImg}
        />
        <p className="dashboard-nav__user-name">
          {userName}
        </p>
      </div> */}
    </div>
  );
};

export default DashboardNav;