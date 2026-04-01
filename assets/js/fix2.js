const fs = require('fs');

const basePath = 'd:/stitch/apex-detail-template/pages/';
const articleFiles = [
  'blog-car-care.html',
  'blog-restoration.html',
  'blog-404.html',
  'blog-ceramic.html',
  'blog-events.html'
];

articleFiles.forEach(file => {
  let content = fs.readFileSync(basePath + file, 'utf8');

  // Find the category navigation section
  const sectionRegex = /(<!-- Category Navigation -->\s*<section class="sticky top-\[56px\] lg:top-\[72px\] z-\[40\] border-b border-slate-200 dark:border-slate-800 bg-white\/95 dark:bg-\[#030712\]\/95 backdrop-blur-md transition-colors duration-300 w-full mb-8\">[\s\S]*?<\/section>)/;
  
  let match = content.match(sectionRegex);
  if (match) {
    let sectionContent = match[1];
    
    // 1. Center alignment on tablet/desktop
    // Replace 'items-center overflow-x-auto' with 'items-center md:justify-center overflow-x-auto'
    sectionContent = sectionContent.replace('items-center overflow-x-auto', 'items-center md:justify-center overflow-x-auto');
    
    // 2. Change rounded-full to rounded-none
    sectionContent = sectionContent.replace(/rounded-full/g, 'rounded-none');
    
    // Apply changes
    content = content.replace(sectionRegex, sectionContent);
    fs.writeFileSync(basePath + file, content);
  } else {
    console.error('Failed to find navigation section in ' + file);
  }
});
console.log('Done altering sub-blog navigation');
