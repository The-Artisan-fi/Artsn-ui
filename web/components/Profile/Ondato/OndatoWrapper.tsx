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
  phoneNumber: string;
  email: string;
  handleSuccessPending: () => void;
  handleRetry: () => void;
};

export default function OndatoWrapper({ publicKey, fullName, dob, address, phoneNumber, email, handleSuccessPending }: OnfidoProps ) {
  const [idvId, setIdvId] = useState<String | null>(null);
  const [updateUserIdvId, { loading, error, data }] = useMutation(UPDATE_USER_IDV_ID);
  if(!loading && !error && data) {
    console.log('data', data);
    handleSuccessPending();
  }
  if(loading) {
    console.log('loading', loading);
  }
  if(error) {
    console.log('error', error);
  }

    const getIdvId = async () => {
      // check local storage for idv_id
      const artisan_idv_id = localStorage.getItem('artisan_idv_id'); // [idv_id, timestamp]
      // if it exists, and the timestamp is less than 24 hours old, return it
      // if (artisan_idv_id) {
      //   const idv_id = artisan_idv_id.split(',')[0];
      //   const timestamp = parseInt(artisan_idv_id.split(',')[1]);
      //   const now = Date.now();
      //   if (now - timestamp < 86400000) {
      //     console.log('returning idv_id from local storage');
      //     setIdvId(idv_id);
      //     return idv_id;
      //   }
      // }
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.split(' ')[1];
      const middleName = '';
      console.log('pinging idv api for new idv_id')
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
         
          console.log('idv data', data);
          


          if(data.idv_id !== null){
              // open https://sandbox-idv.ondato.com/?id=${idvId}` in a new tab
            window.open(`https://sandbox-idv.ondato.com/?id=${data.idv_id}`, '_blank');
            // set the data.idv_id to a localStorage item named artisan_idv_id as [data.idv_id, timestamp]
            localStorage.setItem('artisan_idv_id', `[${data.idv_id}, ${Date.now()}]`);
            
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
      }
    }
  
    return (
      <button 
        onClick={getIdvId}
        className="btn btn-primary"
      >
        Verify your identity
      </button>
    );
};  