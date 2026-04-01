const fs = require('fs');
const files = [
  'blog-car-care.html',
  'blog-restoration.html',
  'blog-404.html',
  'blog-ceramic.html',
  'blog-events.html'
];
const basePath = 'd:/stitch/apex-detail-template/pages/';

files.forEach(file => {
  let content = fs.readFileSync(basePath + file, 'utf8');

  // Find the <main> tag start
  content = content.replace(/<main class="max-w-4xl[^"]+">/, '<main class="w-full flex flex-col min-h-screen pt-24 md:pt-[10%]">');

  // Replace the <section> block up to its end tag
  const sectionRegex = /<!-- Category Navigation -->\s*<section[\s\S]*?<\/section>/;
  
  // Decide which button is active based on the file name
  let btns = {
    'blog-car-care.html': 'Car Care',
    'blog-ceramic.html': 'Ceramic Coating',
    'blog-restoration.html': 'Restoration Stories',
    'blog-events.html': 'Event Coverage',
    'blog-404.html': '' // none active
  };
  
  let active = btns[file];

  const getAUrl = (text, href) => {
    if (text === active) {
        return `<button class="border-b-[3px] border-primary text-primary font-black py-4 text-[11px] sm:text-[13px] tracking-widest uppercase transition-colors">${text}</button>`;
    }
    return `<a href="${href}" class="border-b-[3px] border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 py-4 text-[11px] sm:text-[13px] font-bold tracking-widest uppercase transition-colors">${text}</a>`;
  };

  const navHTML = `<!-- Category Navigation -->
<section class="sticky top-[56px] lg:top-[72px] z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md transition-colors duration-300 w-full mb-8">
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex gap-6 sm:gap-8 items-center min-w-max overflow-x-auto no-scrollbar">
${getAUrl('All Stories', 'blog.html')}
${getAUrl('Car Care', 'blog-car-care.html')}
${getAUrl('Ceramic Coating', 'blog-ceramic.html')}
${getAUrl('Restoration Stories', 'blog-restoration.html')}
${getAUrl('Event Coverage', 'blog-events.html')}
</div>
</div>
</section>
<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">`;

  content = content.replace(sectionRegex, navHTML);

  if (content.indexOf('<!-- Category Navigation -->') === -1) {
    console.error("Failed to replace in file " + file);
  }

  // Replace </main> with </div></main>
  if(content.indexOf('</div>\n</main>') === -1 && content.indexOf('</div></main>') === -1) {
     content = content.replace(/<\/main>/, '</div>\n</main>');
  }

  fs.writeFileSync(basePath + file, content);
});

// Update blog.html separately
let blogContent = fs.readFileSync(basePath + 'blog.html', 'utf8');

const blogSectionRegex = /<!-- Categories -->\s*<section[\s\S]*?<\/section>/;

const getBlogAUrl = (text, href) => {
    if (text === 'All Stories') {
        return `<button class="border-b-[3px] border-primary text-primary font-black py-4 text-[11px] sm:text-[13px] tracking-widest uppercase transition-colors">${text}</button>`;
    }
    return `<a href="${href}" class="border-b-[3px] border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 py-4 text-[11px] sm:text-[13px] font-bold tracking-widest uppercase transition-colors">${text}</a>`;
  };

const blogNavHTML = `<!-- Categories -->
<section class="sticky top-[56px] lg:top-[72px] z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#030712]/95 backdrop-blur-md transition-colors duration-300 w-full mb-8">
<div class="max-w-7xl mx-auto px-6 lg:px-20">
<div class="flex gap-6 sm:gap-8 items-center min-w-max overflow-x-auto no-scrollbar">
${getBlogAUrl('All Stories', 'blog.html')}
${getBlogAUrl('Car Care', 'blog-car-care.html')}
${getBlogAUrl('Ceramic Coating', 'blog-ceramic.html')}
${getBlogAUrl('Restoration Stories', 'blog-restoration.html')}
${getBlogAUrl('Event Coverage', 'blog-events.html')}
</div>
</div>
</section>
<div class="max-w-7xl mx-auto px-6 lg:px-20 pb-12 flex-1 w-full">`;

blogContent = blogContent.replace(/<main class="flex-1 px-6 py-12 lg:px-20 pt-\[5%\] max-w-7xl mx-auto">/, '<main class="w-full flex flex-col min-h-screen pt-24 md:pt-[10%]">');
blogContent = blogContent.replace(blogSectionRegex, blogNavHTML);

if(blogContent.indexOf('</div>\n</main>') === -1 && blogContent.indexOf('</div></main>') === -1) {
    blogContent = blogContent.replace(/<\/main>/, '</div>\n</main>');
}

fs.writeFileSync(basePath + 'blog.html', blogContent);

console.log("Done");
