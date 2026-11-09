var assert = require("assert")
var fs = require("fs")
var path = require("path")
var stepCatalog = require("../js/8bitdash.js").stepCatalog

var src = fs.readFileSync(path.join(__dirname, "../js/8bitdash.js"), "utf8")
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

console.log("ok")
