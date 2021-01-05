const htmlparser2 = require('htmlparser2')
const HtmlAssembler = require('./HtmlAssembler')

// const sampleOptions = {
//   whitelistTags: {
//     br: { skipClosing: true },
//     h1: true,
//     h2: true,
//     h3: true,
//     h4: true,
//     a: {
//       attributes: {
//         href: true,
//         rel: 'noreferrer',
//         target: '_blank',
//       },
//       tagName: 'h1',
//     },
//   },
//   // Blacklist tags included only for demonstration. If you include both whitelist and blacklist, whitelist takes precedence and blacklist is ignored
//   blacklistTags: ['a', 'script', 'img'],
// }

function createParser(options) {
  const assembler = new HtmlAssembler()
  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (options.whitelistTags) {
        const tagSpecs = options.whitelistTags[name]
        if (!tagSpecs) return

        if (typeof tagSpecs === 'boolean') {
          assembler.addOpenTag(name, attributes)
        } else if (typeof tagSpecs === 'object') {
          let newAttribs = {}

          if (tagSpecs.attributes) {
            Object.keys(tagSpecs.attributes).forEach((k) => {
              switch (typeof tagSpecs.attributes[k]) {
                case 'boolean': {
                  newAttribs[k] = attributes[k]
                  break
                }
                case 'string':
                  newAttribs[k] = tagSpecs.attributes[k]
                  break
                case 'function':
                  newAttribs[k] = tagSpecs.attributes[k](attributes)
                  break
                default:
                  break
              }
            })
          } else {
            newAttribs = attributes
          }

          let newName = ''
          if (tagSpecs.tagName) {
            newName = tagSpecs.tagName
          } else {
            newName = name
          }
          assembler.addOpenTag(newName, newAttribs)
        }
      } else if (options.blacklistTags) {
        if (options.blacklistTags.includes(name)) return
        assembler.addOpenTag(name, attributes)
      } else {
        throw new Error(
          'You must specify whitelistTags OR blacklistTags. If you specify both, whitelistTags will take precedency and blacklistTags will be silently omitted'
        )
      }
    },
    ontext(text) {
      assembler.addText(text)
    },
    onclosetag(name) {
      if (options.whitelistTags) {
        const tagSpecs = options.whitelistTags[name]
        if (!tagSpecs) return
        if (typeof tagSpecs === 'boolean') {
          assembler.addClosingTag(name)
        } else if (typeof tagSpecs === 'object') {
          if (tagSpecs.skipClosing) return
          let newName = ''
          if (tagSpecs.tagName) {
            newName = tagSpecs.tagName
          } else {
            newName = name
          }
          assembler.addClosingTag(newName)
        }
      } else if (options.blacklistTags) {
        if (options.blacklistTags.includes(name)) return
        assembler.addClosingTag(name)
      }
    },
  })

  return {
    parse(html) {
      parser.write(html)
      parser.end()
      const parsed = assembler.assemble()
      assembler.clear()
      return parsed
    },
  }
}

module.exports = createParser
