'use client'
import '@/styles/DashboardInventory.scss';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Table  = dynamic(() => import('antd').then((mod) => mod.Table), { ssr: false });
import KycModal from '@/components/AdminDashboard/Modal/KycModal';
import ApplicantModal from '@/components/AdminDashboard/Modal/ApplicantModal';
import { auth } from '@/lib/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { retrieveAllApplicants } from './functions';

const KycPage = () => {
  const { publicKey } = useWallet();
  const [applicant, setApplicant] = useState({} as any);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [allWorkflowRuns, setAllWorkflowRuns] = useState([]);
  const [allApplicants, setAllApplicants] = useState([] as any[]);
  const [displayAllApplicants, setDisplayAllApplicants] = useState(false);

  const handleKycModalClose = () => {
    setShowKycModal(false);
    setApplicant({});
  }

  const handleApplicantModalClose = () => {
    setShowApplicantModal(false);
    setApplicant({});
  }

  const worfklow_runs_columns = [
    {
      title: '',
      dataIndex: 'no',
      key: 'no',
  
      width: 10,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      
      render: (text: any, record: { output: { first_name: any; last_name: any; }; }) => (
        <p>{`${record.output.first_name} ${record.output.last_name}`}</p>
      ),
    },
    {
      title: 'Workflow Run ID',
      dataIndex: 'workflow_run_id',
      key: 'workflow_run_id',

      render: (
        text: string,
        record: { id: string; }
      ) => (
        <p> 
          {`${record.id.substring(0, 5)}...${record.id.substring(record.id.length - 5)}`}
        </p>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
  
      render: (
        text: string,
        record: { created_at: string; }
      ) => {
        return(
          <p>
            {`${new Date(record.created_at).toLocaleDateString()}`}
          </p>
        )
      },
    },
  
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
  
      render: (
        text: string,
        record: { status: string; }
      ) => {
        return (
          <p>
            {record.status === 'approved' ? '✅' : record.status === 'processing' ? '💬' : '❌' }  
          </p>
        );
      },
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
  
      render: (
        text: string,
        record: { workflow_run_id: string; }
      ) => {
        return (
          <button 
            onClick={() =>{
            //  getWorkRunData(record.workflow_run_id)
            setApplicant(record);
            setShowKycModal(true);
            }}
            className='btn-primary'
          >
            View
          </button>
        );
      },
    },
  ];
  const all_applicant_columns = [
    {
      title: '',
      dataIndex: 'no',
      key: 'no',
  
      width: 10,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
  
      render: (
        text: string,
        record: { first_name: string; last_name: string; }
      ) => (
        <p>{`${record.first_name} ${record.last_name}`}</p>
      ),
    },
    {
      title: 'Applicant ID',
      dataIndex: 'applicant_id',
      key: 'applicant_id',

      render: (
        text: string,
        record: { id: string; }
      ) => (
        <p> 
          {`${record.id.substring(0, 5)}...${record.id.substring(record.id.length - 5)}`}
        </p>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
  
      render: (
        text: string,
        record: { created_at: string; }
      ) => {
        return(
          <p>
            {`${new Date(record.created_at).toLocaleDateString()}`}
          </p>
        )
      },
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
  
      render: (
        text: string,
        record: { id: string; }
      ) => {
        return (
          <button 
            onClick={() =>{
              setApplicant(record);
              setShowApplicantModal(true);
            }}
            className='btn-primary'
          >
            View
          </button>
        );
      },
    },
  ];

  // async function getWorkRunData() {
  //   const data = await retrieveAllWorkflowRuns();
  //   setAllWorkflowRuns(data);
  //   return data;
  // }

  async function getAllApplicants() {
    const data = await retrieveAllApplicants();
    setAllApplicants(data.applicants);
    return data;
  }

  // useEffect(() => {
  //   retrieveWorkflowRun('6e8466ca-b875-4dc6-b534-42c639800dd5').then((data) => {
  //     console.log('sample data', data)
  //   });
  //   if(!displayAllApplicants) {
  //     getWorkRunData()
  //   } else if (displayAllApplicants){
  //     getAllApplicants();
  //   }
  // }, [displayAllApplicants]);

  return (
    <>
      {publicKey 
        // && publicKey.toString() === auth 
        ? (
        <div className="wallet">
          <div className="dashboard-inventory__body">
            <div
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px', marginBottom: '20px'}}
            >
              <button
                className='btn-primary'
                onClick={()=> setDisplayAllApplicants(false)}
              >
                All Workflow Runs
              </button>
              <button
                className='btn-primary'
                onClick={()=> setDisplayAllApplicants(true)}
              >
                All Applicants
              </button>
            </div>
              <Table
                style={{
                  border: '1px solid #3d3d3d',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#1e1e22',
                }}
                // size="medium"
                scroll={{ x: 'max-content' }}
                // bordered={true}
                dataSource={!displayAllApplicants ? allWorkflowRuns : allApplicants}
                // @ts-expect-error - antd table types are incorrect
                columns={!displayAllApplicants ? worfklow_runs_columns : all_applicant_columns}
                // lazy={true}
              />
              {showKycModal && applicant && (
                <KycModal
                  applicant={applicant}
                  onClose={handleKycModalClose}
                />
              )}
              {showApplicantModal && applicant && (
                <ApplicantModal
                  applicant={applicant}
                  onClose={handleApplicantModalClose}
                />     
              )}
            </div>
        </div>
      ) : (
        <div className="wallet">
          <div className="wallet__content">
            <div className="wallet__content__header">
              <h1>Unauthorized</h1>
              <p>You are not authorized to view this page</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KycPage;