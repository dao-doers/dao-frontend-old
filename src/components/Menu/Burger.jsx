import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Menu from 'components/Menu/Menu';

import 'styles/Dapp.css';

/**
 * @summary displays the timestamp of a given post or event
 */
export default class Burger extends Component {
  static propTypes = {
    address: PropTypes.string,
    view: PropTypes.string,
    proposalId: PropTypes.string,
    param: PropTypes.string,
  };

  render() {
    if (window.innerWidth > 767) {
      return null;
    }

    return (
      <>
        <div id="burger" className="burger-menu">
          <Menu
            address={this.props.address}
            view={this.props.view}
            proposalId={this.props.proposalId}
            param={this.props.param}
          />
        </div>
      </>
    );
  }
}
