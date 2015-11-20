'use strict';

module.exports = function taskFactory () {

    return function task () {

        var gulp = require('gulp'),
            gutil = require('gulp-util'),
            connect = require('gulp-connect'),
            express = require('express'),
            gulpif = require('gulp-if'),
            runSequence = require('run-sequence'),
            query = require('connect-query'),
            modRewrite = require('connect-modrewrite'),
            livereload = require('connect-livereload'),
            openUrl = require('open'),
            path = require('path'),
            mustache = require('connect-mustache-middleware'),
            webserver = config.get('webserver'),
            paths = config.get('paths');

    };
};