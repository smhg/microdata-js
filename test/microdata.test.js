/*jshint node: true*/
/*global describe,before,it*/
'use strict';

var microdata = require('../lib/microdata'),
  _ = require('underscore'),
  assert = require('assert'),
  fs = require('fs');

describe('microdata', function () {
  var html;

  before(function (done) {
    var filePath = [__dirname, 'test.html'].join('/');
    fs.readFile(filePath, 'utf8', function (err, data) {
      html = data;
      done(err);
    });
  });

  describe('#parse()', function () {
    it('should throw an error when no data is passed', function (done) {
      try {
        microdata.parse();
      } catch (err) {
        done();
        return;
      }
      throw new Error('passed without error');
    });
    describe('with test.html', function () {
      it('should return 2 items and one child', function () {
        var result = microdata.parse(html);
        assert.equal(result.length, 2);
        assert.equal(result[0].children.length, 1);
      });
      it('should have a title property on the first child', function () {
        var result = microdata.parse(html);
        assert(_.has(result[0].itemprop, 'title'));
      });
    });
    describe('with https://github.com/isaacs/npm', function () {
      it('should have at least one item', function (done) {
        var result = microdata.parse('https://github.com/isaacs/npm', function (data) {
          assert(data.length > 0);
          done();
        });
      });
    });
  });
});
