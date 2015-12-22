'use strict';

module.exports = function taskFactory (host, port, staticPaths, liveReloadConditions, mustacheConfig, channelDefaults, customMiddleware) {

    var connect = require('gulp-connect');
    var gulpif = require('gulp-if');
    var query = require('connect-query');
    var mustache = require('connect-mustache-middleware');
    var modRewrite = require('connect-modrewrite');
    var livereload = require('connect-livereload');
    var middleware = [getLiveReloadMiddleware(), query()];

    function getLiveReloadMiddleware() {
        return gulpif(liveReloadConditions(), livereload());
    }

    function addMustacheMiddleware() {

        mustacheConfig.rootDir = staticPaths[0];

        mustacheConfig.templatePathOverides = {
            'core' : staticPaths[0] + '/jspm_components/github/DigitalInnovation/fear-core-app@1.0.0'
        };

        middleware.push(mustache.middleware(mustacheConfig, channelDefaults));
    }

    function addCustomMiddleware() {
        if (customMiddleware) {
            for (var m in customMiddleware) {
                middleware.push(customMiddleware[m]);
            }
        }
    }

    function addRewriteMiddleware() {

        var exclude = ['webapp', 'javascript', 'assets', 'components', 'css', 'scripts', 'views'];

        middleware.push(modRewrite([
            '^\/(' + exclude.join('|') + ')(\/.*)$ /$1$2', //assets
            '^\/docs\/(.*)$ /generated/$1/index.html [L]', //documentation pages
            '^\/$ /views/default/pages/home/index.html [L]', //home page
            '^\/hub$ /jspm_components/github/DigitalInnovation/fear-core-app@1.0.0/views/default/pages/hub/index.html [L]', //hub page
            '^\/(?!views)([a-zA-Z-_]*)([^.]*)$ /$1/views/default/pages$2/index.html [L]'
        ]));
    }

    function addStaticPaths(connect) {
        for (var p in staticPaths) {
            middleware.push(connect.static(staticPaths[p]));
        }
    }

    function getMiddleware(connect) {

        addCustomMiddleware();

        if (mustacheConfig && channelDefaults) {
            addMustacheMiddleware();
        }

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