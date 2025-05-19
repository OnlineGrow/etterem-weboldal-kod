document.addEventListener('DOMContentLoaded', function() {
    console.log('Arany Kanál Étterem - Főoldal szkript (frissített) betöltve!');

    // === KÖZÖS FUNKCIÓK (Maradnak, ahogy az eredeti fájlban, HTML ID-khoz igazítva) ===
    // --- Fejléc Görgetésre ---
    const header = document.getElementById('main-header');
    if (header) {
        const headerHeight = header.offsetHeight; 
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > headerHeight) {
                header.classList.add('header-scrolled');
                const mainNavUl = document.querySelector('#main-nav-ul'); // Frissített ID
                if (scrollTop > lastScrollTop && scrollTop > headerHeight * 1.5 && mainNavUl && !mainNavUl.classList.contains('mobile-menu-active')) { 
                    header.style.top = `-${headerHeight}px`;
                } else { 
                    header.style.top = '0';
                }
            } else {
                header.classList.remove('header-scrolled');
                header.style.top = '0';
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
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            }
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
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Hírlevél Űrlap Kezelése (Láblécben) ---
    const newsletterFormFooter = document.getElementById('newsletterFormFooter'); 
    if (newsletterFormFooter) {
        const newsletterEmailInput = document.getElementById('newsletterEmailFooter'); 
        const newsletterStatus = document.getElementById('newsletterStatusFooter');
        // A hírlevél logika ugyanaz, mint a script_booking.js-ben, itt is alkalmazzuk
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

    // --- Megjelenési Animációk Görgetésre (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('[data-animate], .animate-on-scroll');
    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Az egyedi késleltetést a CSS-ből vagy inline style-ból veszi
                    // entry.target.style.transitionDelay = entry.target.dataset.delay || '0s'; 
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // 10%-nál aktiválódik
        
        animatedElements.forEach(el => {
            // Az alap stílusokat (opacity: 0, transform: translateY(30px)) a CSS-re bízzuk
            observer.observe(el);
        });
    } else {
        // Fallback régebbi böngészőkhöz
        animatedElements.forEach(el => { 
            el.style.opacity = '1'; 
            el.style.transform = 'translateY(0)'; 
        });
    }
    
    // === FŐOLDAL SPECIFIKUS LOGIKA ===

    // --- Főoldali Hero Tartalom Animációja ---
    // Ez a rész maradhat, a CSS keyframe animációt használja
    const indexHeroContentElements = document.querySelectorAll('#hero-section .hero-title, #hero-section .hero-slogan, #hero-section .hero-booking-button');
    if (indexHeroContentElements.length > 0) {
       indexHeroContentElements.forEach((el, index) => {
           el.style.opacity = '0'; // CSS kezeli az animációt, de a kezdőállapotot beállítjuk
           el.style.transform = 'translateY(20px)';
           el.style.animation = `fadeInUpContentAnimation 0.8s ${index * 0.2 + 0.3}s ease-out forwards`;
       });
    }
     
    // --- Valós idejű várakozási idő frissítése (mock) ---
    const waitTimeSpanIndex = document.getElementById('wait-time-value-index');
    if (waitTimeSpanIndex) {
        function updateWaitTimeIndex() {
            const currentHour = new Date().getHours();
            let baseWaitMin, baseWaitMax;

            if (currentHour >= 12 && currentHour < 14) { 
                baseWaitMin = 10; baseWaitMax = 20;
            } else if (currentHour >= 18 && currentHour < 21) { 
                baseWaitMin = 15; baseWaitMax = 30;
            } else { 
                baseWaitMin = 5; baseWaitMax = 10;
            }
            const randomFactor = Math.floor(Math.random() * 5) - 2; 
            const finalWaitMin = Math.max(0, baseWaitMin + randomFactor);
            const finalWaitMax = Math.max(finalWaitMin + 5, baseWaitMax + randomFactor);
            
            waitTimeSpanIndex.textContent = `${finalWaitMin}-${finalWaitMax}p`;
        }
        updateWaitTimeIndex(); // Azonnali frissítés
        setInterval(updateWaitTimeIndex, 60000); // Percenkénti frissítés
    }
     
    // --- Napi ajánlat / Szakács üzenet frissítése (Mock) ---
    const dailyOfferImageEl = document.getElementById('daily-offer-image-src');
    const dailyOfferTitleEl = document.getElementById('daily-offer-title');
    const dailyOfferDescEl = document.getElementById('daily-offer-description');
    const chefMessageTextEl = document.getElementById('chef-message-text');

    // Biztosítjuk, hogy minden elem létezik, mielőtt hozzájuk nyúlnánk
    if (dailyOfferTitleEl && dailyOfferDescEl && chefMessageTextEl && dailyOfferImageEl) {
        const today = new Date();
        // Keddet választottam példának (index = 2)
        const dayOfWeek = today.getDay(); 
        
        const dailySpecials = [
             { title: "Vasárnapi Klasszikus: Bécsi Szelet", description: "Ropogós bundájú, omlós borjú bécsi szelet házi burgonyasalátával és áfonyalekvárral.", chefMsg: "A tökéletes vasárnapi ebéd, ahogy a nagymama készítette, egy csipetnyi Arany Kanál varázslattal!", image: "https://images.unsplash.com/photo-1598214886806-258589015039?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" },
             { title: "Hétfői Frissesség: Grillezett Kecskesajt Saláta", description: "Mézes-mustáros dresszinggel összeforgatott idénysaláta, pirított dióval és meleg, grillezett kecskesajttal.", chefMsg: "Kezdje a hetet könnyedén, de ízletesen! Ez a saláta garantáltan feltölt energiával.", image: "https://images.unsplash.com/photo-1562077984-55a7999bmZk?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" },
             { title: "Kedd Kedvence: Marhapörkölt Sztrapacskával", description: "Lassan főtt, szaftos marhapörkölt juhtúrós sztrapacskával és tejföllel megkoronázva.", chefMsg: "Egy igazi magyar klasszikus, amely minden falatjával a hagyományokat idézi. Jó étvágyat!", image: "https://images.unsplash.com/photo-1609946071098-162dd70936b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" },
             { title: "Szerdai Ínyencség: Lazacderék Spárgával", description: "Bőrén sült norvég lazacderék, hollandi mártással, friss zöld spárgával és párolt jázminrizzsel.", chefMsg: "A tenger ízei és a tavasz frissessége egy tányéron. Könnyed, mégis elegáns választás.", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" },
             { title: "Csütörtöki Comfort: Csirkepaprikás Nokedlivel", description: "Omlós csirkepaprikás, sűrű, paprikás szafttal, házi készítésű nokedlivel és friss uborkasalátával.", chefMsg: "Egy falat otthon, egy csipetnyi szeretet. Ez a csirkepaprikás garantáltan mosolyt csal az arcokra.", image: "https://kep.index.hu/1/0/5605/56056/560560/56056021_21a661a94c81ac41dee218df75da86df_wm.jpg" },
             { title: "Pénteki Finomság: Erdei Gombás Rizottó", description: "Krémes Arborio rizottó friss erdei gombákkal, parmezánforgácsokkal és egy leheletnyi szarvasgombaolajjal.", chefMsg: "Az erdő mélyének kincsei krémes ölelésben. Vegetáriánus vendégeinknek is ajánljuk!", image: "https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" },
             { title: "Szombati Lakoma: Rosé Kacsamell Pekándiós Körtével", description: "Tökéletesre sütött rosé kacsamell, vörösboros pekándiós körtével és édesburgonya-pürével.", chefMsg: "Egy igazán különleges fogás a hétvégi kényeztetéshez. Engedje, hogy elvarázsoljuk!", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" }
        ];

        // Biztosítjuk, hogy a dayOfWeek index érvényes legyen
        const specialIndex = dayOfWeek >= 0 && dayOfWeek < dailySpecials.length ? dayOfWeek : 0; 
        const currentSpecial = dailySpecials[specialIndex]; 
        
        // HTML elemek frissítése
        dailyOfferImageEl.src = currentSpecial.image;
        dailyOfferImageEl.alt = currentSpecial.title; 
        dailyOfferTitleEl.textContent = currentSpecial.title;
        dailyOfferDescEl.textContent = currentSpecial.description;
        // A blockquote belső tartalmaként frissítjük a séf üzenetét
        chefMessageTextEl.textContent = `"${currentSpecial.chefMsg}" - Horváth Attila`; 
    } else {
        console.warn("Daily offer elements not found for update.");
    }

    // --- Hűségprogram Szekció - Modális ablak kezelése (Placeholder) ---
    const loyaltyDetailsLink = document.getElementById('loyaltyDetailsLink');
    if (loyaltyDetailsLink) {
        loyaltyDetailsLink.addEventListener('click', function(event) {
            event.preventDefault(); // Megakadályozza a link alapértelmezett ugrását (#loyalty-details-modal)
            // Itt lehetne egy modális ablak megjelenítése.
            alert('Hűségprogram részletei hamarosan... (Modális ablak implementációja szükséges)');
        });
    }
    
    // --- Főoldali Foglalási Form (`#homeBookingForm`) Kezelése ---
    const homeBookingForm = document.getElementById('homeBookingForm');
    if(homeBookingForm){
        homeBookingForm.addEventListener('submit', function(e){
            const homeDate = document.getElementById('homeBookingDate');
            const statusMsg = document.getElementById('homeBookingFormStatus');

            // Alap validáció: Dátum kitöltve?
            if(homeDate && homeDate.value === ""){
                e.preventDefault(); // Megállítja a form küldését/átirányítást
                if(statusMsg){
                    statusMsg.textContent = "Kérjük, válasszon dátumot a kereséshez!";
                    statusMsg.style.color = "var(--ak-error)";
                    // Üzenet eltüntetése pár mp után
                    setTimeout(() => { 
                        statusMsg.textContent = ""; 
                        statusMsg.style.color = "";
                    }, 3000);
                }
                homeDate.focus(); // Fókusz a hibás mezőre
                return false; // Megállítja a további feldolgozást
            }
            
            // Ha a validáció rendben, az űrlap action="booking.html" method="GET" elvégzi az átirányítást
            // Itt akár egy "Keresés..." üzenetet is kiírhatnánk rövid időre.
            if(statusMsg) {
                statusMsg.textContent = "Asztal keresése...";
                statusMsg.style.color = "var(--ak-text-muted)";
                // Nincs szükség eltüntetésre, mert az oldal elnavigál.
            }
        });
    }


}); // DOMContentLoaded vége