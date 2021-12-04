/* eslint-disable import/no-anonymous-default-export */
/* IMPORTS */
// Config
import React from 'react';
// Components
import './style.css';

import { TextField } from '@material-ui/core';

export default function ({ title, description, link, handleChanges }) {
  return (
    <>
      <div className="section" style={{ paddingTop: '15px' }}>
        <TextField
          className="input"
          name="title"
          label="Title"
          variant="outlined"
          value={title.value}
          onChange={handleChanges}
          type="text"
          helperText={title.hasChanged && !title.value ? <span className="invalidAddress"> *</span> : null}
        />
      </div>
      <div className="section">
        <TextField
          className="input"
          name="description"
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description.value}
          onChange={handleChanges}
          type="text"
          helperText={description.hasChanged && !description.value ? <span className="invalidAddress"> *</span> : null}
        />
      </div>
      <div className="section">
        <TextField
          className="input"
          InputLabelProps={{ style: { pointerEvents: 'auto' } }}
          name="link"
          id="link"
          value={link.value}
          onChange={handleChanges}
          variant="outlined"
          type="text"
          label="Link"
          helperText={link.hasChanged && !link.value ? <span className="invalidAddress"> *</span> : null}
        />
      </div>
    </>
  );
}
