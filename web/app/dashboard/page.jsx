'use client';
import React, { useState } from 'react';
import '../../styles/DashboardInventory.scss';

import { Radio, Table } from 'antd';
import { FiArrowUpRight } from 'react-icons/fi';

import { Line } from '@ant-design/plots';

// Graph configurations

const optionsWithDisabled = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
];

const data = [
  { day: 'Mo', value: 3 },
  { day: 'Tu', value: 4 },
  { day: 'Wed', value: 3.5 },
  { day: 'Th', value: 5 },
  { day: 'Fr', value: 4.2 },
  { day: 'Sa', value: 4.8 },
  { day: 'Su', value: 3.7 },
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

// table configurations and data
const dataSource = [
  {
    key: 1,
    no: 1,
    item: 'Item 1',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 264,
    amount: 7314,
  },
  {
    key: 2,
    no: 2,
    item: 'Item 2',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 492,
    amount: 2451,
  },
  {
    key: 3,
    no: 3,
    item: 'Item 3',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 716,
    amount: 5963,
  },
  {
    key: 4,
    no: 4,
    item: 'Item 4',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 275,
    amount: 8532,
  },
  {
    key: 5,
    no: 5,
    item: 'Item 5',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 809,
    amount: 4144,
  },
  {
    key: 6,
    no: 6,
    item: 'Item 6',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 188,
    amount: 1360,
  },
  {
    key: 7,
    no: 7,
    item: 'Item 7',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 460,
    amount: 1878,
  },
  {
    key: 8,
    no: 8,
    item: 'Item 8',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 892,
    amount: 8100,
  },
  {
    key: 9,
    no: 9,
    item: 'Item 9',
    title: 'Audemars Piguet Royal Oak Extra Thin, 2019',
    value: 935,
    amount: 6213,
  },
  {
    key: 10,
    no: 10,
    item: 'Item 10',
    title: 'Title 10',
    value: 358,
    amount: 6324,
  },
];

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
      <img
        width={40}
        height={40}
        src="/assets/home/products/Audemars-piguet-Royaloak.webp"
        alt=""
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

    render: (text, record) => <p>{`${text}ETH`}</p>,
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
        <button className="btn-table">See</button>
        <button className="btn-table">Buy More</button>
        <button className="btn-table">Trade</button>
      </div>
    ),
  },
];

const Dashboard = () => {
  const [value4, setValue4] = useState('Weekly');

  const onChange4 = ({ target: { value } }) => {
    console.log('radio4 checked', value);
    setValue4(value);
  };

  return (
    <div className="dashboard-inventory">
      <div className="dashboard-inventory__top">
        <div className="dashboard-inventory__top__graph">
          <div className="dashboard-inventory__top__graph__head">
            <p className="caption-2">Wallet Value</p>
            <Radio.Group
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
            <img
              src="/assets/home/products/Audemars-piguet-Royaloak.webp"
              className="item-img"
              alt=""
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
            <img
              src="/assets/home/products/Audemars-piguet-Royaloak.webp"
              className="item-img"
              alt=""
            />
            <p className="p-4">Fraction Value</p>
          </div>
          <p className="caption-2">
            Audemars Piguet Royal Oak Extra Thin, 2019
          </p>
        </div>
      </div>
      <div className="dashboard-inventory__body">
        <Table
          style={{
            border: '1px solid #3d3d3d',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
          size="medium"
          scroll={{ x: 'max-content' }}
          // bordered={true}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default Dashboard;