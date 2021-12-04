/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';

import TextField from '@material-ui/core/TextField';
import { MenuItem } from '@material-ui/core';
import IconWithTooltip from 'components/IconWithTooltip/IconWithTooltip';

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
              <IconWithTooltip title="tributeOffered means .." />
            </div>
          }
        />
      </div>
      <div className="section">
        <TextField
          className="input"
          name="tributeToken"
          helperText={
            <label className={tributeToken === '0x0' ? 'sectionLabel emptyAddress' : 'sectionLabel'}>
              Tribute offered
            </label>
          }
          select
          variant="outlined"
          placeholder=" Tribute token"
          label="Tribute token"
          value={tributeToken}
          onChange={handleChanges}
        >
          <MenuItem value={defaults.EMPTY} disabled>
            Select tribute token
          </MenuItem>
          {availableTokens.map((t, i) => {
            return (
              <MenuItem key={i} value={t.tokenAddress}>
                {t.symbol}
              </MenuItem>
            );
          })}
        </TextField>
      </div>
    </>
  );
}
