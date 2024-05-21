import { useState, uesEffect } from "react";

type ApplicantModalProps = {
  onClose: () => void;
  applicant: any;
};

export default function ApplicantModal({ onClose, applicant }: ApplicantModalProps) {
    
    return (
        <div
            // this will be the overlay div that the modal will be rendered on
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >   
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '70vw',
                    height: '300px',
                    padding: '20px',
                    border: '1px solid black',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    zIndex: 1000,
                    position: 'fixed',
                    top: '30vh',
                    left: '15vw',
                }}
            >
                <div>
                    <h1>{`${applicant.first_name} ${applicant.last_name}`}</h1>
                    <p>{`Date of Birth: ${applicant.dob}`}</p>
                    <p>{`Address: ${applicant.address.building_number} ${applicant.address.street}, ${applicant.address.town}, ${applicant.address.postcode}   `}</p>
                </div>
                <div>
                    <p>{`Created At: ${new Date(applicant.created_at)}`}</p>
                </div>
                <div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}