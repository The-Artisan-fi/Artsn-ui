

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
    handleComplete: () => void;
};

export default function OnfidoModal({ publicKey, applicantId, applicantToken, workflowId, handleClose, handleComplete }: OnfidoProps) {
    const [updateUserOnfido, { loading, error, data }] = useMutation(UPDATE_USER_ONFIDO);
    console.log('publicKey', publicKey);
    console.log('workflow id', workflowId);
    async function handleSuccess() {
        console.log('updating user onfido')
        // submit applicant id, workflow id to db by finding publickey
        updateUserOnfido({
            variables: {
                wallet: publicKey,
                onfidoWorkflowRunId: workflowId,
            },
        });
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
    useEffect(() => {
        console.log('executing onfido')
    if (applicantToken !== "") {
        const onfido =
        Onfido.init({
          token: applicantToken,
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
            // handleClose();
            if (error.type === "expired_token") {
              console.log("error type is expired_token");
            }
          },
        }); 
        return () => {
            onfido.tearDown();
        };
        
        }
    }
    , [applicantToken, workflowId, handleClose]);

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
