/* ==========================================================================
   吴荣展 Portfolio Resume JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle (Dark / Light Mode) ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });


    // --- 2. Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpened = navMenu.classList.contains('active');
        mobileToggle.querySelector('i').className = isOpened ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        });
    });


    // --- 3. Experience Section Tab Swapping ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            
            // Toggle active buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active panels
            tabPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });


    // --- 4. Awards Section Tab Swapping ---
    const awardsTabBtns = document.querySelectorAll('.awards-tab-btn');
    const awardsTabPanes = document.querySelectorAll('.awards-tab-pane');

    awardsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-awards-tab');
            
            // Toggle active buttons
            awardsTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active panels
            awardsTabPanes.forEach(pane => {
                if (pane.id === targetId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });


    // --- 5. Interactive Table Live Search Filter ---
    const setupTableSearch = (inputId, tableId) => {
        const searchInput = document.getElementById(inputId);
        const table = document.getElementById(tableId);
        if (!searchInput || !table) return;

        const rows = table.querySelectorAll('tbody tr');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            rows.forEach(row => {
                const searchContent = row.getAttribute('data-search') 
                    ? row.getAttribute('data-search').toLowerCase() 
                    : row.innerText.toLowerCase();
                
                if (searchContent.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    };

    setupTableSearch('personalSearch', 'personalAwardsTable');
    setupTableSearch('studentSearch', 'studentAwardsTable');


    // --- 6. Lightbox Modal for Certificate / Image Viewing ---
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = document.getElementById('lightboxOverlay');

    const openLightbox = (imageSrc, captionText) => {
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = captionText || '證書及證明文件';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scrolling
        // Clear src after fade-out transition completes to avoid flashing when reopening
        setTimeout(() => {
            if (!lightboxModal.classList.contains('active')) {
                lightboxImage.src = '';
            }
        }, 300);
    };

    // Attach listeners to all lightbox trigger elements
    document.body.addEventListener('click', (e) => {
        // Find if clicked element or parent has data-cert attribute
        const targetBtn = e.target.closest('[data-cert]');
        if (!targetBtn) return;

        e.preventDefault();
        const certSrc = targetBtn.getAttribute('data-cert');
        
        // Find corresponding caption text
        let caption = '';
        const parentRow = targetBtn.closest('tr');
        const parentCard = targetBtn.closest('.edu-card');
        
        if (parentRow) {
            // It's a row in the table, extract name
            const cells = parentRow.querySelectorAll('td');
            if (cells.length > 2) {
                const year = cells[0].textContent.trim();
                const title = cells[2].textContent.trim();
                caption = `${year} — ${title}`;
            }
        } else if (parentCard) {
            // It's education degree
            const eduTitle = parentCard.querySelector('h3').textContent.trim();
            caption = eduTitle;
        } else if (targetBtn.classList.contains('view-original-table')) {
            caption = '指導學生獲獎紀錄原始對照圖表';
        }

        openLightbox(certSrc, caption);
    });

    // Close buttons
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Keyboard ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });


    // --- 7. Smooth Scroll Active Link Highlight (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies core viewport
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
});
