/*jshint node: true*/
/*global describe,it*/
'use strict';

var microdata = require('../lib/microdata'),
  _ = require('underscore'),
  assert = require('assert'),
  fs = require('fs');

describe('microdata', function () {
  var filePath = [__dirname, 'test.html'].join('/'),
    data = fs.readFileSync(filePath, 'utf8');

  describe('#parse()', function () {
    it('should return an empty array when no data is passed', function () {
      assert.equal(microdata.parse().length, 0);
    });
    describe('with test.html', function () {
      it('should return 2 items and one child', function () {
        var result = microdata.parse(data);
        assert.equal(result.length, 2);
        assert.equal(result[0].children.length, 1);
      });
      it('should have a title property on the first child', function () {
        var result = microdata.parse(data);
        assert(_.has(result[0].itemprop, 'title'));
      });
    });
  });
});
