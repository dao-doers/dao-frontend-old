/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';
import { FormHelperText } from '@material-ui/core';

export default function ({ tokenToWhitelist, ERC20Tokens, handleChanges }) {
  return (
    <div className="section">
      <select
        id="full"
        className="select-css input"
        name="tokenToWhitelist"
        value={tokenToWhitelist}
        onChange={handleChanges}
      >
        <option value={defaults.EMPTY} disabled>
          Select token
        </option>
        {ERC20Tokens.map((t, i) => (
          <option key={i} value={t.address}>
            {t.symbol}
          </option>
        ))}
      </select>
      <FormHelperText style={{ paddingLeft: '15px' }}>
        <label className={`sectionLabel ${tokenToWhitelist === '0x0' ? 'invalidAddress' : null}`}>
          Token to withelist
        </label>
      </FormHelperText>
    </div>
  );
}
