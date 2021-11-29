import web3 from 'web3';

const parser = require('xml-js');

/**
 * @summary shortens the username if its a crypto address
 * @param {object} publicAddress string of username to check
 * @returns {string} username string
 */
const _shortenCryptoName = publicAddress => {
  if (publicAddress.length === 42 && publicAddress.slice(0, 2) === '0x') {
    return `${publicAddress.slice(2, 6)}...${publicAddress.slice(38, 42)}`.toUpperCase();
  }
  return publicAddress;
};

/**
 * @summary checks if a string is a valid URL
 */
const _isValidUrl = function (string) {
  if (string !== undefined) {
    const res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
    );
    return res !== null;
  }
  return false;
};

/**
 * @summary wraps all urls in a string with an html anchor
 * @param {string} text to parse
 * @param {boolean} newWindow wheter to open new target or not
 */
const _wrapURLs = function (text, newWindow) {
  const target = newWindow === true || newWindow == null ? '_blank' : '';
  let href = text;
  if (_isValidUrl(href)) {
    const pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;

    return text.replace(pattern, url => {
      const protocolPattern = /^(?:(?:https?|ftp):\/\/)/i;
      href = protocolPattern.test(url) ? url : `http://${url}`;
      return `<a href="${href}" target="${target}">${url} </a>`;
    });
  }
  if (web3.utils.isAddress(text)) {
    href = `/address/${text}`;
    return `<a href="${href}">${text} </a>`;
  }
  return text;
};

/**
 * @summary from an XML get the info structured to represent token data
 * @param {string} text of xml source
 * @param {string} attribute to look into xml
 */
const _getXMLAttributes = (text, attribute) => {
  const json = parser.xml2js(text, { compact: true, spaces: 4 });
  return json.root[attribute]._attributes;
};

/**
 * @summary quick function to determine if a string is a JSON
 * @param {string} str ing
 */
const isJSON = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * @summary gets the description from a moloch proposal
 * @param {string} title with xml
 * @return {string} with html
 */
const _getProposalDescription = (title, onlyTitle) => {
  const xmlDescription = _getXMLAttributes(title, 'description');
  let html = '';
  if (isJSON(xmlDescription.json)) {
    const json = JSON.parse(xmlDescription.json);
    if (json && json.description !== undefined) {
      const description = _wrapURLs(json.description, true);
      html += `<div class='title-header'>${json.title}</div><div class='title-description'>${description}</div>`;
      if (onlyTitle) {
        return json.title;
      }
    }
    if (json && json.link !== undefined && json.link !== json.description) {
      html += `<div class='title-description'><a href='${json.link}' target='_blank'>${json.link}</a></div>`;
    }
    return html;
  }
  return xmlDescription.json;
};

export const shortenCryptoName = _shortenCryptoName;
export const getProposalDescription = _getProposalDescription;
export const wrapURLs = _wrapURLs;
