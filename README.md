# selective-html-parser

## Description

A simple wrapper over `htmlparser2` that allows to parse and filter out HTML strings from untrusted sources.

## Features

It supports whitelist and blacklist approaches. I recommend whitelist approach for html coming from the scary internet because when building a blacklist we tend to forget to include every dangerous tag.

Also, whitelist options are far richer allowing tagName swap, attribute whitelisting, attribute value modification and adding default attributes

## Usage

- CommonJS

```javascript
const createParser = require("@subparry/selective-html-parser");
```

- ES6 imports

```javascript
import createParser from "@subparry/selective-html-parser";
```

- Whitelist approach

```javascript
const parser = createParser({
  whitelistTags: {
    h1: true, // Allow all h1 tags
    br: {skipClosing: true}, // Allow all br tags but skip closing tag
    // Allow anchor tags but with the following modifications
    a: {
      attributes: {}, // No attributes allowed
      tagName: "h1", // swap the a tag with a h1 tag
    },
    // Allow script tags but...
    script: {
      attributes: {}, // No attributes allowed
      tagName: "del", // Swap the script tag with a del tag (strikethrough)
    },
    // Allow img tags with...
    img: {
      attributes: {
        src: true, // Allow original src attribute
        width: "100px", // Add a width attribute of 100px
        // Add an alt attribute based on another attribute present on the original html
        alt: (originalAttrs) => {
          if (originalAttrs.src.includes("cat")) {
            return "Picture of a pretty cat";
          } else {
            return "Some image...";
          }
        },
      },
    },
  },
});

parser.parse("Hi everyone! <br>This is a test html <strong>bold text!</strong> <a href='www.google.com'>link to google </a><script>var a = 1 + 2</script> <img src='http://somesource.com/catimg.png' />")
// returns "Hi everyone! <br ></br>This is a test html bold text! <h1 >link to google </h1><del >var a = 1 + 2</del> <img src="http://somesource.com/catimg.png" width="100px" alt="Picture of a pretty cat"></img>
"
```

- Blacklist approach

```javascript
const parser = createParser({
  blacklistTags: ["script", "img", "a"],
});

parser.parse("Hi everyone! <br>This is a test html <strong>bold text!</strong> <a href='www.google.com'>link to google </a><script>var a = 1 + 2</script> <img src='http://somesource.com/catimg.png' />")
// returns "Hi everyone! <br ></br>This is a test html <strong >bold text!</strong> link to google var a = 1 + 2
"
```
