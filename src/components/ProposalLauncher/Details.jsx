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
      <div className="section" style={{ paddingTop: '8px' }}>
        <TextField
          className="input"
          name="title"
          label="Title"
          variant="outlined"
          value={title.value}
          onChange={handleChanges}
          type="text"
          error={title.hasChanged && !title.value}
          helperText={title.hasChanged && !title.value ? 'Field is required' : null}
          required
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
          error={description.hasChanged && !description.value}
          helperText={description.hasChanged && !description.value ? 'Field is required' : null}
          required
        />
      </div>
      <div className="section sectionLinkMobile" style={{ paddingBottom: '5px' }}>
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
          error={link.hasChanged && !link.value}
          helperText={link.hasChanged && !link.value ? 'Field is required' : null}
          required
        />
      </div>
    </>
  );
}
