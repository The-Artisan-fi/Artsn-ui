
type KycModalProps = {
  onClose: () => void;
  applicant: any;
};

export default function KycModal({ onClose, applicant }: KycModalProps) {
    // this will be a modal that will show the applicant's information

// applicant_id
// : 
// "b08c3b32-35a7-4da8-80ed-3c176efe364c"
// created_at
// : 
// "2024-05-20T23:46:52Z"
// dashboard_url
// : 
// "https://dashboard.onfido.com/results/a1c30fa5-6466-47e8-8876-62a834723b28"
// error
// : 
// null
// id
// : 
// "a1c30fa5-6466-47e8-8876-62a834723b28"
// link
// : 
// {completed_redirect_url: null, expired_redirect_url: null, expires_at: null, language: null, url: 'https://eu.onfido.app/l/a1c30fa5-6466-47e8-8876-62a834723b28'}
// output
// : 
// date_of_birth
// : 
// "1990-01-01"
// document_issuing_country
// : 
// "GBR"
// document_media_ids
// : 
// (2) [{…}, {…}]
// document_number
// : 
// "999999999"
// document_type
// : 
// "passport"
// first_name
// : 
// "Jane"
// last_name
// : 
// "Doe"
// selfie_media_ids
// : 
// [{…}]
// [[Prototype]]
// : 
// Object
// reasons
// : 
// []
// sdk_token
// : 
// null
// status
// : 
// "approved"
// tags
// : 
// []
// updated_at
// : 
// "2024-05-20T23:57:28Z"
// workflow_id
// : 
// "ceec3f2d-ad33-4797-bd45-c3cb8c721c02"
// workflow_version_id
// : 
// 1

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
                    <h1>{`${applicant.output.first_name} ${applicant.output.last_name}`}</h1>
                    <p>{`Date of Birth: ${applicant.output.date_of_birth}`}</p>
                    <p>{`Document Type: ${applicant.output.document_type}`}</p>
                    <p>{`Document Number: ${applicant.output.document_number}`}</p>
                    <p>{`Document Issuing Country: ${applicant.output.document_issuing_country}`}</p>
                    <p>{`Status: ${applicant.status}`}</p>
                </div>
                <div>
                    <p>{`Created At: ${new Date(applicant.created_at)}`}</p>
                    <p>{`Updated At: ${new Date(applicant.updated_at)}`}</p>
                </div>
                <div>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}