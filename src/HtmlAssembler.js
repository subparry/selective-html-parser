class HtmlAssembler {
  constructor() {
    this.result = [];
  }

  addText(text) {
    this.result.push({
      type: "text",
      content: text,
    });
  }

  addOpenTag(name, attrs) {
    this.result.push({
      type: "openTag",
      name,
      attrs,
    });
  }

  addClosingTag(name) {
    this.result.push({
      type: "closingTag",
      name,
    });
  }

  getCurrentRepresentation() {
    return this.result;
  }

  openTagAssemble(tagData) {
    const attrs = Object.keys(tagData.attrs);
    return `<${tagData.name} ${attrs
      .map((k) => {
        const quotationMark = tagData.attrs[k].includes('"') ? "'" : '"';
        return `${k}=${quotationMark}${tagData.attrs[k]}${quotationMark}`;
      })
      .join(" ")}>`;
  }

  closingTagAssemble(tagData) {
    return `</${tagData.name}>`;
  }

  textAssemble(tagData) {
    return tagData.content;
  }

  assemble() {
    return this.result
      .map((tagData) => {
        return this[tagData.type + "Assemble"](tagData);
      })
      .join("");
  }

  clear() {
    this.result = [];
  }
}

module.exports = HtmlAssembler;
