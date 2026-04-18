

export default function Banner({ clientData, className }) {

  // displays profile picture, name, and quick reference info 
  // can add resource and note
  return (
    <div className={`banner ${className}`}>
      <h2>{clientData?.firstName} {clientData?.lastName}</h2>
      <p>Client ID: {clientData?.clientId}</p>
      <p>Status: {clientData?.status}</p>
    </div>
  );
}