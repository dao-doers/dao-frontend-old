/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import './style.css';
import TextField from '@material-ui/core/TextField';
import TooltipWithChildren from 'components/TooltipWithChildren/TooltipWithChildren';

export default function ({ sharesRequested, handleChanges }) {
  return (
    <div className="section">
      <TextField
        className="input"
        InputLabelProps={{ style: { pointerEvents: 'auto' } }}
        name="sharesRequested"
        id="sharesRequested"
        value={sharesRequested}
        onChange={handleChanges}
        placeholder="0.00"
        variant="outlined"
        type="number"
        label={
          <div style={{ display: 'flex' }}>
            sharesRequested
            <TooltipWithChildren title="shares Requested means we have to estimate how  .." />
          </div>
        }
      />
    </div>
  );
}
