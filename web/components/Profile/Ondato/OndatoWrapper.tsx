import { useState } from "react";
import { UPDATE_USER_IDV_ID} from "@/lib/mutations";
import { useMutation } from "@apollo/client";
import { toastError } from "@/helpers/toast";

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
  phoneNumber: string;
  email: string;
  handleSuccessPending: () => void;
  handleRetry: () => void;
};

export default function OndatoWrapper({ publicKey, fullName, dob, address, phoneNumber, email, handleSuccessPending }: OnfidoProps ) {
  const [idvId, setIdvId] = useState<String | null>(null);
  const [updateUserIdvId, { loading, error, data }] = useMutation(UPDATE_USER_IDV_ID);
  if(!loading && !error && data) {
    handleSuccessPending();
  }
  if(loading) {
    console.log('loading', loading);
  }
  if(error) {
    console.log('error', error);
    toastError('Error verifying identity');
  }
    const getFreshIdvId = async () => {
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.split(' ')[1];
      const middleName = '';
      
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
            phoneNumber,
            address,
          }),
        });
        const data = await response.json();

        if(data.idv_id !== null){
            // open https://sandbox-idv.ondato.com/?id=${idvId}` in a new tab
          window.open(`https://sandbox-idv.ondato.com/?id=${data.idv_id}`, '_blank');
          // set the data.idv_id to a localStorage item named artisan_idv_id as [data.idv_id, timestamp]
          localStorage.setItem('artisan_idv_id', `[${data.idv_id}, ${Date.now()}, ${publicKey.toString()}]`);
          
          setIdvId(data.idv_id);

          updateUserIdvId({
            variables: {
              wallet: publicKey,
              idvId: data.idv_id,
            },
          });

          return data.idv_id;
        } else {
          throw new Error('idv_id is null');
        }
      } catch (error) {
        console.log('error', error);
        toastError('Error verifying identity');
      }
    };
    

    const getIdvId = async () => {
      const artisan_idv_id = localStorage.getItem('artisan_idv_id'); // [idv_id, timestamp, publicKey]
      if (artisan_idv_id) {
        const idv_id = artisan_idv_id.split(',')[0];
        const timestamp = parseInt(artisan_idv_id.split(',')[1]);
        const _publicKey = artisan_idv_id.split(',')[2];
        const now = Date.now();
        if (now - timestamp < 86400000 && publicKey.toString() === _publicKey) {
          setIdvId(idv_id);
          return idv_id;
        }
      } else {
        getFreshIdvId();
      }
    };
     
    return (
      <button 
        onClick={getIdvId}
        className="btn btn-primary"
      >
        Verify your identity
      </button>
    );
};  