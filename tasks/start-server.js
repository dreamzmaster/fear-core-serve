'use strict';

module.exports = function taskFactory (host, port, mustacheConfig, channelDefaults, customMiddleware, staticPaths, liveReloadConditions) {

    return function task () {

        var connect = require('gulp-connect');
        var gulpif = require('gulp-if');
        var query = require('connect-query');
        var mustache = require('connect-mustache-middleware');
        var modRewrite = require('connect-modrewrite');
        var livereload = require('connect-livereload');
        var middleware = [liveReloadConditions(), query()];

        function getLiveReloadMiddleware() {
            return gulpif(liveReloadConditions(), livereload());
        }

        function addMustacheMiddleware() {

            mustacheConfig.rootDir = staticPaths[0];

            mustacheConfig.templatePathOverides = {
                'core' : 'app/jspm_components/github/DigitalInnovation/fear-core-app@development'
            };

            middleware.push(mustache.middleware(mustacheConfig, channelDefaults));
        }

        function addCustomMiddleware() {
            for (var m in customMiddleware) {
                middleware.push(customMiddleware[m]);
            }
        }

        function addRewriteMiddleware() {

            var exclude = ['webapp', 'javascript', 'assets', 'components', 'css', 'scripts', 'views'];

            middleware.push(modRewrite([
                '^\/(' + exclude.join('|') + ')(\/.*)$ /$1$2', //assets
                '^\/docs\/(.*)$ /generated/$1/index.html [L]', //documentation pages
                '^\/$ /views/default/pages/home/index.html [L]', //home page
                '^(?!views)([^.]*)$ /views/default/pages/$1/index.html [L]' //other pages
            ]));
        }

        function addStaticPaths(connect) {
            for (var p in staticPaths) {
                middleware.push(connect.static(staticPaths[p]));
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

        return connect.server(opts);
    };
};