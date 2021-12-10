/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';

import TextField from '@material-ui/core/TextField';
import TooltipWithChildren from 'components/TooltipWithChildren/TooltipWithChildren';
import { createTheme, MenuItem, ThemeProvider } from '@material-ui/core';

export default function ({ availableTokens, tributeToken, tributeOffered, handleChanges, helperText, error }) {
  const theme = createTheme({
    zIndex: {
      modal: 999999,
    },
  });

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
          variant="outlined"
          type="number"
          label={
            <div style={{ display: 'flex' }}>
              tribute Offered
              <TooltipWithChildren title="the number of CKB tokens offered. Preferred with no decimals." />
            </div>
          }
          onKeyPress={event => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          error={tributeToken === '0x0' || !tributeToken || error}
          helperText={(tributeToken === '0x0' ? 'Empty address | Tribute offered' : null) || helperText}
          InputProps={{ inputProps: { min: 0, step: 1 } }}
        />
      </div>
      <div className="section">
        <ThemeProvider theme={theme}>
          <TextField
            className="input"
            name="tributeToken"
            helperText={tributeToken === '0x0' ? 'Empty address' : null}
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
        </ThemeProvider>
      </div>
    </>
  );
}
