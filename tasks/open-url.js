'use strict';

module.exports = function taskFactory () {

    return function task (protocol, host, port, page, queryString) {

        var openUrl = require('open');

        var url = protocol + host + ':' + port + '/' + page;

        if (queryString) {
            url += '?' + queryString;
        }

        return openUrl(url);

    };
};