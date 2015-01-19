/*jshint node: true*/
'use strict';

var cheerio = require('cheerio'),
  url = require('url'),
  util = require('util'),
  http = require('http'),
  https = require('https');

module.exports.parse = function (data, callback) {
  var tmp;

  try {
    tmp = url.parse(data);
  } catch (err) {
    throw new Error('no data or url specified');
  }

  function parseString(data) {
    var $ = cheerio.load(data, {
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
              if (util.isArray(currentValue)) {
                props[propName].push(value);
              } else {
                props[propName] = [currentValue, value];
              }
            } else {
              props[propName] = value;
            }
          }
        });

        var tmp = {
          "itemtype": itemType,
          "itemprop": props
        };
        var children = parseLevel($(this));
        if (children.length > 0) {
          tmp.children = children;
        }

        result.push(tmp);
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

    (tmp.protocol === 'https:' ? https : http).get(tmp, function (res) {
      var data;

      res.setEncoding('utf8');

      res.on('data', function(chunk) {
          data += chunk;
        }).on('end', function () {
          callback(parseString(data));
        });
    }).on('error', function (err) {
      console.log(err);
    });

    return;
  } else {
    // data is html
    var result = parseString(data);

    if (callback) {
      callback(result);
    }

    return result;
  }
};
