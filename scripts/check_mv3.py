# Confirms this folder is a Manifest V3 extension Chrome can load unpacked,
# and that the new-tab page does not load a remote script, image, font, or API.
# Chrome rejects Manifest V2, refuses extension pages that run inline or remote
# scripts, and refuses any packaged file whose name starts with "_".
# The check only reads the package. It does not launch Chrome.

import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Blocks remote scripts, images, fonts, and XHR. Inline styles stay, because
# the page and dat.gui inject style sheets.
OFFLINE_CSP = (
    "default-src 'self'; script-src 'self'; object-src 'self'; "
    "style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
    "font-src 'self'; connect-src 'self'"
)

EXPECTED_SCRIPTS = [
    "bower_components/dat-gui/build/dat.gui.min.js",
    "bower_components/alertifyjs/dist/js/alertify.js",
    "bower_components/basil.js/build/basil.min.js",
    "js/8bitdash.js",
]


class PageScripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts = []
        self.inline = []
        self._capture = False
        self._buf = []

    def handle_starttag(self, tag, attrs):
        if tag != "script":
            return
        kind = dict(attrs).get("type", "")
        src = dict(attrs).get("src")
        if src:
            self.scripts.append(src)
            return
        if kind == "x-tmpl-mustache":
            return
        self._capture = True
        self._buf = []

    def handle_data(self, data):
        if self._capture:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._capture:
            self.inline.append("".join(self._buf).strip())
            self._capture = False


def fail(message):
    print(message)
    sys.exit(1)


def main():
    manifest_path = os.path.join(ROOT, "manifest.json")
    with open(manifest_path, encoding="utf-8") as handle:
        manifest = json.load(handle)
    if manifest.get("manifest_version") != 3:
        fail("manifest_version must be 3")
    if manifest.get("chrome_url_overrides", {}).get("newtab") != "index.html":
        fail("new tab override must be index.html")
    policy = manifest.get("content_security_policy", {}).get("extension_pages")
    if policy != OFFLINE_CSP:
        fail("extension page policy must keep the new tab page on local files")
    if "http:" in policy or "https:" in policy:
        fail("extension page policy still allows a remote origin")

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [name for name in dirnames if name != ".git"]
        for name in dirnames + filenames:
            if name.startswith("_"):
                fail("Chrome rejects names starting with _: " + os.path.join(dirpath, name))

    html_path = os.path.join(ROOT, "index.html")
    with open(html_path, encoding="utf-8") as handle:
        html = handle.read()
    if "onclick" in html.lower():
        fail("index.html still has an inline event handler")
    parser = PageScripts()
    parser.feed(html)
    if parser.inline:
        fail("index.html still has an inline script")
    if parser.scripts != EXPECTED_SCRIPTS:
        fail("index.html scripts are not the local page scripts")
    for src in parser.scripts:
        if src.startswith(("http://", "https://", "//")):
            fail("remote script is not allowed: " + src)
        if not os.path.isfile(os.path.join(ROOT, src)):
            fail("missing script: " + src)

    dash_path = os.path.join(ROOT, "js", "8bitdash.js")
    with open(dash_path, encoding="utf-8") as handle:
        dash = handle.read()
    if "setInterval('" in dash or 'setInterval("' in dash:
        fail("string setInterval is blocked as eval")
    if "setInterval(updateClock, 10000)" not in dash:
        fail("clock timer must call updateClock directly")
    for needle in ("window.u", "mixpanel", "mxpnl", "customURL", '.startsWith("http")'):
        if needle in dash:
            fail("8bitdash.js still has a remote hook: " + needle)
    for needle in ("initMap", "Mousetrap", "fullpage", "window.location.href"):
        if needle in dash:
            fail("bookmark map and site shortcuts must stay out: " + needle)
    if "ArrowRight" not in dash or "ArrowLeft" not in dash:
        fail("arrow keys must still change the art")
    if 'id="map"' in html or "links.js" in html:
        fail("bookmark map must stay out of index.html")
    body_rule = html.find("body {")
    height_rule = html.find("html, body {")
    if body_rule == -1 or body_rule > height_rule:
        fail("body background must stay the first CSS rule so art can replace it")

    # modes names image folders. The page reads every image in those folders.
    start = dash.find("var modes = [")
    if start == -1:
        fail("art packs must be a list of folders")
    end = dash.find("]", start)
    listed = re.findall(r'"([^"]+)"', dash[start:end])
    if "listImages" not in dash or "getPackageDirectoryEntry" not in dash:
        fail("the page must read images from each pack folder")
    image_ext = {".gif", ".png", ".jpg", ".jpeg", ".webp"}
    images_root = os.path.join(ROOT, "images")
    packs_on_disk = set()
    for dirpath, dirnames, filenames in os.walk(images_root):
        dirnames[:] = [name for name in dirnames if name != ".git"]
        for name in filenames:
            if os.path.splitext(name)[1].lower() not in image_ext:
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), images_root)
            parts = rel.split(os.sep)
            if len(parts) != 2:
                fail("image is outside an art pack: images/" + rel)
            packs_on_disk.add(parts[0])
    missing_packs = sorted(packs_on_disk - set(listed))
    if missing_packs:
        fail("folder is not in modes: images/" + missing_packs[0])
    for pack in listed:
        if not os.path.isdir(os.path.join(images_root, pack)):
            fail("modes names a missing folder: images/" + pack)

    print("ok")


if __name__ == "__main__":
    main()
