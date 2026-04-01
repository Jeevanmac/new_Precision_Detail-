const fs = require('fs');

const basePath = 'd:/stitch/apex-detail-template/pages/';
const articleFiles = [
  'blog-car-care.html',
  'blog-restoration.html',
  'blog-404.html',
  'blog-events.html',
  'blog.html'
];

articleFiles.forEach(file => {
  let content = fs.readFileSync(basePath + file, 'utf8');

  // Regex to match the h2 tag for the logo text if it lacks hidden md:block
  const regex = /<h2 class="text-slate-900 dark:text-slate-100 text-sm font-black leading-tight tracking-tighter hover:text-primary transition-colors uppercase italic relative">/g;
  
  content = content.replace(regex, '<h2 class="text-slate-900 dark:text-slate-100 text-sm font-black leading-tight tracking-tighter hover:text-primary transition-colors uppercase italic relative hidden md:block">');
  
  fs.writeFileSync(basePath + file, content);
});

console.log("Updated header text visibility on mobile.");
