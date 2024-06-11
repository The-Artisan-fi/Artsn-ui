import { useEffect, useState } from "react";
import { UPDATE_USER_IDV_ID} from "@/lib/mutations";
import { useMutation } from "@apollo/client";


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

export default function OndatoWrapper({ publicKey, fullName, dob, address, handleSuccessPending }: OnfidoProps ) {
  const [idvId, setIdvId] = useState<String | null>(null);
  const [updateUserIdvId, { loading, error, data }] = useMutation(UPDATE_USER_IDV_ID);
  if(!loading && !error && data) {
    console.log('data', data);
  }
  if(loading) {
    console.log('loading', loading);
  }
  if(error) {
    console.log('error', error);
  }

    const getIdvId = async () => {

      const firstName = 'Jane';
      const lastName = 'Doe';
      const middleName = '';
      const personalCode = '1234567890';
      const phoneNumber = '1234567890';
      const countryCode = 'GBR';
      const email = 'johndoe@gmail.com';
      console.log('pinging idv api')
      try{
          const response = await fetch('/api/ondato/idv/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dob,
              email,
              firstName,
              lastName,
              middleName,
              personalCode,
              phoneNumber,
              countryCode
            }),
          });
          const data = await response.json();
         
          console.log('idv data', data);
          setIdvId(data.idv_id);

          return data.idv_id;
      } catch (error) {
        console.log('error', error);
      }
    }

    useEffect(() => {
      if (idvId !== null) {
        getIdvId().then((id) => {
          updateUserIdvId({
            variables: {
              wallet: publicKey,
              idvId: id,
            },
          });
        });
      }
    }, []);
  
    return (
      <div
>
        {
          idvId != null ? (
            <iframe
              // display it full screen for now
              style={{
                zIndex: 1000,
                width: '100%',
                height: '100%',    
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'white',
              }}
              onAbort={() => {
                setIdvId(null);
              }}
              src={`https://sandbox-idv.ondato.com/?id=${idvId}`}
            />
          ) : (
            <button 
              onClick={getIdvId}
              className="btn btn-primary"
            >
              Verify your identity
            </button>
          )
        }
      </div>
    );
};  