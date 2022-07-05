const parseURI = ({ PUBLIC_PATH, requestURI }) =>
    requestURI === '/'
        ? `${PUBLIC_PATH}/index.html`
        : `${PUBLIC_PATH}/${requestURI}`;

module.exports = {
    parseURI,
};
