const createParser = require("../src/index");

const testHtml =
  "Hi everyone! <br>This is a test html <strong>bold text!</strong> <a href='www.google.com'>link to google </a><script>var a = 1 + 2</script> <img src='http://somesource.com/catimg.png' />";

test("parser delivers parsed html with user defined tag replacements and whitelisting", () => {
  const parsed = createParser({
    whitelistTags: {
      br: true,
      a: {
        attributes: {},
        tagName: "h1",
      },
      script: {
        attributes: {},
        tagName: "del",
      },
      img: {
        attributes: {
          src: true,
          width: "100px",
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
  }).parse(testHtml);
  expect(parsed).toMatch("<br ></br>");
  expect(parsed).not.toMatch("href=");
  expect(parsed).not.toMatch("strong");
  expect(parsed).toMatch("<h1 >link to google </h1>");
  expect(parsed).not.toMatch("script");
  expect(parsed).toMatch("<del >var a = 1 + 2</del>");
});

test("parser delivers expected html when specifying blacklistTags", () => {
  const parsed = createParser({
    blacklistTags: ["script", "img", "a"],
  }).parse(testHtml);

  expect(parsed).toMatch("<br ></br>");
  expect(parsed).not.toMatch("href=");
  expect(parsed).not.toMatch("img");
  expect(parsed).not.toMatch("script");
});
