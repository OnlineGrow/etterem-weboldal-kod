document.addEventListener('DOMContentLoaded', function() {
    console.log('Arany Kanál Étterem - Étlap szkript (frissített) betöltve!');

    // === KÖZÖS FUNKCIÓK (Maradnak, ahogy az eredeti fájlban, HTML ID-khoz igazítva) ===
    // --- Fejléc Görgetésre ---
    const header = document.getElementById('main-header');
    if (header) {
        const headerHeight = header.offsetHeight; let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > headerHeight) {
                header.classList.add('header-scrolled');
                const mainNavUl = document.querySelector('#main-nav-ul'); // Frissített ID
                if (scrollTop > lastScrollTop && scrollTop > headerHeight * 1.5 && mainNavUl && !mainNavUl.classList.contains('mobile-menu-active')) { 
                    header.style.top = `-${headerHeight}px`;
                } else { header.style.top = '0'; }
            } else {
                header.classList.remove('header-scrolled'); header.style.top = '0';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }

    // --- Mobil Menü Kezelése ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNavUl = document.getElementById('main-nav-ul'); // Frissített ID
    if (mobileMenuToggle && mainNavUl) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mainNavUl.classList.toggle('mobile-menu-active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            const icon = mobileMenuToggle.querySelector('i');
            if (isExpanded) {
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
            } else { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        });
        mainNavUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavUl.classList.contains('mobile-menu-active')) {
                    setTimeout(() => {
                        mainNavUl.classList.remove('mobile-menu-active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                        mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                    }, 150);
                }
            });
        });
    }

    // --- Lábléc Évszám ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    // --- Hírlevél Űrlap Kezelése (Láblécben) ---
    const newsletterFormFooter = document.getElementById('newsletterFormFooter'); 
    if (newsletterFormFooter) {
        const newsletterEmailInput = document.getElementById('newsletterEmailFooter'); 
        const newsletterStatus = document.getElementById('newsletterStatusFooter');
        if (newsletterEmailInput && newsletterStatus) {
           newsletterFormFooter.addEventListener('submit', function(event) {
               event.preventDefault();
               const email = newsletterEmailInput.value.trim();
               const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               newsletterStatus.textContent = ''; 
               newsletterStatus.className = 'newsletter-status'; 
               newsletterStatus.style.color = ''; 

               if (email === '') {
                   newsletterStatus.textContent = 'Kérjük, adja meg e-mail címét!'; 
                   newsletterStatus.style.color = 'var(--ak-error)';
               } else if (!emailPattern.test(email)) {
                   newsletterStatus.textContent = 'Érvénytelen e-mail formátum.'; 
                   newsletterStatus.style.color = 'var(--ak-error)';
               } else {
                   newsletterStatus.textContent = 'Feliratkozás feldolgozása...'; 
                   newsletterStatus.style.color = 'var(--ak-text-muted)';
                   // Szimulált küldés
                   setTimeout(() => {
                       newsletterStatus.textContent = 'Sikeres feliratkozás! Köszönjük.'; 
                       newsletterStatus.style.color = 'var(--ak-success)';
                       newsletterEmailInput.value = '';
                       // Üzenet eltüntetése
                       setTimeout(() => { 
                           newsletterStatus.textContent = ''; 
                           newsletterStatus.style.color = '';
                       }, 5000);
                   }, 1500);
               }
           });
        }
    }
    
    // --- "Scroll-to" Simítás ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
           const hrefAttribute = this.getAttribute('href');
           if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute !== "#") {
               try {
                   const targetElement = document.querySelector(hrefAttribute);
                   if (targetElement) {
                       e.preventDefault();
                       const headerOffset = header ? header.offsetHeight : 0;
                       const elementPosition = targetElement.getBoundingClientRect().top;
                       const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                       window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                   }
                } catch (error) {
                    console.warn("Scroll-to error: Invalid selector?", hrefAttribute, error);
                }
           }
        });
   });

    // --- Megjelenési Animációk Görgetésre ---
    const animatedElements = document.querySelectorAll('[data-animate], .animate-on-scroll');
    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }
    
    // --- Hero animáció (aloldali) ---
    const menuPageHeroContentElements = document.querySelectorAll('#menu-hero-section .hero-title-small, #menu-hero-section .hero-slogan-small');
     if (menuPageHeroContentElements.length > 0) {
        menuPageHeroContentElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.animation = `fadeInUpContentAnimation 0.7s ${index * 0.2 + 0.3}s ease-out forwards`;
        });
     }

    // === ÉTLAP OLDAL SPECIFIKUS LOGIKA ===

    // --- Elemek Referenciái ---
    const menuSearchInput = document.getElementById('menu-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allergenFilterToggle = document.getElementById('allergen-filter-toggle');
    const allergenFilterDropdown = document.getElementById('allergen-filter-dropdown');
    const allergenCheckboxes = allergenFilterDropdown ? allergenFilterDropdown.querySelectorAll('input[name="allergen"]') : [];
    const menuItemsGridContainer = document.getElementById('menu-items-grid'); 
    const allMenuItems = menuItemsGridContainer ? menuItemsGridContainer.querySelectorAll('.menu-item-card') : []; 
    const allMenuCategories = menuItemsGridContainer ? menuItemsGridContainer.querySelectorAll('.menu-category') : []; 
    const noResultsMessage = document.getElementById('no-results-message');

    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';
    let currentAllergenFilters = [];

    // --- Allergén Szűrő Dropdown Kezelése ---
    if (allergenFilterToggle && allergenFilterDropdown) {
        allergenFilterToggle.addEventListener('click', function() {
            const isExpanded = allergenFilterDropdown.style.display === 'block';
            allergenFilterDropdown.style.display = isExpanded ? 'none' : 'block';
            this.setAttribute('aria-expanded', String(!isExpanded)); // aria-expanded frissítése
        });

        // Dropdown bezárása, ha máshova kattintunk
        document.addEventListener('click', function(event) {
            // Csak akkor zárjuk be, ha a kattintás a gombon vagy a dropdownon kívül történt
            if (!allergenFilterToggle.contains(event.target) && !allergenFilterDropdown.contains(event.target)) {
                allergenFilterDropdown.style.display = 'none';
                allergenFilterToggle.setAttribute('aria-expanded', 'false');
            }
        });
    } else {
        console.warn("Allergen filter toggle or dropdown not found.");
    }

    // --- Fő Szűrő és Kereső Függvény ---
    function filterAndSearchMenuItems() {
        currentSearchTerm = menuSearchInput ? menuSearchInput.value.trim().toLowerCase() : '';
        currentAllergenFilters = [];
        allergenCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                currentAllergenFilters.push(checkbox.value);
            }
        });

        let hasVisibleItems = false; // Van-e látható elem összesen

        // 1. Minden étel kártya láthatóságának beállítása
        allMenuItems.forEach(item => {
            const itemCategories = (item.dataset.category || '').split(' ');
            // Allergének: vesszővel elválasztva, whitespace levágva
            const itemAllergens = (item.dataset.allergens || '').split(',').map(a => a.trim()).filter(a => a); 
            const itemTitle = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const itemDescription = item.querySelector('.description')?.textContent.toLowerCase() || '';

            // Kategória szűrés ('special' kategóriát is kezeli)
            const categoryMatch = currentCategoryFilter === 'all' || itemCategories.includes(currentCategoryFilter);

            // Keresés (címben VAGY leírásban)
            const searchMatch = currentSearchTerm === '' || itemTitle.includes(currentSearchTerm) || itemDescription.includes(currentSearchTerm);

            // Allergén szűrés (NINCS benne egyik tiltott allergén sem)
            const allergenMatch = currentAllergenFilters.length === 0 || !currentAllergenFilters.some(filter => itemAllergens.includes(filter));

            // Végső láthatóság
            if (categoryMatch && searchMatch && allergenMatch) {
                item.style.display = ''; // Alapértelmezett display (flex vagy block)
                hasVisibleItems = true; // Találtunk legalább egy látható elemet
            } else {
                item.style.display = 'none'; // Elem elrejtése
            }
        });

        // 2. Üres kategóriák elrejtése 
        allMenuCategories.forEach(category => {
            // Megszámoljuk a látható elemeket az adott kategórián BELÜL
            const visibleItemsInCategory = category.querySelectorAll('.menu-item-card:not([style*="display: none"])');
            if (visibleItemsInCategory.length === 0) {
                category.style.display = 'none'; // Kategória elrejtése
            } else {
                category.style.display = ''; // Kategória mutatása
            }
        });
        
        // 3. "Nincs találat" üzenet kezelése
        if (noResultsMessage) {
            noResultsMessage.style.display = hasVisibleItems ? 'none' : 'block'; // Csak akkor mutatjuk, ha SEMMI sincs
        }
    }

    // --- Eseménykezelők Hozzáadása ---
    if (menuSearchInput) {
        // 'input' eseményre fut le, ahogy a felhasználó gépel
        menuSearchInput.addEventListener('input', filterAndSearchMenuItems);
    } else {
        console.warn("Menu search input not found.");
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            currentCategoryFilter = this.dataset.filter;
            filterAndSearchMenuItems(); // Szűrés indítása
        });
    });

    allergenCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterAndSearchMenuItems); // Szűrés indítása
    });

    // --- Allergén Ikon Tooltip (Egyszerűsített) ---
    const allergenIcons = document.querySelectorAll('.allergen-icon[data-allergen-tooltip]');
    let tooltipElement = null; // Egyetlen tooltip elem létrehozása

    if (allergenIcons.length > 0) {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'allergen-tooltip'; 
        tooltipElement.setAttribute('role', 'tooltip'); // Akadálymentesség
        tooltipElement.style.position = 'absolute'; // Pozicionáláshoz
        tooltipElement.style.display = 'none'; // Alapból rejtett
        document.body.appendChild(tooltipElement); // Hozzáadás a body-hoz
    
        allergenIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function(event) {
                const tooltipText = this.dataset.allergenTooltip;
                if (!tooltipText || !tooltipElement) return;
    
                tooltipElement.textContent = tooltipText;
                tooltipElement.style.display = 'block';
                
                // Pozicionálás
                const rect = this.getBoundingClientRect();
                tooltipElement.style.left = `${rect.left + window.scrollX}px`;
                tooltipElement.style.top = `${rect.bottom + window.scrollY + 5}px`; 
            });
    
            icon.addEventListener('mouseleave', function() {
                if (tooltipElement) {
                    tooltipElement.style.display = 'none';
                }
            });
    
             // Akadálymentesség: focus esetén is megjelenhetne
             icon.addEventListener('focus', (event) => { 
                 const tooltipText = event.target.dataset.allergenTooltip;
                 if (!tooltipText || !tooltipElement) return;
                 tooltipElement.textContent = tooltipText;
                 tooltipElement.style.display = 'block';
                 const rect = event.target.getBoundingClientRect();
                 tooltipElement.style.left = `${rect.left + window.scrollX}px`;
                 tooltipElement.style.top = `${rect.bottom + window.scrollY + 5}px`; 
              });
             icon.addEventListener('blur', () => { 
                 if (tooltipElement) {
                     tooltipElement.style.display = 'none';
                 }
              });
        });
    }

    // --- Valós idejű várakozási idő frissítése (mock) ---
    const waitTimeSpanMenu = document.getElementById('wait-time-value-menu');
    if (waitTimeSpanMenu) {
        function updateWaitTimeMenu() {
             const currentHour = new Date().getHours();
             let baseWaitMin, baseWaitMax;
 
             if (currentHour >= 12 && currentHour < 14) { 
                 baseWaitMin = 12; baseWaitMax = 22;
             } else if (currentHour >= 18 && currentHour < 21) { 
                 baseWaitMin = 18; baseWaitMax = 35;
             } else { 
                 baseWaitMin = 6; baseWaitMax = 14;
             }
             const randomFactor = Math.floor(Math.random() * 6) - 3; 
             const finalWaitMin = Math.max(0, baseWaitMin + randomFactor);
             const finalWaitMax = Math.max(finalWaitMin + 5, baseWaitMax + randomFactor);
             
             waitTimeSpanMenu.textContent = `${finalWaitMin}-${finalWaitMax}p`;
        }
        updateWaitTimeMenu(); // Azonnali frissítés
        setInterval(updateWaitTimeMenu, 60000); // Percenkénti frissítés
    }

    // Első szűrés lefuttatása betöltéskor, hogy minden megjelenjen helyesen
    if (allMenuItems.length > 0) {
        filterAndSearchMenuItems();
    }

}); // DOMContentLoaded vége