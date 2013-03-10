[![Build Status](https://travis-ci.org/smhg/node-microdata.png?branch=master)](https://travis-ci.org/smhg/node-microdata)
# microdata

  [schema.org](http://schema.org/) microdata parser for node.js.

  Tests based on tests in microdatajs by Philip Jägenstedt.

## Installation

```
npm install git://github.com/smhg/node-microdata.git
```

## Usage

```javascript
var microdata = require('microdata');

// parse html string
var result = microdata.parse('<html><!-- ... --></html>');

// parse url with callback
microdata.parse('http://www.something.tld', function(result) {
	// ...
});
```

## TODO
* return promise with Q
* parse more schema.org elements (e.g. time values)
* give meaning to itemprop values (Date, interval, Number)
* stream like sax.js
* optionally map itemtype values to something useful (other than url)

## License 

(The MIT License)

Copyright (c) 2012 Sam Hauglustaine &lt;sam@strictlyphp.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
