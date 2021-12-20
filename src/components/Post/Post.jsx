import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parser from 'html-react-parser';
import { withRouter } from 'react-router-dom';

import i18n from 'i18n';
import { wrapURLs } from 'utils/strings';
import { includeInSearch } from 'components/Search/Search';
import Account from 'components/Account/Account';
import 'styles/Dapp.css';
import { ToEthAddress } from 'components/ToEthAddress/ToEthAddress';

/**
 * @summary quick function to determine if a string is a JSON
 * @param {string} str ing
 */
const _isJSON = str => {
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

/* 
TODO
 /this.props.description with function _getDescription
*/
const _getDescription = description => {
  // content formatting
  let content;
  if (_isJSON(description)) {
    const json = JSON.parse(description);

    content = {
      title: json.title ? json.title : '',
      description: json.description ? wrapURLs(json.description) : '',
      link: typeof json.link === 'function' || !json.link ? '' : json.link,
    };
  } else {
    content = {
      title: wrapURLs(description),
      description: null,
      href: null,
    };
  }
  return content;
};

/**
 * @summary renders a post in the timeline
 */
class Post extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      ethAddress: '',
      isFetching: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    ToEthAddress(this.props.memberAddress).then(address => {
      if (this._isMounted) {
        this.setState({
          ethAddress: address,
        });
        this.setState({ isFetching: true });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { ethAddress } = this.state;
    const searchCache = i18n.t('search-post-preview', {
      title: typeof this.props.title === 'string' ? parser(this.props.title) : this.props.title,
      description: typeof this.props.description === 'string' ? parser(this.props.description) : this.props.description,
    });
    includeInSearch(this.props.href, searchCache, 'search-contract');

    return (
      <div className="vote vote-search vote-feed nondraggable vote-poll">
        <div className="checkbox checkbox-custom">
          <div className="meta meta-search meta-bar">
            <Account publicAddress={this.state.isFetching ? ethAddress : 'Loading...'} width="16px" height="16px" />
          </div>
          <div className="option-proposal">
            <div className="option-title option-link option-search title-input">
              <div className="title-input title-feed">
                <div className="title-header">
                  {typeof this.props.title === 'string' ? parser(this.props.title) : this.props.title}
                </div>
                {this.props.description ? (
                  <div className="title-description">
                    {typeof this.props.description === 'string'
                      ? parser(this.props.description)
                      : this.props.description}
                  </div>
                ) : null}
                {this.props.link ? (
                  <div className="title-description">
                    <a
                      href={`https://${this.props.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {this.props.link}
                    </a>
                  </div>
                ) : null}
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
  title: PropTypes.string,
  link: PropTypes.string,
  description: PropTypes.string,
  daoAddress: PropTypes.string,
  memberAddress: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default withRouter(Post);
export const getDescription = _getDescription;
