'use strict';

/**
 * @module tasks/start-server
 */

/**
 * taskFactory
 * @param host {String}
 * @param port {String}
 * @param staticPaths {Array}
 * @param liveReloadConditions {Function}
 * @param mustacheConfig {Object}
 * @param channelDefaults {Object}
 * @param customMiddleware {Array}
 * @returns {*|exports}
 */
module.exports = function taskFactory (host, port, staticPaths, liveReloadConditions, mustacheConfig, channelDefaults, customMiddleware) {

    var connect = require('gulp-connect');
    var gulpif = require('gulp-if');
    var gutil = require('gulp-util');
    var query = require('connect-query');
    var mustache = require('connect-mustache-middleware');
    var modRewrite = require('connect-modrewrite');
    var livereload = require('connect-livereload');
    var middleware = [getLiveReloadMiddleware(), query()];

    function getLiveReloadMiddleware() {
        return gulpif(liveReloadConditions(), livereload());
    }

    function addMustacheMiddleware() {

        if (mustacheConfig && channelDefaults) {

            gutil.log(gutil.colors.green('Adding mustache middleware'));

            mustacheConfig.rootDir = staticPaths[0];

            mustacheConfig.templatePathOverides = {
                'core': staticPaths[0] + '/jspm_components/github/DigitalInnovation/fear-core-app@1.0.1'
            };

            middleware.push(mustache.middleware(mustacheConfig, channelDefaults));
        }

        return false;
    }

    function addCustomMiddleware() {

        if (customMiddleware) {

            gutil.log(gutil.colors.green('Adding ' + customMiddleware.length + ' custom middleware'));

            for (var m in customMiddleware) {
                if (customMiddleware.hasOwnProperty(m)) {
                    middleware.push(customMiddleware[m]);
                }
            }
        }

        return false;
    }

    function addRewriteMiddleware() {

        var exclude = ['webapp', 'javascript', 'assets', 'components', 'css', 'scripts', 'views'];

        middleware.push(modRewrite([
            '^\/(' + exclude.join('|') + ')(\/.*)$ /$1$2', //assets
            '^\/docs\/(.*)$ /generated/$1/index.html [L]', //documentation pages
            '^\/$ /views/default/pages/home/index.html [L]', //home page
            '^\/hub$ /jspm_components/github/DigitalInnovation/fear-core-app@1.0.1/views/default/pages/hub/index.html [L]', //hub page
            '^\/(?!views)([a-zA-Z-_]*)([^.]*)$ /$1/views/default/pages$2/index.html [L]'
        ]));
    }

    function addStaticPaths(connect) {
        for (var p in staticPaths) {
            if (staticPaths.hasOwnProperty(p)) {
                middleware.push(connect.static(staticPaths[p]));
            }
        }
    }

    function getMiddleware(connect) {

        addCustomMiddleware();

        addMustacheMiddleware();

        addRewriteMiddleware();

        addStaticPaths(connect);

        return middleware;
    }

    var opts = {
        port: port,
        host: host,
        middleware: getMiddleware
    };

    connect.server(opts);

    return connect;
};