

import { Onfido } from "onfido-sdk-ui";
import { useEffect, useState } from "react";
import { UPDATE_USER_ONFIDO } from "@/lib/mutations";
import { useMutation } from "@apollo/client";

type OnfidoProps = {
    publicKey: string;
    applicantId: string;
    applicantToken: string;
    workflowId: string;
    handleClose: () => void;
    handleCloseRetry: () => void;
    handleComplete: () => void;
};

export default function OnfidoModal({ publicKey, applicantId, applicantToken, workflowId, handleClose, handleCloseRetry, handleComplete }: OnfidoProps) {
    const [updateUserOnfido, { loading, error, data }] = useMutation(UPDATE_USER_ONFIDO);
    const [applicantLoading, setApplicantLoading] = useState(false);
    const [onfidoMount, setOnfidoMount] = useState(false);
    console.log('publicKey', publicKey);
    console.log('workflow id', workflowId);
    async function handleSuccess() {
        console.log('updating user onfido in database')
        // submit applicant id, workflow id to db by finding publickey
        // updateUserOnfido({
        //     variables: {
        //         wallet: publicKey,
        //         onfidoWorkflowRunId: workflowId,
        //     },
        // });
        if(loading && !error && !data) {
            console.log('loading')
        }
        if(!loading && !error && data) {
            handleComplete();
        }
        if(error) {
            console.log('error', error)
        }
    };


    async function handleGetNewToken() {
      try {
        const applicantDetails = {
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
        };
        const applicantIDFetch = await fetch('/api/onfido/create/applicant', {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: applicantDetails.first_name,
                last_name: applicantDetails.last_name,
                dob: applicantDetails.dob,
                address: {
                    building_number: applicantDetails.address.building_number,
                    street: applicantDetails.address.street,
                    town: applicantDetails.address.town,
                    postcode: applicantDetails.address.postcode,
                    country: applicantDetails.address.country,
                },
            
            })
            // JSON.stringify({
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

                
            // }),
        });
        const _data = await applicantIDFetch.json();
        console.log('applicant id', _data.id)
        if(_data.id){
          const applicantId = _data.id;
          console.log('applicant id *****', applicantId)
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
          console.log('applicant token', data.token)
          return data.token;
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    }

    const initOnfido = async (token: string) => {
      console.log('init onfido with token : ', token)
        const onfido =
        Onfido.init({
          token: token,
          containerId: "onfido-mount",
          workflowRunId: workflowId,
            // steps: [
            //     {
            //         type: 'welcome',
            //         options: {
            //             title: 'Verify your identity',
            //             descriptions: [
            //                 'To open an account with us, we need to verify your identity.',
            //                 'This should only take a few minutes.'
            //             ],
            //             nextButton: 'Start verification'
            //         }
            //     },
            //     'document',
            //     'face',
            //     'complete'
            // ],
          onComplete: function (data) {
            console.log("everything is complete", data);
            const userData = JSON.stringify(data);
            console.log('userData', userData);
            handleSuccess();
          },
          onError: function (error) {
            console.log("something went wrong", error);
            // handleCloseRetry();
            handleClose();
            // if (error.type === "invalid_token") {
            //   handleGetNewToken().then((token) => {
            //     initOnfido(token);
            //   });
            // }
          },
        });

      if(onfido) {
        setOnfidoMount(true);
      }
    }
        

    useEffect(() => {
        console.log('executing onfido')
        setApplicantLoading(true);
        initOnfido(applicantToken);
    }, []);

    return (
        <div id="onfido-mount" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            zIndex: 1000,
        }}></div>
    );
}
