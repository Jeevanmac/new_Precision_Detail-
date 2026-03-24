import os
import subprocess

# 1. Checkout dashboard.html
subprocess.run(['git', 'checkout', 'pages/dashboard.html'], cwd=r'd:\stitch\apex-detail-template')

# 2. Re-apply adds
subprocess.run(['python', 'add_logo.py'], cwd=r'd:\stitch\apex-detail-template')

# 3. Update href="user-profile.html" to href="user-dashboard.html" in all HTML files
pages_dir = r"d:\stitch\apex-detail-template\pages"
for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace only in the dropdown
        old_str = '<a href="user-profile.html" class="px-3 py-2 text-[10px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary">User</a>'
        new_str = '<a href="user-dashboard.html" class="px-3 py-2 text-[10px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary">User</a>'
        
        if old_str in content:
            new_content = content.replace(old_str, new_str)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        elif 'href="user-dashboard.html"' in content:
            pass # Already updated
        else:
            # Maybe spacing is different, let's try regex
            import re
            pattern = re.compile(r'<a href="user-profile\.html"([^>]*)>User</a>')
            new_content, count = pattern.subn(r'<a href="user-dashboard.html"\1>User</a>', content)
            if count > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename} via regex")

print("Done restoring and linking.")
