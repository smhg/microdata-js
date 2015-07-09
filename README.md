[![Build Status](https://travis-ci.org/smhg/node-microdata.png?branch=master)](https://travis-ci.org/smhg/node-microdata)
# microdata

  [schema.org](http://schema.org/) microdata parser for node.js.

  Tests based on tests in microdatajs by Philip Jägenstedt.

## Installation

```
npm install @smhg/microdata
```

## Usage

```javascript
import {parse} from 'microdata';

let microdata = parse('<html><!-- ... --></html>');

## TODO
* cli interface
* parse more schema.org elements (e.g. time values)
* give meaning to itemprop values (Date, interval, Number)
* optionally map itemtype values to something useful (other than url)
