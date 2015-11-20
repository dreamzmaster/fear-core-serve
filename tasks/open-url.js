'use strict';

module.exports = function taskFactory (protocol, host, port, page, queryString) {

    return function task () {

        var openUrl = require('open');

        var url = protocol + host + ':' + port + '/' + page;

        if (queryString) {
            url += '?' + queryString;
        }

        return openUrl(url);
    };
};