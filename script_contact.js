document.addEventListener('DOMContentLoaded', function() {
    console.log('Arany Kanál Étterem - Kapcsolat szkript (frissített) betöltve!');

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
    const contactPageHeroContentElements = document.querySelectorAll('#contact-hero-section .hero-title-small, #contact-hero-section .hero-slogan-small');
    if (contactPageHeroContentElements.length > 0) {
       contactPageHeroContentElements.forEach((el, index) => {
           el.style.opacity = '0';
           el.style.transform = 'translateY(20px)';
           el.style.animation = `fadeInUpContentAnimation 0.7s ${index * 0.2 + 0.3}s ease-out forwards`;
       });
    }

    // === KAPCSOLATI OLDAL SPECIFIKUS LOGIKA ===

    // --- Kapcsolati Űrlap Kezelése ---
    const mainContactForm = document.getElementById('mainContactForm');
    if (mainContactForm) {
        const contactFormStatus = document.getElementById('contactFormStatus');
        const contactNameInput = document.getElementById('contact-name');
        const contactEmailInput = document.getElementById('contact-email');
        const contactMessageInput = document.getElementById('contact-message');
        const contactSubjectInput = document.getElementById('contact-subject'); 

        // Hibajelző segédfüggvények
        function setContactFieldError(field, message) {
            field.classList.add('input-error');
            const errorElementId = field.getAttribute('aria-describedby');
            const errorElement = errorElementId ? document.getElementById(errorElementId) : null;
            if (errorElement) { 
                errorElement.textContent = message; 
                errorElement.style.display = 'block';
            }
            field.setAttribute('aria-invalid', 'true');
        }

        function clearContactFieldError(field) {
            field.classList.remove('input-error');
            const errorElementId = field.getAttribute('aria-describedby');
            const errorElement = errorElementId ? document.getElementById(errorElementId) : null;
            if (errorElement) { 
                errorElement.textContent = '';
                errorElement.style.display = 'none'; 
            }
            field.removeAttribute('aria-invalid');
        }

        mainContactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
            contactFormStatus.textContent = '';
            contactFormStatus.className = 'form-status'; // Alap class
            contactFormStatus.style.display = 'none'; // Alapból rejtett

            // Előző hibák törlése
            mainContactForm.querySelectorAll('.input-error').forEach(field => clearContactFieldError(field));
            
            // Név validáció
            if (contactNameInput.value.trim() === '') { 
                setContactFieldError(contactNameInput, 'A név kitöltése kötelező.'); 
                isValid = false; 
            }
            
            // Email validáció
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (contactEmailInput.value.trim() === '') {
                setContactFieldError(contactEmailInput, 'Az e-mail cím kitöltése kötelező.');
                isValid = false;
            } else if (!emailPattern.test(contactEmailInput.value.trim())) { 
                setContactFieldError(contactEmailInput, 'Kérjük, érvényes e-mail címet adjon meg.'); 
                isValid = false; 
            }
            
            // Üzenet validáció
            if (contactMessageInput.value.trim() === '') { 
                setContactFieldError(contactMessageInput, 'Az üzenet nem lehet üres.'); 
                isValid = false; 
            } else if (contactMessageInput.value.trim().length < 10) { // Minimum hossz
                setContactFieldError(contactMessageInput, 'Az üzenetnek legalább 10 karakter hosszúnak kell lennie.');
                isValid = false;
            }

            // --- Küldés vagy Hiba ---
            if (isValid) {
                contactFormStatus.textContent = 'Üzenet küldése...';
                contactFormStatus.style.display = 'block';
                contactFormStatus.style.color = 'var(--ak-text-muted)';
                contactFormStatus.classList.remove('error', 'success'); // Töröljük a korábbi állapotokat

                // Szimulált küldés (ezt backendnek kellene kezelnie)
                setTimeout(() => {
                    // Sikeres küldés üzenet
                    contactFormStatus.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i>Köszönjük üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.`;
                    contactFormStatus.classList.add('success');
                    contactFormStatus.style.color = ''; // Töröljük az inline stílust
                    mainContactForm.reset(); // Űrlap ürítése
                    
                    // Hibaállapotok törlése az űrlapmezőkről reset után
                    mainContactForm.querySelectorAll('input, textarea').forEach(field => clearContactFieldError(field));

                    // Üzenet eltüntetése
                    setTimeout(() => {
                        contactFormStatus.textContent = '';
                        contactFormStatus.style.display = 'none';
                        contactFormStatus.className = 'form-status';
                    }, 8000);
                }, 1500);
            } else {
                // Hibaüzenet
                contactFormStatus.textContent = 'Kérjük, ellenőrizze és javítsa a pirossal jelölt mezőket.';
                contactFormStatus.classList.add('error');
                contactFormStatus.style.display = 'block';
                
                // Fókusz az első hibás mezőre
                const firstErrorField = mainContactForm.querySelector('[aria-invalid="true"]');
                if (firstErrorField) { 
                    firstErrorField.focus();
                }
            }
        });
    } else {
         console.warn("Contact form (#mainContactForm) not found.");
    }

    // --- Valós idejű várakozási idő frissítése (mock) ---
    const waitTimeSpanContact = document.getElementById('wait-time-value-contact');
    if (waitTimeSpanContact) {
        function updateWaitTimeContact() {
            const currentHour = new Date().getHours();
            let baseWaitMin, baseWaitMax;

            // Enyhén eltérő logika, mint a booking oldalon
            if (currentHour >= 12 && currentHour < 14) { // Ebédidő
                baseWaitMin = 8; baseWaitMax = 20;
            } else if (currentHour >= 18 && currentHour < 21) { // Vacsoraidő
                baseWaitMin = 12; baseWaitMax = 30;
            } else { // Egyéb időszak
                baseWaitMin = 3; baseWaitMax = 12;
            }
            const randomFactor = Math.floor(Math.random() * 4) - 1; // -1 to +2 perc
            const finalWaitMin = Math.max(0, baseWaitMin + randomFactor);
            const finalWaitMax = Math.max(finalWaitMin + 4, baseWaitMax + randomFactor); // Minimum 4 perc különbség
            
            waitTimeSpanContact.textContent = `${finalWaitMin}-${finalWaitMax}p`;
        }
        updateWaitTimeContact(); // Azonnali frissítés
        setInterval(updateWaitTimeContact, 60000); // Percenkénti frissítés
    }

}); // DOMContentLoaded vége