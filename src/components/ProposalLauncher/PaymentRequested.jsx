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

export default function ({ availableTokens, paymentToken, paymentRequested, handleChanges }) {
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
              <TooltipWithChildren title="A payment request is a hyperlink, sent to a buyer by a seller" />
            </div>
          }
          InputProps={{ inputProps: { min: 0 } }}
        />
      </div>
      <div className="section">
        <ThemeProvider theme={theme}>
          <TextField
            className="input"
            name="paymentToken"
            helperText={paymentToken === '0x0' ? 'No payment token' : null}
            select
            variant="outlined"
            placeholder="Tribute token"
            label="Payment Token"
            value={paymentToken}
            onChange={handleChanges}
          >
            <MenuItem value={defaults.EMPTY} disabled>
              Select payment token
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
