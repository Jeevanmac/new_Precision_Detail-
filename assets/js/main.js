document.addEventListener('DOMContentLoaded', () => {
    // 0. Glass Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
   if (navbar) {
        const onScroll = () => {
            if (window.scrollY > 40) {
            const isAlwaysScrolled = navbar.classList.contains('always-scrolled') || 
                (navbar.classList.contains('always-scrolled-light') && !document.documentElement.classList.contains('dark'));
            
            if (isAlwaysScrolled || window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Run once on load in case page is already scrolled
    }


    const html = document.documentElement;
    const themeToggles = document.querySelectorAll('[id^="theme-toggle"]');
    const dirToggles = document.querySelectorAll('[id^="dir-toggle"]');

    // Theme Logic
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
    }

    const updateThemeIcons = () => {
        
        const isDark = html.classList.contains('dark');
        themeToggles.forEach(btn => {
            const darkIcon = btn.querySelector('.hidden.dark\\:block');
            const lightIcon = btn.querySelector('.dark\\:hidden');
            if (isDark) {
                if (darkIcon) darkIcon.style.display = 'block';
                if (lightIcon) lightIcon.style.display = 'none';
            } else {
                if (darkIcon) darkIcon.style.display = 'none';
                if (lightIcon) lightIcon.style.display = 'block';
            }
        });
    };

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.add('dark');
                html.classList.remove('light');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeIcons();
            window.dispatchEvent(new Event('scroll'));
        });
    });

    // Direction Logic
    const currentDir = localStorage.getItem('dir') || 'ltr';
    html.setAttribute('dir', currentDir);
    dirToggles.forEach(btn => btn.textContent = currentDir.toUpperCase());

    dirToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
            html.setAttribute('dir', newDir);
            dirToggles.forEach(btn => btn.textContent = newDir.toUpperCase());
            localStorage.setItem('dir', newDir);
        });
    });

    // 2. Global Hover Effects for Cards
    // Select any container that looks like a card based on typical Tailwind class names used in these templates
    const possibleCards = document.querySelectorAll(
        '.group, [class*="rounded-2xl"], [class*="rounded-xl"], article'
    );

    possibleCards.forEach(card => {
        // Verify it's not a button or input to avoid breaking interactive elements
        if (card.tagName.toLowerCase() === 'button' || card.tagName.toLowerCase() === 'input' || card.tagName.toLowerCase() === 'a') return;
        
        // Often cards have extensive padding or images
        const hasBackground = card.className.includes('bg-') || card.className.includes('border');
        if (!hasBackground) return;

        // Apply transition styling for the card uplift
        card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease';
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            
            // Find images and zoom them
            const images = card.querySelectorAll('img, [style*="background-image"]');
            images.forEach(img => {
                // Determine if it's the main parent for an image cover
                if(img.style) {
                    img.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    img.style.transform = 'scale(1.1)';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
            
            // Restore image zoom
            const images = card.querySelectorAll('img, [style*="background-image"]');
            images.forEach(img => {
                if(img.style) {
                    img.style.transform = 'scale(1)';
                }
            });
        });
    });

    // 3. Click-Based Dropdowns
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parent = trigger.closest('.relative');
            const dropdown = parent.querySelector('.nav-dropdown');
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.add('opacity-0', 'invisible');
                    d.classList.remove('opacity-100', 'visible');
                }
            });

            // Toggle current
            const isVisible = dropdown.classList.contains('visible');
            if (isVisible) {
                dropdown.classList.add('opacity-0', 'invisible');
                dropdown.classList.remove('opacity-100', 'visible');
            } else {
                dropdown.classList.remove('opacity-0', 'invisible');
                dropdown.classList.add('opacity-100', 'visible');
            }
        });
    });

    // 4. Mobile Menu Drawer Logic
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');

    const openDrawer = () => {
        mobileDrawer.classList.remove('translate-x-full');
        mobileDrawer.classList.add('translate-x-0');
        drawerOverlay.classList.remove('opacity-0', 'invisible');
        drawerOverlay.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    };

    const closeDrawer = () => {
        mobileDrawer.classList.add('translate-x-full');
        mobileDrawer.classList.remove('translate-x-0');
        drawerOverlay.classList.add('opacity-0', 'invisible');
        drawerOverlay.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = '';
    };

    if (mobileMenuTrigger) {
        mobileMenuTrigger.addEventListener('click', openDrawer);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDrawer();
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Close drawer on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });

    // 5. Coming Soon Floating Button Injection
    const footerBtn = document.createElement('a');
    footerBtn.href = 'coming-soon.html';
    footerBtn.className = 'fixed bottom-24 md:bottom-6 right-6 z-[60] bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white p-3 rounded-full shadow-2xl flex items-center gap-0 group transition-all active:scale-95 overflow-hidden w-12 hover:w-40 border border-white/20';
    footerBtn.innerHTML = `
        <span class="material-symbols-outlined text-[24px]">rocket_launch</span>
        <span class="font-black text-[10px] uppercase tracking-widest ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
    `;
    document.body.appendChild(footerBtn);

    // 6. Global Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const submitBtn = form.querySelector('button[type="submit"]');

            // Reset previous visual errors
            form.querySelectorAll('.border-red-500').forEach(el => {
                el.classList.remove('border-red-500', 'ring-red-500', 'ring-1', '!border-red-500');
            });
            form.querySelectorAll('.text-red-500').forEach(el => {
                if(el.tagName === 'SPAN' && el.classList.contains('absolute')) {
                     el.classList.remove('text-red-500');
                }
            });

            // Find all inputs (exclude hidden/checkboxes)
            const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), textarea, select');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input);
                }
                
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        showError(input);
                    }
                }
            });

            if (isValid && submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.classList.add('bg-emerald-500', '!text-white', 'border-emerald-500');
                submitBtn.classList.remove('bg-primary', 'bg-orange-600');
                submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> Validating...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span> Success';
                    setTimeout(() => {
                        submitBtn.classList.remove('bg-emerald-500', '!text-white', 'border-emerald-500');
                        submitBtn.classList.add(submitBtn.hasAttribute('data-original-bg') ? submitBtn.getAttribute('data-original-bg') : 'bg-primary');
                        submitBtn.innerHTML = originalText;
                        if (!form.classList.contains('no-reset')) form.reset();
                    }, 2000);
                }, 1000);
            }
        });
    });

    function showError(input) {
        input.classList.add('border-red-500', 'ring-red-500', 'ring-1', '!border-red-500', 'transition-all');
        const parent = input.parentElement;
        if(parent.classList.contains('relative')){
             const icon = parent.querySelector('span.absolute');
             if(icon) icon.classList.add('text-red-500');
        }
    }
});
