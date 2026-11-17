# Finding a copyright holder

`MISSING_COPYRIGHT.md` lists pictures with no entry in `credits` in `js/8bitdash.js`. Check a line there only after that file names the holder. A name in this note is not a credit, and a credit is not permission to keep the picture.

Work one file at a time. Stop when a page by the holder, or the product the art shipped with, shows the same pixels. A lookalike is a lead, not a result.

## 1. Read the local file

```bash
python3 scripts/copyright_dossier.py images/woods/woods.png
```

`--unchecked` prints the paths still open in `MISSING_COPYRIGHT.md`. `--self-check` prints `ok` when the woods file still matches the facts below.

The script stays on this machine. It reports:

- pixel size and sha256, so a later copy can be compared exactly
- text stored in the file (PNG `tEXt` / `iTXt` / `zTXt`, GIF comment)
- filename clues: a Tumblr media id, a 5–7 character Imgur-style id, a `giphy` save, or a Unix time such as the `1443443612.*` names under `images/ultimate/`
- the commit that added the file (`git log` follows renames)

Then open the picture. Note whether it is one drawing, a looping animation, a game screenshot, or a map built from repeating tiles. A character, logo, or tileset name is a better search term than "pixel art forest".

## 2. Follow the filename before searching by eye

| Clue | What to open |
| --- | --- |
| `tumblr_…` | Search the whole filename. The Tumblr post names the blog. |
| 5–7 character stem, such as `7Eonjje` | `https://imgur.com/<id>` and a search for the filename. |
| `1443443612.47.gif` and its neighbors | Same save batch (2015-09-28). The commit that added `images/ultimate/` says "not in the menu - no permission for public". A GIF comment naming Ulead GIF Animator and ulead.com.tw is that program's default stamp, not the artist. Identify one frame, then check whether the rest of the folder is the same source. |
| Words such as `of_fire_and_waves` or `shovelnight` | Search the words plus "pixel art". |

Also search the path in the upstream history. These pictures were copied from [atosatto/8bitdash-chrome](https://github.com/atosatto/8bitdash-chrome) and [hlindhe/8bitdash.github.io](https://github.com/hlindhe/8bitdash.github.io). `git log -1 --follow -- <path>` names the commit. The 8bitdash site asked artists for permission; a folder that already has a credit in `js/8bitdash.js` often identifies the rest of that folder.

## 3. Reverse image search

Upload the file. Do not trust a search engine's caption ("pixel art forest").

1. [Yandex Images](https://yandex.com/images/) — upload, then read "sites" and the pages behind visually similar hits. Exact copies name a URL.
2. [Google Lens](https://lens.google.com/) — same upload. Open the pages, not the similar-image grid.
3. [Bing visual search](https://www.bing.com/images/) and [TinEye](https://tineye.com/). TinEye is useful when an older exact copy exists. Empty TinEye does not mean the picture is original.
4. If the full frame is a map or a screenshot, crop one distinctive object (one tree, one character, a logo) and search that crop. The composed screenshot is often rarer than the tileset.

Reject a hit unless the pixels match or the page is the holder's own. Similar forest maps are not the source.

## 4. Say what is known

Record four things:

- holder (person or company)
- work (title, tileset filename, or game)
- page that shows the claim
- how close the match is: same pixels, same file hash, or only the same style

Style alone does not go into `credits`. When the match is a game's runtime graphics, name the company that shipped them and the license terms on that product. Those terms often allow the art inside a game made with that product and forbid lifting it into something else. This extension is something else. Naming the holder does not make the picture ok to keep.

## Worked example: `images/woods/woods.png`

Dossier from the script:

- 640×480 PNG, 164833 bytes, sha256 `ceaf391b7aeb262deb96da1d0c1c883a5f9d6efed206e22627ebe8d6f4717259`
- no embedded text
- added in `ec9de4f` on 2015-02-20 by Jendrik Poloczek, message "add new image", with an empty credit `"woods.png": ""`

The picture is a top-down map: repeating grass, rounded trees with near-black canopies and tan trunks, oval shadows, and small yellow flowers. 640×480 is the RPG Maker XP window, and the trees are the Woods set from that product's runtime package (`Graphics/Tilesets/002-Woods01`), not the darker `003-Forest01` and not the painted battleback of the same name (that battleback is 640×320 and is a different picture).

Yandex, Bing, and TinEye did not find an earlier page that hosts this exact map or names a separate artist. A file elsewhere named `002-Woods01.png` was a different sheet (no shared colors), so the tiles are not confirmed pixel for pixel.

**Holder, as far as the picture supports:** Enterbrain, Inc., the publisher of RPG Maker XP (2004). RPG Maker is published today by Gotcha Gotcha Games Inc. The map arrangement has no named author. `credits` names Enterbrain, and the line in `MISSING_COPYRIGHT.md` is checked.

**Not cleared for this extension.** The runtime-package terms allow those tiles in a game made with a copy of RPG Maker XP the user owns. They do not allow taking the tiles out for a new-tab background. The credit is not a license.
