# microdata [![Build Status](https://travis-ci.org/smhg/microdata-js.png?branch=master)](https://travis-ci.org/smhg/microdata-js)

  [schema.org](http://schema.org/) microdata parser.

  Tests based on tests in microdatajs by Philip Jägenstedt.

## Installation

```
npm install @smhg/microdata
```

## Usage

```javascript
import {parse} from 'microdata';

let microdata = parse('<html><!-- ... --></html>');
```

## TODO
* cli interface
* parse more schema.org elements (e.g. time values)
* give meaning to itemprop values (Date, interval, Number)
* optionally map itemtype values to something useful (other than url)
