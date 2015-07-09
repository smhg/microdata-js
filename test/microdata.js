import {parse} from '../dist/microdata';
import assert from 'assert';
import fs from 'fs';

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
        parse();
      } catch (err) {
        done();
        return;
      }
      throw new Error('passed without error');
    });

    describe('with test.html', function () {
      it('should return 2 items and one child', function () {
        var result = parse(html);
        assert(result.length === 2);
        assert(result[0].children.length === 1);
      });
      it('should have a title property on the first child', function () {
        var result = parse(html);
        assert('title' in result[0].itemprop);
      });
    });
  });
});
