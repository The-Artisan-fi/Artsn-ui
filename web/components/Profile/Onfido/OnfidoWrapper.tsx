import { Onfido } from "onfido-sdk-ui";
import { use, useEffect, useMemo, useState } from "react";
import OnfidoModal from "./Onfido";
import * as IdvSdk from 

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

IdvSdk.load({
  mode: IdvSdkMode.Sandbox,
  onSuccess: (props) => console.log('onSuccess', props),
  onFailure: (props) => console.log('onFailure', props),
  onClose: () => console.log('onClose'),
});
  
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