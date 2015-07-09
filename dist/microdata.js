'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function parse(data, callback) {
  var tmp;

  try {
    tmp = _url2['default'].parse(data);
  } catch (err) {
    throw new Error('no data or url specified');
  }

  function parseString(str) {
    var $ = _cheerio2['default'].load(str, {
      ignoreWhitespace: true,
      xmlMode: false,
      lowerCaseTags: true
    });

    function parseLevel(root) {
      var scopeSelector = '[itemscope][itemtype]:not([itemscope] [itemscope])',
          propSelector = '[itemprop]:not([itemscope] [itemprop]):not([itemscope])',
          result = [];

      $(scopeSelector, root.html()).each(function () {
        var itemType = $(this).attr('itemtype'),
            props = {};

        $(propSelector, $(this).html()).each(function () {
          var propName = $(this).attr('itemprop'),
              value;
          switch ($(this)[0].name) {
            case 'audio':
            case 'embed':
            case 'iframe':
            case 'img':
            case 'source':
            case 'track':
            case 'video':
              value = $(this).attr('src');
              break;
            case 'a':
            case 'area':
            case 'link':
              value = $(this).attr('href');
              break;
            case 'object':
              value = $(this).attr('data');
              break;
            default:
              value = $(this).html().trim();
              break;
          }
          if (value) {
            if (propName in props) {
              var currentValue = props[propName];
              if (_util2['default'].isArray(currentValue)) {
                props[propName].push(value);
              } else {
                props[propName] = [currentValue, value];
              }
            } else {
              props[propName] = value;
            }
          }
        });

        var dummy = {
          'itemtype': itemType,
          'itemprop': props
        };
        var children = parseLevel($(this));
        if (children.length > 0) {
          dummy.children = children;
        }

        result.push(dummy);
      });

      return result;
    }

    return parseLevel($);
  }

  if (tmp.protocol && tmp.host && tmp.hostname) {
    // data is url
    if (!callback) {
      throw new Error('no callback specified');
    }

    (tmp.protocol === 'https:' ? _https2['default'] : _http2['default']).get(tmp, function (res) {
      var content;

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        content += chunk;
      }).on('end', function () {
        callback(parseString(content));
      });
    }).on('error', function (err) {
      console.log(err);
    });

    return undefined;
  } else {
    // data is html
    var result = parseString(data);

    if (callback) {
      callback(result);
    }

    return result;
  }
}