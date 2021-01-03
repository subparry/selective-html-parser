const createParser = require("../src/index");

const testHtml =
  "Hola a todos! <br>Este es el html que vamos a probar <strong>YEA</strong> <a href='www.google.com'>vamos a google? </a> Adios! <script>var a = 1 + 2</script> <img src='http://somesource.com/img.png' />";

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
        },
      },
    },
  }).parse(testHtml);
  expect(parsed).toMatch("<br ></br>");
  expect(parsed).not.toMatch("href=");
  expect(parsed).not.toMatch("strong");
  expect(parsed).toMatch("<h1 >vamos a google? </h1>");
  expect(parsed).not.toMatch("script");
  expect(parsed).toMatch("<del >var a = 1 + 2</del>");
});

test("parser delivers expected html when specifying blacklistTags", () => {
  const parsed = createParser({
    blacklistTags: ["script", "img", "a"],
  }).parse(testHtml);

  console.log(parsed);

  expect(parsed).toMatch("<br ></br>");
  expect(parsed).not.toMatch("href=");
  expect(parsed).not.toMatch("img");
  expect(parsed).not.toMatch("script");
});
