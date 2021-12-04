/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import { defaults } from 'lib/const';
import './style.css';
import TextField from '@material-ui/core/TextField';
import IconWithTooltip from 'components/IconWithTooltip/IconWithTooltip';

export default function ({ availableTokens, paymentToken, paymentRequested, handleChanges }) {
  return (
    <div className="section">
      <select
        className="input"
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
      <TextField
        className="input number"
        InputLabelProps={{ style: { pointerEvents: 'auto' } }}
        name="paymentRequested"
        id="paymentRequested"
        value={paymentRequested}
        onChange={handleChanges}
        placeholder="paymentRequested"
        variant="outlined"
        type="number"
        label={
          <div style={{ display: 'flex' }}>
            sharesRequested
            <IconWithTooltip title="paymentRequested means .." />
          </div>
        }
        helperText={
          <label className={paymentToken === '0x0' ? 'sectionLabel emptyAddress' : 'sectionLabel'}>
            Payment requested
          </label>
        }
      />
    </div>
  );
}
