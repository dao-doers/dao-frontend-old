import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import { withRouter } from "react-router-dom";

import i18n from 'i18n';
import { wrapURLs } from 'utils/strings';
import { includeInSearch } from 'components/Search/Search';
import Account from 'components/Account/Account';
import DAO from 'components/DAO/DAO';

import 'styles/Dapp.css';

/**
* @summary quick function to determine if a string is a JSON
* @param {string} str ing
*/
const _isJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
* @summary given the json content of a proposal return the description text
* @param {string} description with probable json information
* @return {string} content
*/
const _getDescription = (description) => {
  // content formatting
  let content;
  if (_isJSON(description)) {
    const json = JSON.parse(description);

    content = {
      title: json.title ? json.title : '',
      description: json.description ? wrapURLs(json.description) : '',
      link: (typeof json.link === 'function' || !json.link) ? '' : json.link,
    };
  } else {
    content = {
      title: wrapURLs(description),
      description: null,
      link: null,
    };
  }
  return content;
};

/**
* @summary renders a post in the timeline
*/
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = _getDescription(this.props.description);
  }

  render() {
    const searchCache = i18n.t('search-post-preview', {
      title: typeof this.state.title === 'string' ? parser(this.state.title) : this.state.title,
      description: typeof this.state.description === 'string' ? parser(this.state.description) : this.state.description,
    });
    includeInSearch(this.props.href, searchCache, 'search-contract');

    return (
      <div className="vote vote-search vote-feed nondraggable vote-poll">
        <div className="checkbox checkbox-custom">
          <div className="meta meta-search meta-bar">
            <Account publicAddress={this.props.memberAddress} width="16px" height="16px" /> (Polyjuice address)
            <DAO publicAddress={this.props.daoAddress} width="16px" height="16px" />
          </div>
          <div className="option-proposal">
            <div className="option-title option-link option-search title-input">
              <div className="title-input title-feed">
                <div className="title-header">
                  {typeof this.state.title === 'string' ? parser(this.state.title) : this.state.title}
                </div>
                {
                  (this.state.description) ?
                    <div className="title-description">
                      {typeof this.state.description === 'string' ? parser(this.state.description) : this.state.description}
                    </div>
                    :
                    null
                }
                {
                  (this.state.link) ?
                    <div className="title-description">
                      <a href={this.state.link} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); }}>{this.state.link}</a>
                    </div>
                    :
                    null
                }
              </div>
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  href: PropTypes.string,
  description: PropTypes.string,
  daoAddress: PropTypes.string,
  memberAddress: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default withRouter(Post);
export const getDescription = _getDescription;
