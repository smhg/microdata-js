import cheerio from 'cheerio';
import util from 'util';

export function parse(data, callback) {
  function parseString(str) {
    var $ = cheerio.load(str, {
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

  var result = parseString(data);

  if (callback) {
    callback(result);
  }

  return result;
}
