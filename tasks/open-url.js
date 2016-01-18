'use strict';

/**
 * @module tasks/open-url
 */

/**
 * taskFactory
 * @param options {Object}
 * {protocol : 'http://', host : '127.0.0.1', port : '8000', page : 'bandc/checkout/orderReview', queryString : 'channel=tsop'}
 * @returns {Function}
 * gulp stream
 */
module.exports = function taskFactory (options) {

    var extend = require('extend');

    var defaults = {
        protocol : 'http://',
        host : '127.0.0.1',
        port : '8000',
        page : null,
        queryString : null
    };

    extend(true, defaults, options);

    return function task () {

        var openUrl = require('open');

        var url = options.protocol + options.host + ':' + options.port + '/' + options.page;

        if (options.queryString) {
            url += '?' + options.queryString;
        }

        return openUrl(url);
    };
};