import cheerio from 'cheerio';
import {isArray} from 'util';

export function parse(data, callback) {
  let $ = cheerio.load(data, {
      ignoreWhitespace: true,
      xmlMode: false,
      lowerCaseTags: true
    });

  function parseLevel(root) {
    let scopeSelector = '[itemscope][itemtype]:not([itemscope] [itemscope])',
      propSelector = '[itemprop]:not([itemscope] [itemprop]):not([itemscope])',
      result = [];

    $(scopeSelector, root.html()).each(function () {
      let itemType = $(this).attr('itemtype'),
        props = {};

      $(propSelector, $(this).html()).each(function () {
        let propName = $(this).attr('itemprop'),
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
            let currentValue = props[propName];

            if (isArray(currentValue)) {
              props[propName].push(value);
            } else {
              props[propName] = [currentValue, value];
            }
          } else {
            props[propName] = value;
          }
        }
      });

      let dummy = {
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

  let result = parseLevel($);

  if (callback) {
    callback(result);
  }

  return result;
}
