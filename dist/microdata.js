'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _util = require('util');

function parse(data, callback) {
  var $ = _cheerio2['default'].load(data, {
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
            value = undefined;

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

            if ((0, _util.isArray)(currentValue)) {
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
      },
          children = parseLevel($(this));

      if (children.length > 0) {
        dummy.children = children;
      }

      result.push(dummy);
    });

    return result;
  }

  var result = parseLevel($);

  if (callback) {
    callback(result);
  }

  return result;
}