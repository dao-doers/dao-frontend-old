/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';
import { TextField, createTheme, MenuItem, ThemeProvider } from '@material-ui/core';

export default function ({ tokenToWhitelist, ERC20Tokens, handleChanges }) {
  const theme = createTheme({
    zIndex: {
      modal: 999999,
    },
  });
  return (
    <div className="section">
      <ThemeProvider theme={theme}>
        <TextField
          id="full"
          className="input"
          name="tokenToWhitelist"
          helperText={
            <label className="sectionLabel">
              Token
              {tokenToWhitelist === '0x0' ? (
                <span className="invalidAddress"> -invalid address</span>
              ) : (
                <span className="validAddress"> -validated address</span>
              )}
            </label>
          }
          select
          variant="outlined"
          placeholder=" Token to whitelist"
          label="Token to whitelist"
          value={tokenToWhitelist}
          onChange={handleChanges}
        >
          <MenuItem value={defaults.EMPTY} disabled>
            Select token
          </MenuItem>
          {ERC20Tokens.map((t, i) => {
            return (
              <MenuItem key={i} value={t.address}>
                {t.symbol}
              </MenuItem>
            );
          })}
        </TextField>
      </ThemeProvider>
    </div>
  );
}
