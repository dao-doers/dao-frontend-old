/* IMPORTS */
// Config
import React from 'react';
// Components
import './style.css';
import TextField from '@material-ui/core/TextField';

export default function ({ applicant, handleChanges }) {
  return (
    <div className="section">
      <TextField
        className="input"
        InputLabelProps={{ style: { pointerEvents: 'auto' } }}
        name="applicant"
        id="applicant"
        value={applicant.address}
        onChange={handleChanges}
        placeholder="0.00"
        variant="outlined"
        type="text"
        label={
          <label className="sectionLabel">
            Applicant
            {applicant.validated ? (
              <span  className="validAddress"> -validated address</span>
            ) : (
              <span className="invalidAddress"> -invalid address</span>
            )}
          </label>
        }
      />
    </div>
  );
}
