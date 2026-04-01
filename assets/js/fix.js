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

  const sectionRegex = /<!-- Category Navigation -->\s*<section[\s\S]*?<\/section>/;
  
  let btns = {
    'blog-car-care.html': 'Car Care',
    'blog-ceramic.html': 'Ceramic Coating',
    'blog-restoration.html': 'Restoration Stories',
    'blog-events.html': 'Event Coverage',
    'blog-404.html': '' 
  };
  
  let active = btns[file];

  // PILL STYLE + SCROLL FIX
  const getPill = (text, href) => {
    if (text === active) {
        return `<button class="px-4 md:px-5 py-2 rounded-full bg-primary text-white text-[10px] md:text-[11px] font-bold tracking-widest uppercase shadow-md shadow-primary/20 whitespace-nowrap flex-shrink-0">${text}</button>`;
    }
    return `<a href="${href}" class="px-4 md:px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-[10px] md:text-[11px] font-medium tracking-widest uppercase border border-transparent whitespace-nowrap flex-shrink-0">${text}</a>`;
  };

  const navHTML = `<!-- Category Navigation -->
<section class="sticky top-[56px] lg:top-[72px] z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md transition-colors duration-300 w-full mb-8">
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex gap-2 sm:gap-3 items-center overflow-x-auto no-scrollbar py-3">
${getPill('All Stories', 'blog.html')}
${getPill('Car Care', 'blog-car-care.html')}
${getPill('Ceramic Coating', 'blog-ceramic.html')}
${getPill('Restoration Stories', 'blog-restoration.html')}
${getPill('Event Coverage', 'blog-events.html')}
</div>
</div>
</section>`;

  content = content.replace(sectionRegex, navHTML);
  fs.writeFileSync(basePath + file, content);
});

// Update blog.html separately
let blogContent = fs.readFileSync(basePath + 'blog.html', 'utf8');

const blogSectionRegex = /<!-- Category Navigation -->\s*<section[\s\S]*?<\/section>/;

// BOX STYLE + SCROLL FIX
const getBox = (text, href) => {
    if (text === 'All Stories') {
         return `<button class="bg-primary text-white text-[10px] md:text-[11px] font-bold tracking-widest uppercase px-4 md:px-5 py-2 border border-primary shadow-md shadow-primary/20 whitespace-nowrap flex-shrink-0 rounded-[2px]">${text}</button>`;
    }
     return `<a href="${href}" class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:text-primary transition-colors text-[10px] md:text-[11px] font-medium tracking-widest uppercase px-4 md:px-5 py-2 shadow-sm rounded-[2px] whitespace-nowrap flex-shrink-0">${text}</a>`;
};

const blogNavHTML = `<!-- Category Navigation -->
<section class="sticky top-[56px] lg:top-[72px] z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md transition-colors duration-300 w-full mb-8 pt-0 pl-0 mt-0">
<div class="max-w-7xl mx-auto px-6 lg:px-20">
<div class="flex gap-2 sm:gap-3 items-center overflow-x-auto no-scrollbar py-3 w-full">
${getBox('All Stories', 'blog.html')}
${getBox('Car Care', 'blog-car-care.html')}
${getBox('Ceramic Coating', 'blog-ceramic.html')}
${getBox('Restoration Stories', 'blog-restoration.html')}
${getBox('Event Coverage', 'blog-events.html')}
</div>
</div>
</section>`;

blogContent = blogContent.replace(blogSectionRegex, blogNavHTML);
fs.writeFileSync(basePath + 'blog.html', blogContent);

console.log("Updated styling.");
