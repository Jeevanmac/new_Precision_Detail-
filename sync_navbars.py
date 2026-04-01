import os
import glob
import re

# Use the absolute path for the pages directory
directory = r"d:\stitch\apex-detail-template\pages"

# The target class string we want to enforce on all navbars
target_cls = 'class="flex items-center justify-between px-4 lg:px-6 py-2 bg-transparent fixed top-0 left-0 w-full z-50 transition-all duration-500"'

# Find all HTML files in the pages directory
files = glob.glob(os.path.join(directory, "*.html"))

for filepath in files:
    # Skip index.html since it's our reference
    if os.path.basename(filepath) == "index.html":
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find <header id="navbar" ...> and replace its class attribute
    # This matches the <header id="navbar" part and replaces everything until the first closing >
    
    pattern = r'(<header\s+id="navbar"\s+)[^>]*>'
    replacement = r'\1' + target_cls + r'>'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"No changes for: {os.path.basename(filepath)}")
