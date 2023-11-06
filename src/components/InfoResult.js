import React from 'react';

function InfoResult({ infoResult }) {
  // Just display the result passed as a prop
  return (
    <div>
      {infoResult && (
        <div>
          <p>Target Info:</p>
          <p>{infoResult}</p>
        </div>
      )}
    </div>
  );
}

export default InfoResult;
