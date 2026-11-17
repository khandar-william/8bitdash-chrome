# Local facts for one picture in MISSING_COPYRIGHT.md.
# Prints size, hash, embedded text, filename clues, and the commit that added
# the file. The web search that turns those facts into a copyright holder is
# COPYRIGHT_SEARCH.md. This script does not contact the network.
#
#   python3 scripts/copyright_dossier.py images/woods/woods.png
#   python3 scripts/copyright_dossier.py --unchecked
#   python3 scripts/copyright_dossier.py --self-check

import datetime
import hashlib
import os
import re
import struct
import subprocess
import sys
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MISSING = os.path.join(ROOT, "MISSING_COPYRIGHT.md")

UNCHECKED = re.compile(r"^- \[ \] \[([^\]]+)\]")
TUMBLR = re.compile(r"tumblr_([A-Za-z0-9]+)")
IMGUR = re.compile(r"^[A-Za-z0-9]{5,7}$")
STAMP = re.compile(r"^(\d{10})(?:\.\d+)?$")


def missing_paths():
    paths = []
    with open(MISSING, encoding="utf-8") as handle:
        for line in handle:
            match = UNCHECKED.match(line)
            if match:
                paths.append(match.group(1))
    return paths


def png_info(data):
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    width, height = struct.unpack(">II", data[16:24])
    notes = []
    index = 8
    while index + 8 <= len(data):
        length = struct.unpack(">I", data[index : index + 4])[0]
        kind = data[index + 4 : index + 8]
        chunk = data[index + 8 : index + 8 + length]
        if kind == b"tEXt" and b"\x00" in chunk:
            key, value = chunk.split(b"\x00", 1)
            notes.append(key.decode("latin1") + ": " + value.decode("latin1", "replace"))
        elif kind == b"iTXt" and b"\x00" in chunk:
            notes.append("iTXt: " + chunk.split(b"\x00", 1)[0].decode("latin1"))
        elif kind == b"zTXt" and b"\x00" in chunk:
            key, rest = chunk.split(b"\x00", 1)
            if len(rest) > 1:
                try:
                    text = zlib.decompress(rest[1:]).decode("latin1", "replace")
                    notes.append(key.decode("latin1") + ": " + text[:200])
                except zlib.error:
                    notes.append(key.decode("latin1") + ": (compressed text)")
        index += 12 + length
        if kind == b"IEND":
            break
    return width, height, notes


def gif_comment(payload):
    text = None
    for encoding in ("utf-8", "cp950"):
        try:
            text = payload.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    if text is None:
        text = payload.decode("latin1", "replace")
    text = text.replace("\x01USSPCMT", "").strip()
    if "Ulead GIF Animator" in text and "ulead.com" in text:
        text += " (default stamp of the exporter, not the artist)"
    return text[:300]


def gif_info(data):
    if data[:6] not in (b"GIF87a", b"GIF89a"):
        return None
    width, height = struct.unpack("<HH", data[6:10])
    notes = []
    packed = data[10]
    index = 13
    if packed & 0x80:
        index += 3 * (2 << (packed & 0x07))
    while index < len(data):
        block = data[index]
        if block == 0x3B:
            break
        if block == 0x21:
            ext = data[index + 1]
            index += 2
            payload = b""
            while index < len(data) and data[index] != 0:
                size = data[index]
                payload += data[index + 1 : index + 1 + size]
                index += 1 + size
            index += 1
            if ext == 0xFE:
                notes.append("comment: " + gif_comment(payload))
            continue
        if block == 0x2C:
            index += 9
            if index < len(data) and data[index] & 0x80:
                index += 1 + 3 * (2 << (data[index] & 0x07))
            else:
                index += 1
            index += 1
            while index < len(data) and data[index] != 0:
                index += 1 + data[index]
            index += 1
            continue
        break
    return width, height, notes


def looks_like_imgur_id(stem):
    if not IMGUR.match(stem):
        return False
    mixed = stem != stem.lower() and stem != stem.upper()
    return mixed or any(ch.isdigit() for ch in stem)


def filename_clues(path):
    stem = os.path.splitext(os.path.basename(path))[0]
    clues = []
    tumblr = TUMBLR.search(stem)
    if tumblr:
        clues.append(
            "Tumblr media id "
            + tumblr.group(1)
            + ". Search the whole filename; the post page names the blog."
        )
    if looks_like_imgur_id(stem):
        clues.append("Short id. Try https://imgur.com/" + stem + " and a search for the filename.")
    stamp = STAMP.match(stem)
    if stamp:
        when = datetime.datetime.fromtimestamp(
            int(stamp.group(1)), datetime.timezone.utc
        )
        clues.append(
            "Leading number is a Unix time: "
            + when.strftime("%Y-%m-%d %H:%M:%S UTC")
            + ". Files that share it were saved together."
        )
    if stem.lower() == "giphy":
        clues.append("Saved from Giphy. Reverse image search; the filename does not identify the post.")
    return clues


def added_in(path):
    try:
        log = subprocess.run(
            [
                "git", "log", "--follow", "--diff-filter=A",
                "--format=%h %ad %an %s", "--date=short", "--", path,
            ],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError:
        return ""
    lines = [line for line in log.stdout.splitlines() if line.strip()]
    return lines[-1] if lines else ""


def inspect(path):
    full = path if os.path.isabs(path) else os.path.join(ROOT, path)
    data = open(full, "rb").read()
    info = png_info(data) or gif_info(data)
    if info is None:
        width = height = None
        notes = []
    else:
        width, height, notes = info
    rel = os.path.relpath(full, ROOT)
    return {
        "path": rel,
        "bytes": len(data),
        "width": width,
        "height": height,
        "sha256": hashlib.sha256(data).hexdigest(),
        "notes": notes,
        "clues": filename_clues(rel),
        "added": added_in(rel),
    }


def render(info):
    lines = [
        info["path"],
        "bytes: " + str(info["bytes"]),
        "pixels: {0} x {1}".format(info["width"], info["height"]),
        "sha256: " + info["sha256"],
    ]
    if info["notes"]:
        lines.append("embedded:")
        lines.extend("  " + note for note in info["notes"])
    else:
        lines.append("embedded: none")
    if info["clues"]:
        lines.append("filename:")
        lines.extend("  " + clue for clue in info["clues"])
    if info["added"]:
        lines.append("added: " + info["added"])
    lines.append("next: COPYRIGHT_SEARCH.md")
    return "\n".join(lines)


def main(argv):
    if len(argv) != 2:
        print("usage: python3 scripts/copyright_dossier.py <image> | --unchecked | --self-check", file=sys.stderr)
        return 2
    if argv[1] == "--unchecked":
        for path in missing_paths():
            print(path)
        return 0
    if argv[1] == "--self-check":
        assert "images/woods/woods.png" in missing_paths()
        info = inspect("images/woods/woods.png")
        assert info["width"] == 640 and info["height"] == 480
        assert info["sha256"].startswith("ceaf391b")
        assert info["notes"] == []
        assert info["clues"] == []
        assert info["added"].startswith("ec9de4f")
        ultimate = inspect("images/ultimate/1443443612.47.gif")
        assert "default stamp of the exporter" in ultimate["notes"][0]
        assert ultimate["added"].startswith("996ecaa")
        print("ok")
        return 0
    target = argv[1]
    if not os.path.isfile(target) and not os.path.isfile(os.path.join(ROOT, target)):
        print("not a file: " + target, file=sys.stderr)
        return 1
    print(render(inspect(target)))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
