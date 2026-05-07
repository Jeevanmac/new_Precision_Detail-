import os
import re

directory = r"d:\stitch\apex-detail-template\pages"

# Read index.html to extract the reference blocks
index_path = os.path.join(directory, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

# Extract header
header_match = re.search(r'<header id="navbar"[\s\S]*?</header>', index_content)
if not header_match:
    print("Could not find header in index.html")
    exit(1)
ref_header = header_match.group(0)

# Extract mobile drawer
drawer_match = re.search(r'<!-- Mobile Drawer Overlay -->[\s\S]*?<!-- End Mobile Drawer -->', index_content)
ref_drawer = drawer_match.group(0) if drawer_match else ""

# Extract footer
footer_match = re.search(r'<footer[\s\S]*?</footer>', index_content)
if not footer_match:
    print("Could not find footer in index.html")
    exit(1)
ref_footer = footer_match.group(0)

nav_mapping = {
    "index.html": "nav-home",
    "home2.html": "nav-home",
    "services.html": "nav-services",
    "gallery.html": "nav-gallery",
    "gallery-paint.html": "nav-gallery",
    "gallery-macro.html": "nav-gallery",
    "gallery-interior.html": "nav-gallery",
    "gallery-restoration.html": "nav-gallery",
    "blog.html": "nav-blog",
    "blog-single.html": "nav-blog",
    "blog-restoration.html": "nav-blog",
    "blog-events.html": "nav-blog",
    "blog-ceramic.html": "nav-blog",
    "blog-car-care.html": "nav-blog",
    "contact.html": "nav-contact",
    "about.html": "nav-about",
    "dashboard.html": "nav-dashboard",
    "user-dashboard.html": "nav-dashboard",
    "user-profile.html": "nav-dashboard"
}

def get_highlighted_header(header_html, filename):
    current_nav_class = nav_mapping.get(filename)
    if not current_nav_class:
        return header_html
    
    highlight_classes = "text-primary font-black scale-105"
    default_classes = "text-slate-600 dark:text-slate-400"
    
    # Find all nav items
    # We look for tags that have a class containing 'nav-'
    # Example: <a class="nav-home ...">
    
    def replace_class(match):
        full_tag = match.group(0)
        class_content = match.group(1)
        
        # Check if it has a valid nav category class
        nav_match = re.search(r'\bnav-(home|services|gallery|blog|contact|about|dashboard)\b', class_content)
        if not nav_match:
            return full_tag
            
        nav_class = "nav-" + nav_match.group(1)
        
        # Start with the original class content
        new_classes = class_content
        
        # Remove existing highlight and default classes to start fresh
        new_classes = new_classes.replace(highlight_classes, "").replace(default_classes, "").strip()
        
        if nav_class == current_nav_class:
            new_classes += " " + highlight_classes
        else:
            new_classes += " " + default_classes
            
        # Clean up whitespace
        new_classes = re.sub(r'\s+', ' ', new_classes).strip()
        
        return full_tag.replace(class_content, new_classes)

    # Regex to find class attribute content that contains our nav categories
    return re.sub(r'class="([^"]*?\bnav-(?:home|services|gallery|blog|contact|about|dashboard)\b[^"]*)"', replace_class, header_html)

for filename in os.listdir(directory):
    if not filename.endswith(".html"):
        continue
    
    # Skip login and register pages as they have custom headers
    if filename in ["login.html", "register.html"]:
        print(f"Skipping {filename} (custom header preserved)")
        continue
    
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    original_content = content
    
    # Get header for this specific file
    file_header = get_highlighted_header(ref_header, filename)
    
    # 1. Replace header
    content = re.sub(r'<header[\s\S]*?</header>', file_header, content, count=1)
    
    # 2. Replace or insert drawer
    if '<!-- Mobile Drawer Overlay -->' in content:
        content = re.sub(r'<!-- Mobile Drawer Overlay -->[\s\S]*?<!-- End Mobile Drawer -->', ref_drawer, content)
    elif ref_drawer:
        # Insert after header
        content = content.replace('</header>', '</header>\n\n' + ref_drawer, 1)
    
    # 3. Replace footer
    content = re.sub(r'<footer[\s\S]*?</footer>', ref_footer, content, count=1)
    
    # 4. Standardize side spacing in main containers
    # Target common patterns like max-w-7xl mx-auto px-6
    content = re.sub(r'class="([^"]*max-w-[^"]*mx-auto[^"]*)px-6([^"]*)"', r'class="\1px-6 lg:px-20\2"', content)
    
    # 5. Remove WhatsApp buttons
    content = re.sub(r'<!--\s*FLOATING BUTTONS\s*-->\s*<div[^>]*>\s*<a[^>]*href="https://wa\.me/[^>]*>[\s\S]*?</a>\s*</div>', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<div[^>]*class="[^"]*fixed[^"]*bottom-[^"]*"[^>]*>\s*<a[^>]*href="https://wa\.me/[^>]*>[\s\S]*?</a>\s*</div>', '', content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No changes needed for {filename}")

print("Done.")
