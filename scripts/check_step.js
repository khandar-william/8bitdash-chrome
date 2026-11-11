var assert = require("assert")
var fs = require("fs")
var path = require("path")
var dash = require("../js/8bitdash.js")
var stepCatalog = dash.stepCatalog
var creditHtml = dash.creditHtml
var credits = dash.credits

var src = fs.readFileSync(path.join(__dirname, "../js/8bitdash.js"), "utf8")
var page = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8")
assert.ok(page.includes('name="color-scheme" content="dark"'))
assert.ok(page.includes("color-scheme: dark"))
assert.ok(page.includes(".dg select"))
assert.ok(page.includes("color-scheme: light"))
assert.ok(page.includes("background: #000 no-repeat center center fixed"))
assert.ok(src.includes('#000 url(" + imageURL + ")'))
assert.equal(src.indexOf('basil.get("mode2")'), -1)
assert.equal(src.indexOf('basil.set("mode2"'), -1)

assert.deepStrictEqual(stepCatalog(0, 0, 3, 5, 1), { modeIndex: 0, imageIndex: 1 })
assert.deepStrictEqual(stepCatalog(0, 2, 3, 5, 1), { modeIndex: 1, imageIndex: 0 })
assert.deepStrictEqual(stepCatalog(4, 1, 2, 5, 1), { modeIndex: 0, imageIndex: 0 })
assert.deepStrictEqual(stepCatalog(2, 2, 4, 5, -1), { modeIndex: 2, imageIndex: 1 })
assert.deepStrictEqual(stepCatalog(2, 0, 4, 5, -1), { modeIndex: 1, imageIndex: "last" })
assert.deepStrictEqual(stepCatalog(0, 0, 4, 5, -1), { modeIndex: 4, imageIndex: "last" })

var counts = [2, 1, 3]
var modeIndex = 0
var imageIndex = 0
var seen = []
for (var n = 0; n < 6; n++) {
  seen.push(modeIndex + ":" + imageIndex)
  var pos = stepCatalog(modeIndex, imageIndex, counts[modeIndex], counts.length, 1)
  modeIndex = pos.modeIndex
  imageIndex = pos.imageIndex === "last" ? counts[modeIndex] - 1 : pos.imageIndex
}
assert.deepStrictEqual(seen, ["0:0", "0:1", "1:0", "2:0", "2:1", "2:2"])
assert.deepStrictEqual([modeIndex, imageIndex], [0, 0])

modeIndex = 0
imageIndex = 0
seen = []
for (var n = 0; n < 6; n++) {
  seen.push(modeIndex + ":" + imageIndex)
  var pos = stepCatalog(modeIndex, imageIndex, counts[modeIndex], counts.length, -1)
  modeIndex = pos.modeIndex
  imageIndex = pos.imageIndex === "last" ? counts[modeIndex] - 1 : pos.imageIndex
}
assert.deepStrictEqual(seen, ["0:0", "2:2", "2:1", "2:0", "1:0", "0:1"])
assert.deepStrictEqual([modeIndex, imageIndex], [0, 0])

var sample = { "valenberg/": "dir", "valenberg/shop.gif": "one" }
assert.equal(creditHtml(sample, "valenberg", "shop.gif"), "one")
assert.equal(creditHtml(sample, "valenberg", "ride.gif"), "dir")
assert.equal(creditHtml(sample, "more", "shop.gif"), undefined)

assert.equal(creditHtml(credits, "valenberg", "shop.gif"), credits["valenberg/"])
assert.equal(creditHtml(credits, "more", "shop.gif"), undefined)
assert.equal(creditHtml(credits, "zedotagger", "cave.gif"), credits["zedotagger/"])
assert.equal(creditHtml(credits, "landscapes", "cave.gif"), credits["landscapes/"])
assert.notEqual(credits["zedotagger/"], credits["landscapes/"])
assert.equal(creditHtml(credits, "more", "iplayoldgames.gif"), credits["kirokaze/"])
assert.equal(creditHtml(credits, "more", "castle.gif"), credits["landscapes/"])
assert.equal(creditHtml(credits, "more", "cyber.gif"), "http://flexroman.tumblr.com/")
assert.equal(creditHtml(credits, "more", "bats.gif"), undefined)
assert.equal(creditHtml(credits, "movies", "bebop.gif"), credits["movies/bebop.gif"])
assert.equal(creditHtml(credits, "movies", "armageddon.gif"), undefined)
assert.equal("movies/" in credits, false)
assert.equal(creditHtml(credits, "gaming", "hyperlight.gif"), credits["hyperlightdrifter/"])
assert.equal(creditHtml(credits, "gaming", "cyber.gif"), "http://flexroman.tumblr.com/")
assert.equal(creditHtml(credits, "gaming", "bridge.gif"), undefined)
assert.equal(creditHtml(credits, "other", "forrest.gif"), credits["landscapes/"])
assert.equal(creditHtml(credits, "woods", "woods.png"), "")
assert.equal(creditHtml(credits, "other", "barfly.gif"), "Longshot")
assert.equal("other/" in credits, false)
assert.equal("more/" in credits, false)
Object.keys(credits).forEach(function(key) {
  assert.ok(key.indexOf("/") > 0, key)
})

function filesIn(folder) {
  var dir = path.join(__dirname, "../images", folder)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(function(name) {
    var ext = path.extname(name).toLowerCase()
    return [".gif", ".png", ".jpg", ".jpeg", ".webp"].indexOf(ext) !== -1
  })
}
["kirokaze", "valenberg", "faxdoc"].forEach(function(folder) {
  filesIn(folder).forEach(function(name) {
    assert.equal(creditHtml(credits, folder, name), credits[folder + "/"], folder + "/" + name)
  })
})
filesIn("more").forEach(function(name) {
  var html = creditHtml(credits, "more", name)
  if (name === "iplayoldgames.gif") assert.equal(html, credits["kirokaze/"])
  else if (name === "castle.gif") assert.equal(html, credits["landscapes/"])
  else if (name === "cyber.gif") assert.equal(html, "http://flexroman.tumblr.com/")
  else assert.equal(html, undefined, name)
})

console.log("ok")
