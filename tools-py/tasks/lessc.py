import sys, subprocess, time
from tools import common
from pathlib import Path
from typing import List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class LessFile:
    path: Path
    options: List[str]

def _partition_children(folder: Path) -> Tuple[List[Path], List[Path]]:
    """
    Return (dirs, files) for the immediate children of `folder`.
    Files are only .less (excluding main.less).
    """
    dirs, files = [], []
    for p in folder.iterdir():
        if p.name.startswith("."):
            continue
        if p.is_dir():
            dirs.append(p)
        elif p.is_file():
            if p.suffix == ".less" and p.name != "main.less":
                files.append(p)
    return dirs, files

def _name_matches(entry: str, candidate: Path) -> bool:
    """
    Match an 'order' entry to a child name.
    Accepts either exact name (with extension for files) or
    name without .less for files. Directories match by exact name.
    """
    if candidate.is_dir():
        return entry == candidate.name
    # file: match w/ or w/o .less
    if entry == candidate.name:
        return True
    if candidate.suffix == ".less" and entry == candidate.stem:
        return True
    return False

def _consume_in_order(entries: List[str], dirs: List[Path], files: List[Path], order_file_mtime=None,  grace_seconds=5) -> Tuple[List[Path], List[LessFile], List[Path], List[Path]]:
    """
    Given desired 'entries' and the current immediate 'dirs' and 'files',
    pick the ones that match (preserving order) and return:
      (ordered_dirs, ordered_files, remaining_dirs, remaining_files)
    """
    ordered_dirs, ordered_files = [], []
    remaining_dirs = dirs[:]
    remaining_files = files[:]

    def pop_first_match(name: str, items: List[Path]) -> Optional[Path]:
        for i, p in enumerate(items):
            if _name_matches(name, p):
                return items.pop(i)
        return None

    recently_edited = (
        order_file_mtime is not None
        and (time.time() - order_file_mtime) < grace_seconds
    )

    for entry in entries:
        parts = entry.split(" ")
        file = parts.pop(0)
        hit = pop_first_match(file, remaining_dirs)
        if hit:
            ordered_dirs.append(hit)
            continue
        hit = pop_first_match(file, remaining_files)
        if hit:
            ordered_files.append(LessFile(hit, parts))
            continue
        if not recently_edited:
            common.fail(f"Error: order entry '{file}' not found", file=sys.stderr)

    return ordered_dirs, ordered_files, remaining_dirs, remaining_files

def _walk_less_in_folder(folder: Path, base: Path) -> List[str]:
    """
    Depth-first traversal of `folder`:
      - obey 'order' file for immediate children
      - then any remaining dirs/files (dirs first), alpha by relative path
      - recurse into dirs; files are yielded in place
    Returns a list of .less files (excluding main.less), in traversal order.
    """
    order_entries = common._read_order_file(folder)

    dirs, files = _partition_children(folder)

    # Partition by 'order' first
    ordered_dirs, ordered_files, remaining_dirs, remaining_files = _consume_in_order(
        order_entries, dirs, files, (folder / "order").stat().st_mtime if order_entries else None
    )

    # Sort remaining (dirs first, then files)
    remaining_dirs.sort(key=lambda p: p.relative_to(base).as_posix().lower())
    remaining_files.sort(key=lambda p: p.relative_to(base).as_posix().lower())

    # Final immediate sequence in this folder: dirs (ordered), files (ordered), dirs (remaining), files (remaining)
    seq_dirs = ordered_dirs + remaining_dirs

    out: List[str] = []

    # Recurse into dirs (each will apply its own 'order')
    for d in seq_dirs:
        out.extend(_walk_less_in_folder(d, base))

    # Then add files in this folder
    for file in ordered_files:
        out.append(f'@import {'('+", ".join(s for s in file.options)+') ' if file.options else ''}"{file.path.relative_to(base).as_posix()}";')
    for file in remaining_files:
        out.append(f'@import "{file.relative_to(base).as_posix()}";')

    return out

def _build_main_less_content(less_dir: Path) -> str:
    """
    Build main.less with header + @import lines for all .less files under less_dir,
    respecting per-folder 'order' files. Skips any 'main.less' encountered.
    """
    # Collect ordered files via traversal
    ordered = _walk_less_in_folder(less_dir, less_dir)

    # Build header + imports
    now = common.now_tmz()
    offset = now.utcoffset()
    offset_hours = (offset.total_seconds() / 3600) if offset else 0
    header = (
            "// File generated automatically.\n"
            "// Last Updated: "
            + now.strftime(f"%d/%m/%Y %H:%M:%S.{now.microsecond // 1000:03d} UTC{offset_hours:+.0f}")
            + "\n\n"
    )
    imports = "\n".join(s for s in ordered)
    return header + imports + ("\n" if imports else "")

def _write_if_body_changed(target: Path, new_content: str) -> bool:
    """
    First run: always overwrite if file exists with different body OR if not present.
    Later runs: only rewrite if body (everything after first two lines) changed.
    Returns True if file was written/updated.
    """
    created = not target.exists()
    if not created:
        existing = target.read_text(encoding="utf-8").splitlines()
        new = new_content.splitlines()
        # Ignore first 3 header lines
        existing_body = "\n".join(existing[3:])
        new_body = "\n".join(new[3:])
        if existing_body == new_body:
            return False
    target.write_text(new_content, encoding="utf-8")
    return True

def compile_less():
    project_dir = common.project_root()
    lessc = project_dir / "node_modules" / ".bin" / "lessc.cmd"
    less_dir = project_dir / "unofficial-FVTT-ose" / "less"
    main_less = less_dir / "main.less"
    output_css = project_dir / "unofficial-FVTT-ose" / "main.css"

    if not lessc.exists():
        print(f"lessc.cmd not found at: {lessc}")
        return
    if not less_dir.exists():
        print(f"LESS source dir not found: {less_dir}")
        sys.exit(1)

    # 1) Generate desired main.less content (alphabetical, no order preservation)
    new_main = _build_main_less_content(less_dir)

    # 2) Write only if body changed (ignoring first two header lines)
    changed = _write_if_body_changed(main_less, new_main)
    if changed:
        print(f"Updated {main_less}")

    # 3) Compile to CSS
    cmd = [str(lessc), str(main_less), str(output_css)]
    print(f"Running LESS compiler: {' '.join(cmd)}")
    try:
        subprocess.run(cmd, check=True)
        print("Compilation successful.")
    except subprocess.CalledProcessError as e:
        print(f"LESS compilation failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    compile_less()