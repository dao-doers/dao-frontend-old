/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';

import TextField from '@material-ui/core/TextField';
import TooltipWithChildren from 'components/TooltipWithChildren/TooltipWithChildren';

export default function ({ availableTokens, tributeToken, tributeOffered, handleChanges }) {
  return (
    <>
      <div className="section">
        <TextField
          className="input"
          InputLabelProps={{ style: { pointerEvents: 'auto' } }}
          name="tributeOffered"
          id="tributeOffered"
          value={tributeOffered}
          onChange={handleChanges}
          placeholder="0.00"
          variant="outlined"
          type="number"
          label={
            <div style={{ display: 'flex' }}>
              tributeOffered
              <TooltipWithChildren title="tributeOffered means .." />
            </div>
          }
          onKeyPress={event => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
      </div>
      <div className="section">
        <select
          className="select-css input"
          name="tributeToken"
          placeholder=" Tribute token"
          value={tributeToken}
          onChange={handleChanges}
        >
          <option value={defaults.EMPTY} disabled>
            Select tribute token
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
