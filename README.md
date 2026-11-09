# 8bitdash-chrome

A fork of [atosatto/8bitdash-chrome](https://github.com/atosatto/8bitdash-chrome). That project packs the [8bitdash](https://github.com/8bitdash/8bitdash.github.io) start page into a Chrome extension. This fork keeps the pixel-art new tab and makes the extension load on current Chrome without remote scripts.

<img src="./preview.gif" alt="8bitdash new tab page" height="500"/>

## Install in Chrome

Nothing needs compiling. The page Chrome opens is already in this folder.

1. Clone this repository, or download it and unzip it.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose the folder that contains `manifest.json`.
5. Open a new tab. The pixel-art page replaces Chrome's new tab.

Reload the extension from `chrome://extensions` after you change files.

Before loading, you can check that Chrome will accept the folder:

```bash
python3 scripts/check_mv3.py
```

It prints `ok` when the manifest is Manifest V3, the new-tab page only loads local files, and no packaged name starts with `_`. Chrome refuses all three of those.

## Compared with upstream

[atosatto/8bitdash-chrome](https://github.com/atosatto/8bitdash-chrome) is Manifest V2, loads a script from `apps.madewithtea.com`, and runs Mixpanel from the new-tab page. Current Chrome will not load that package. This fork changes three things:

- **Manifest V3, and a folder Chrome can load.** Two library files whose names started with `_` were renamed. Chrome rejects an unpacked extension that contains those names.
- **The new tab stays on this machine.** Scripts, images, fonts, and connections are limited to files in the extension. There is no analytics call.
- **The start page is only the dashboard.** It still shows the clock, a greeting in the saved language, the artist credit, and a pixel-art background. Left and right change the picture. **H** opens settings for language and art pack, and those choices are remembered. The bookmark map and the single-key shortcuts to other sites are gone.

## Credits

Andrea Tosatto wrote the upstream extension: [github.com/atosatto](https://github.com/atosatto).

The art and the original start page come from [8bitdash](https://github.com/8bitdash/8bitdash.github.io).
