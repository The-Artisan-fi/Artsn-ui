'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// arrow left and arrow right

import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

// inventory icons
import { IoGrid } from 'react-icons/io5';
import { IoGridOutline } from 'react-icons/io5';

// profile icons
import { IoPerson } from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';

// wallet icon
import { IoWallet } from 'react-icons/io5';
import { IoWalletOutline } from 'react-icons/io5';

// settings icon
// import { IoSettings } from 'react-icons/io5';
// import { IoSettingsOutline } from 'react-icons/io5';

import { Layout, Menu, Button } from 'antd';
const { Header, Sider, Content } = Layout;
const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [activeTabTitle, setActiveTabTitle] = useState('Admin');
  const router = useRouter();
  const currentPath = usePathname();
  const handleMenuSelect = ({ key, item }) => {
    setSelectedKeys([key]);
    setActiveTabTitle(item.props.title);

    console.log(key, item);

    // Get the URL based on the selected key
    let url;
    switch (key) {
      case '1':
        url = '/admin';
        break;
      case '2':
        url = '/admin/admin';
        break;
      case '3':
        url = '/admin/kyc';
        break;
      case '4':
        url = '/admin/token';
        break;
      default:
        url = '/';
    }

    // Navigate to the selected URL
    router.push(url);
  };

  useEffect(() => {
    if (currentPath === '/admin') {
      setSelectedKeys(['1']);
      setActiveTabTitle('Profile');
    } else if (currentPath === '/admin/create') {
      setSelectedKeys(['2']);
      setActiveTabTitle('Create Admin');
    } else if (currentPath === '/admin/token') {
      setSelectedKeys(['3']);
      setActiveTabTitle('Create Token');
    } else if (currentPath === '/dashboard/kyc') {
      setSelectedKeys(['4']);
      setActiveTabTitle('KYC');
    }
  }, [currentPath]);
  return (
    <Layout style={{ height: '100%', backgroundColor: '#17171b' }}>
      <Sider
        style={{ backgroundColor: '#17171b' }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          style={{ backgroundColor: '#17171b' }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={handleMenuSelect}
          selectedKeys={selectedKeys}
          items={[
            {
              key: '1',
              icon: selectedKeys.includes('1') ? <IoGrid /> : <IoGridOutline />,
              label: 'Profile',
              title: 'Profile',
            },
            {
              key: '2',
              icon: selectedKeys.includes('2') ? <IoGrid /> : <IoGridOutline />,
              label: 'Create Admin',
              title: 'Create Admin',
            },
            {
              key: '3',
              icon: selectedKeys.includes('3') ? (
                <IoWallet />
              ) : (
                <IoWalletOutline />
              ),
               
              label: 'Create Token',
              title: 'Create Token',
            },
            {
              key: '4',
              icon: selectedKeys.includes('4') ? (
                <IoPerson />
              ) : (
                <IoPersonOutline />
              ),
              label: 'KYC',
              title: 'KYC',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#17171b',
          }}
        >
          <>
            <Button
              type="text"
              icon={collapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                height: 64,
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {activeTabTitle}
            </Button>
          </>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            backgroundColor: '#17171b',
            overflowY: 'scroll',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default DashboardLayout;