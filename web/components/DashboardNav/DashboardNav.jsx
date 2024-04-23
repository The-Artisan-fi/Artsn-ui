'use client';

import '../../styles/DashboardNav.scss';
import Link from 'next/link';

import { useState } from 'react';
import { Button, Popover, Avatar, List } from 'antd';
import { LuBell } from 'react-icons/lu';
import { LuBellDot } from 'react-icons/lu';

const DashboardNav = () => {
  const [open, setOpen] = useState(false);

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

  return (
    <div className="dashboard-nav">
      <Link className="dashboard-nav__navbrand" href="/">
        <img
          className="dashboard-nav__navbrand__img"
          src="/assets/navbrand-full.webp"
        />{' '}
      </Link>
      <div className="dashboard-nav__right">
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
          src={'https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'}
        />
        <p className="dashboard-nav__user-name">Leo</p>
      </div>
    </div>
  );
};

export default DashboardNav;