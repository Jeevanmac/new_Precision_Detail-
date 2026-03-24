import os
import re

pages_dir = r"d:\stitch\apex-detail-template\pages"

logo_img_tag = '<img src="../assets/images/logo.png" alt="Precision Detail Logo" class="w-8 h-8 rounded-full object-cover object-center shadow-sm" />'
favicon_tag = '<link rel="icon" type="image/png" href="../assets/images/logo.png">'

count = 0
for filename in os.listdir(pages_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        changed = False

        # Insert favicon before </head>
        if favicon_tag not in content:
            content = content.replace('</head>', f'    {favicon_tag}\n</head>')
            changed = True
        
        # 1. Desktop Header Logo
        # Find: <a ...><h2 ...>Precision Detail
        pattern = re.compile(r'(<a[^>]*href="index\.html"[^>]*>)\s*(<h2[^>]*>\s*Precision Detail)', re.IGNORECASE)
        if pattern.search(content) and logo_img_tag not in pattern.search(content).group(0):
            # Only replace if logo not already inserted
            if 'assets/images/logo.png' not in content:
                content = pattern.sub(r'\1\n                ' + logo_img_tag + r'\n                \2', content)
                changed = True

        # 2. Mobile Drawer Logo
        drawer_pattern = re.compile(r'(<div class="flex items-center gap-2">)\s*(<h2[^>]*>\s*Precision Detail)', re.IGNORECASE)
        if drawer_pattern.search(content):
            # To avoid duplicate inserts, check if the logo is already near this match
            content = drawer_pattern.sub(lambda m: m.group(1) + '\n            ' + logo_img_tag + '\n            ' + m.group(2) if 'assets/images/logo.png' not in m.string[max(0, m.start()-100):m.end()+100] else m.group(0), content)
            changed = True

        if changed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"Updated {filename}")

print(f"Successfully processed {count} files.")
