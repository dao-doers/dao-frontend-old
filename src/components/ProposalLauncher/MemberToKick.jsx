/* IMPORTS */
// Config
import { TextField } from '@material-ui/core';
import React from 'react';
// Components
import './style.css';

export default function ({ memberToKick, handleChanges }) {
  return (
    <div className="section">
      <TextField
        className="input"
        InputLabelProps={{ style: { pointerEvents: 'auto' } }}
        name="memberToKick"
        id="memberToKick"
        value={memberToKick.address}
        onChange={handleChanges}
        variant="outlined"
        type="text"
        label="Member"
        helperText={
          <label className="sectionLabel">
            Member
            {memberToKick.validated ? (
              <span className="validAddress"> -validated address</span>
            ) : (
              <span className="invalidAddress"> -invalid address</span>
            )}
          </label>
        }
      />
    </div>
  );
}
