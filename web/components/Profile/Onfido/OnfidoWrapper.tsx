import { Onfido } from "onfido-sdk-ui";
import { use, useEffect, useMemo, useState } from "react";
import OnfidoModal from "./Onfido";

type OnfidoProps = {
  publicKey: string;
  fullName: string;
  dob: string;
  address: {
    building_number: string;
    street: string;
    town: string;
    postcode: string;
    country: string;
  };  
  handleSuccessPending: () => void;
  handleRetry: () => void;
};

export default function OnfidoWrapper({ publicKey, fullName, dob, address, handleSuccessPending }: OnfidoProps ) {
  // const [applicantId, setApplicantId] = useState<string>('');
  // const [workflowId, setWorkflowId] = useState<string>('');
  // const [applicantToken, setApplicantToken] = useState<string>('');
//  create a useMemo to store the applicant token and workflow id and applicant id
  const _user_ids = useMemo(() => {
    return {
      applicantId: '',
      workflowId: '',
      applicantToken: '',
    }
  }, []);
  const [applicantLoading, setApplicantLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [renderOnfido, setRenderOnfido] = useState<boolean>(false);
  const [onfidoSuccess, setOnfidoSuccess] = useState<boolean>(false);
  const getApplicantId = async () => {
    try {
        const response = await fetch('/api/onfido/create/applicant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // first_name: fullName.split(' ')[0],
                // last_name: fullName.split(' ')[1],
                // dob: dob,
                // address: {
                //     building_number: address.building_number,
                //     street: address.street,
                //     town: address.town,
                //     postcode: address.postcode,
                //     country: address.country,
                // },
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
        console.log('applicant id', data.id)
        if(data.id){
          // setApplicantId(data.id);
          return data.id;
        } else {
          throw new Error('Error getting applicant id');
        }
      } catch (error) {
        console.log('error', error);
        setError(true);
      }
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
            // setWorkflowId(data.id);
            _user_ids.workflowId = data.id;
            // return data.id;
    };

    const getApplicantToken = async () => {
      if(applicantLoading) return;
      console.log('getting applicant token')
      const applicantId = await getApplicantId();
      if(applicantId == undefined) return;
      await getWorkflowId(applicantId);
      console.log('getting applicant token for :', applicantId)
      try{
          const response = await fetch('/api/onfido/create/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              applicant_id: applicantId,
            }),
          });
          const data = await response.json();
          console.log('applicant token on init', data.token)
          // setApplicantToken(data.token);
          _user_ids.applicantToken = data.token;
          if(
            data.token !== '' && 
            // workflow_id !== '' && 
            applicantId !== ''
          ) {
          setApplicantLoading(false);
          setRenderOnfido(true)
          return data.token;
        } else {
          throw new Error('Error getting token');
        }
      } catch (error) {
        console.log('error', error);
        setError(true);
      }
    }

    const handleRetry = () => {
      console.log('retrying onfido');
      setApplicantLoading(false);
      setRenderOnfido(false);
      setError(true);
    };

    // useEffect(() => {
    //   if(applicantId === '' && applicantLoading) {
    //     getApplicantToken().then((token) => {
    //       setApplicantLoading(false)
    //     });
    //   }
    // }, [applicantId]);

    useEffect(() => {
      getApplicantToken()
    }, [])

    useEffect(() => {
      if(
        _user_ids.applicantToken !== '' &&
        _user_ids.workflowId !== '' &&
        !applicantLoading
      ) {
        console.log('checking the following two values', _user_ids.applicantToken, _user_ids.workflowId)
        setRenderOnfido(true);
      }
    }, [_user_ids]);
  
    return (
      <div
        style={{
          zIndex: 1000,
          width: 'fit-content',
          height: '100%',    
          position: renderOnfido ? 'fixed' : 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          borderRadius: 4,
        }}
      >
        {error && !renderOnfido && <p>There was an error with the verification process. Please try again.</p>}
        <button 
          onClick={()=> {
            renderOnfido ? setRenderOnfido(false) : getApplicantToken();
          }}  
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
        {renderOnfido && 
          _user_ids.applicantToken !== '' &&
        <OnfidoModal
          publicKey={publicKey} 
          applicantId={'111'} 
          applicantToken={_user_ids.applicantToken} 
          workflowId={_user_ids.workflowId}  
          handleClose={()=>setRenderOnfido(false)} 
          handleCloseRetry={()=>handleRetry()} 
          handleComplete={()=> handleSuccessPending()}
        />}
      </div>
    );
};  