import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { get } from "http";
import { Onfido } from "onfido-sdk-ui";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import OnfidoModal from "./Onfido";

type OnfidoProps = {
  publicKey: string;
  handleSuccessPending: () => void;
};

export default function OnfidoWrapper({ publicKey, handleSuccessPending }: OnfidoProps ) {
  const [applicantId, setApplicantId] = useState<string>('');
  const [workflowId, setWorkflowId] = useState<string>('');
  const [applicantToken, setApplicantToken] = useState<string>('');
  const [applicantLoading, setApplicantLoading] = useState<boolean>(true);
  const [renderOnfido, setRenderOnfido] = useState<boolean>(false);
  const [onfidoSuccess, setOnfidoSuccess] = useState<boolean>(false);
  const test_token = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3MTYyMzQzNTYsInBheWxvYWQiOnsiYXBwIjoiNDM1NTM5YzgtMzg5MC00NGJjLWE0MDktZDA1ZmIwNjA4ZjRhIiwiY2xpZW50X3V1aWQiOiI2ZjE1Y2ZjNS0xZTc1LTRkNGItOWViMy1jMjM1YzEyODk4NTYiLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOnRydWUsImlzX3RyaWFsIjp0cnVlLCJyZWYiOiJodHRwczovLyoubG9jYWxob3N0OjMwMDAvKiIsInNhcmRpbmVfc2Vzc2lvbiI6IjFmZjQ3NzE0LTFlOTktNGUxMi1hZDc5LWIzYTRhY2Y5YmU0YyJ9LCJ1dWlkIjoicGxhdGZvcm1fc3RhdGljX2FwaV90b2tlbl91dWlkIiwidXJscyI6eyJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsInRlbGVwaG9ueV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIBdzx2HrOVaRokRQHvcFXDb2X1aR7dD5SKtR481su0t7CfiXRSd3smc5z6HliGscB8CHvIqNUAO6kbmqyck9Ff26oCQgDiO2569MxHDuafuYj4wQOhKLALekojzG6JCTHu-bMaWB7SdE4sieH2oWJPymJ4cUGuqrcIirAPGwZW1vGS5ESr_Q';
  const getApplicatantId = async () => {
        const response = await fetch('/api/onfido/create/applicant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: 'Jane',
                last_name: 'Doe',
                dob: '1990-01-31',
                address: {
                    building_number: '100',
                    street: 'Main Street',
                    town: 'London',
                    postcode: 'SW4 6EH',
                    country: 'GBR',
                },
            }),
        });
        const data = await response.json();
        setApplicantId(data.id);
        return data.id;
    };

    const getWorkflowId = async (applicant: string) => {
      const response = await fetch('/api/onfido/create/workflow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicant_id: applicant,
                }),
            });
            const data = await response.json();
            setWorkflowId(data.id);
            return data.id;
    };

    const getApplicantToken = async () => {
      const applicant_id = await getApplicatantId();
      const workflow_id = await getWorkflowId(applicant_id);
      const response = await fetch('/api/onfido/create/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: applicant_id,
        }),
      });
      const data = await response.json();
      setApplicantToken(data.token);
      return data.token;
    }
    useEffect(() => {
      if(applicantId === '' && applicantLoading) {
        getApplicantToken().then((token) => {
          setApplicantLoading(false)
        });
      }
    }, [applicantId]);

    useEffect(() => {
      if(
        applicantToken !== '' &&
        workflowId !== '' &&
        !applicantLoading
      ) {
        setRenderOnfido(true);
        }
    }, [applicantToken]);
  
    return (
      <div
        style={{
          zIndex: 1000,
          width: 'fit-content',
          height: '100%',    
          position: renderOnfido ? 'fixed' : 'relative',
          display: 'flex',
          top: renderOnfido ? 0 : 'none ',
          left: renderOnfido ? 0 : 'auto',
        }}
      >
        <button 
          onClick={()=> setRenderOnfido(!renderOnfido)} 
          className={renderOnfido ? '' : 'btn-primary'}
          style={{
            zIndex: 1200, 
            marginBottom: 15, 
            position: renderOnfido ? 'fixed' : 'relative',
            top: renderOnfido ? 10 : 'none ',
            right: renderOnfido ? 20 : 'auto',
            border: renderOnfido ? 'none' : '1px solid #007bff',
            borderRadius: 4,
            padding: 10,
            cursor: 'pointer',
            backgroundColor: renderOnfido ? 'red' : '',
            color: 'white',
          }}
        >
          {renderOnfido ? 'X' : 'Verify'}
        </button>
        {renderOnfido && <OnfidoModal publicKey={publicKey} applicantId={applicantId} applicantToken={applicantToken} workflowId={workflowId}  handleClose={()=>setRenderOnfido(false)} handleComplete={()=> handleSuccessPending()}/>}
      </div>
    );
};  