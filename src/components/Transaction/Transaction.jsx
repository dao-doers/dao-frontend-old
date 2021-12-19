import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import i18n from 'i18n';

import 'styles/Dapp.css';
import { defaults } from 'lib/const';
import { getDescription } from 'components/Post/Post';
import Alert from '@material-ui/lab/Alert';

const numbro = require('numbro');

/**
 * @summary displays the contents of a poll
 */
export default class Transaction extends Component {
  getVote() {
    const label = Number(this.props.quantity) === 1 ? 'share' : 'shares';
    const title = `${getDescription(this.props.description).title}`;

    switch (this.props.uintVote) {
      case defaults.YES:
        return (
          <Alert severity='success' href={this.props.uintVote}>
            {parser(
              i18n.t('voted-yes', { shares: numbro(this.props.quantity).format('0,0'), label, proposal: title }),
            )}
          </Alert>
        );
      case defaults.NO:
        return (
          <Alert severity='error' href={this.props.uintVote}>
            {parser(i18n.t('voted-no', { shares: numbro(this.props.quantity).format('0,0'), label, proposal: title }))}
          </Alert>
        );
      default:
    }
    return null;
  }

  render() {
    return <div className="preview-info">{this.getVote()}</div>;
  }
}

Transaction.propTypes = {
  uintVote: PropTypes.number,
  quantity: PropTypes.string,
  description: PropTypes.string,
};
