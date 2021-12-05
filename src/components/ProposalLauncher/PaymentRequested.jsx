/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';
import TextField from '@material-ui/core/TextField';
import TooltipWithChildren from 'components/TooltipWithChildren/TooltipWithChildren';

export default function ({ availableTokens, paymentToken, paymentRequested, handleChanges }) {
  return (
    <>
      <div className="section">
        <TextField
          className="input"
          InputLabelProps={{ style: { pointerEvents: 'auto' } }}
          name="paymentRequested"
          id="paymentRequested"
          value={paymentRequested}
          onChange={handleChanges}
          placeholder="payment Requested"
          variant="outlined"
          type="number"
          label={
            <div style={{ display: 'flex' }}>
              Payment requested
              <TooltipWithChildren title="paymentRequested means .." />
            </div>
          }
        />
      </div>
      <div className="section">
        <select
          className="select-css input"
          name="paymentToken"
          placeholder=" Tribute token"
          value={paymentToken}
          onChange={handleChanges}
        >
          <option value={defaults.EMPTY} disabled>
            Select payment token
          </option>
          {availableTokens.map((t, i) => (
            <option key={i} value={t.tokenAddress}>
              {t.symbol}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
