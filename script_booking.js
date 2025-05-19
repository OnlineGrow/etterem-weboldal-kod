document.addEventListener('DOMContentLoaded', function() {
    console.log('Arany Kanál Étterem - Foglalás szkript (frissített) betöltve!');

    // === KÖZÖS FUNKCIÓK (Maradnak, ahogy az eredeti fájlban) ===
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
               newsletterStatus.className = 'newsletter-status'; // Alap class visszaállítása
               newsletterStatus.style.color = ''; // Inline stílus törlése

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
                       // Üzenet eltüntetése pár másodperc után
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
           // Csak akkor fusson, ha valódi ID-ra mutat (#)
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
                   // Hibás szelektor esetén ne álljon le a script
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
                    // Eltávolítjuk a figyelést, miután az animáció lezajlott
                    observerInstance.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 }); // 10%-nál aktiválódik
        
        animatedElements.forEach(el => {
            // Alap stílusokat (opacity: 0, transform: translateY(30px)) a CSS-re bízzuk
            observer.observe(el);
        });
    } else {
        // Fallback régebbi böngészőkhöz (nincs animáció)
        animatedElements.forEach(el => { 
            el.style.opacity = '1'; 
            el.style.transform = 'translateY(0)'; 
        });
    }
    
    // --- Hero animáció (aloldali) ---
    const pageHeroContentElements = document.querySelectorAll('.booking-hero .page-hero-title, .booking-hero .page-hero-subtitle');
    if (pageHeroContentElements.length > 0) {
       pageHeroContentElements.forEach((el, index) => {
           // Ezeket a stílusokat jobb lenne CSS animációval kezelni, de itt hagyjuk a JS példát
           el.style.opacity = '0';
           el.style.transform = 'translateY(20px)';
           el.style.animation = `fadeInUpContentAnimation 0.7s ${index * 0.2 + 0.3}s ease-out forwards`;
       });
    }

    // === FOGLALÁSI OLDAL SPECIFIKUS LOGIKA ===

    // --- Interaktív Térkép Kezelése ---
    const floorPlanSvg = document.getElementById('floorPlanSvg');
    const selectedTableInfo = document.getElementById('selected-table-info');
    const selectedTableIdInput = document.getElementById('selectedTableIdInput'); 
    let currentSelectedTableElement = null; 

    if (floorPlanSvg && selectedTableInfo && selectedTableIdInput) {
        const tableGroups = floorPlanSvg.querySelectorAll('.table-group');
        
        tableGroups.forEach(tableGroup => {
            // Kattintás esemény
            tableGroup.addEventListener('click', function() {
                handleTableSelection(this);
            });

            // Billentyűzet esemény (Enter vagy Space)
            tableGroup.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault(); // Megakadályozza a default akciót (pl. görgetés)
                    handleTableSelection(this);
                }
            });
        });

        function handleTableSelection(selectedTableGroup) {
            // Ellenőrizzük, hogy az asztal elérhető-e
            if (selectedTableGroup.classList.contains('table-unavailable')) {
                selectedTableInfo.textContent = `A(z) "${selectedTableGroup.dataset.tableName || selectedTableGroup.dataset.tableId}" asztal jelenleg foglalt vagy nem elérhető.`;
                selectedTableInfo.style.color = 'var(--ak-error)';
                return; // Ne csináljunk semmit, ha nem elérhető
            }

            // Előző kiválasztás stílusának törlése
            if (currentSelectedTableElement && currentSelectedTableElement !== selectedTableGroup) {
                currentSelectedTableElement.classList.remove('table-selected');
                currentSelectedTableElement.removeAttribute('aria-selected'); // Aria attribútum frissítése
            }

            // Új asztal kiválasztása (toggle logika)
            if (currentSelectedTableElement === selectedTableGroup) {
                // Ha ugyanarra kattintottunk, töröljük a kiválasztást
                 selectedTableGroup.classList.remove('table-selected');
                 selectedTableGroup.removeAttribute('aria-selected');
                 currentSelectedTableElement = null;
                 selectedTableInfo.textContent = 'Kérjük, válasszon asztalt a térképről, vagy használja az űrlapot.';
                 selectedTableInfo.style.color = 'var(--ak-primary-blue)';
                 selectedTableIdInput.value = ''; // Rejtett input ürítése
            } else {
                // Új asztal kiválasztása
                selectedTableGroup.classList.add('table-selected');
                selectedTableGroup.setAttribute('aria-selected', 'true'); // Aria attribútum beállítása
                currentSelectedTableElement = selectedTableGroup;
    
                const tableName = selectedTableGroup.dataset.tableName || selectedTableGroup.dataset.tableId;
                const tableId = selectedTableGroup.dataset.tableId;
                
                selectedTableInfo.textContent = `Kiválasztott asztal: ${tableName}`;
                selectedTableInfo.style.color = 'var(--ak-primary-blue)';
                selectedTableIdInput.value = tableId; // Rejtett input frissítése
            }
        }
    } else {
        console.warn("Interactive map elements not found.");
    }

    // --- Foglalási Űrlap Kezelése ---
    const bookingForm = document.getElementById('onlineBookingForm');
    if (bookingForm) {
        const formStatus = document.getElementById('bookingFormStatus');
        const dateInput = document.getElementById('bookingDate');
        const timeInput = document.getElementById('bookingTime');
        const guestsInput = document.getElementById('bookingGuests');
        const nameInput = document.getElementById('bookingName');
        const emailInput = document.getElementById('bookingEmail');
        const phoneInput = document.getElementById('bookingPhone');
        const notesInput = document.getElementById('bookingNotes');

        // Dátum input minimumának beállítása (mai nap)
        if (dateInput) {
            const today = new Date();
            // Időzóna független mai dátum YYYY-MM-DD formátumban
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dateInput.min = `${year}-${month}-${day}`;
        }

        // Hibajelző segédfüggvények
        function setFieldError(field, message) {
            field.classList.add('input-error');
            const errorElementId = field.getAttribute('aria-describedby');
            const errorElement = errorElementId ? document.getElementById(errorElementId) : null;
            if (errorElement) { 
                errorElement.textContent = message; 
                errorElement.style.display = 'block'; 
            }
            // Aria invalid attribútum beállítása
            field.setAttribute('aria-invalid', 'true');
        }

        function clearFieldError(field) {
            field.classList.remove('input-error');
            const errorElementId = field.getAttribute('aria-describedby');
            const errorElement = errorElementId ? document.getElementById(errorElementId) : null;
            if (errorElement) { 
                errorElement.textContent = ''; 
                errorElement.style.display = 'none'; 
            }
             // Aria invalid attribútum eltávolítása
             field.removeAttribute('aria-invalid');
        }

        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let isValid = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status-message'; 
            formStatus.style.display = 'none'; // Alapból rejtett

            // Előző hibák törlése
            bookingForm.querySelectorAll('.input-error').forEach(field => clearFieldError(field));
            
            // Név validáció
            if (nameInput.value.trim() === '') { setFieldError(nameInput, 'A név kitöltése kötelező.'); isValid = false; }
            
            // Email validáció
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') { setFieldError(emailInput, 'Az e-mail cím kitöltése kötelező.'); isValid = false; }
            else if (!emailPattern.test(emailInput.value.trim())) { setFieldError(emailInput, 'Kérjük, érvényes e-mail címet adjon meg.'); isValid = false; }
            
            // Telefonszám validáció (opcionális, de ha van, formátum ellenőrzés)
            const phonePattern = /^(?:\+36|06)\s?(?:(?:(?:1|20|30|50|70)\s?\d{3}\s?\d{3,4})|(?:\d{2}\s?\d{3}\s?\d{3}))$/; 
            if (phoneInput.value.trim() !== '' && !phonePattern.test(phoneInput.value.trim().replace(/\s/g, ''))) { 
                setFieldError(phoneInput, 'Érvénytelen magyar telefonszám formátum.'); isValid = false; 
            }
            
            // Dátum validáció
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Mai nap 00:00:00
            let selectedDate = null;
            if (dateInput.value === '') { 
                setFieldError(dateInput, 'A dátum kiválasztása kötelező.'); 
                isValid = false; 
            } else { 
                selectedDate = new Date(dateInput.value + "T00:00:00"); // Időzóna problémák elkerülése végett
                if (isNaN(selectedDate.getTime())) { // Érvénytelen dátum
                    setFieldError(dateInput, 'Érvénytelen dátum formátum.'); 
                    isValid = false; 
                } else if (selectedDate < today) { 
                    setFieldError(dateInput, 'Nem foglalhat a múltba.'); 
                    isValid = false; 
                } 
            }
            
            // Idő validáció (csak ha a dátum érvényes)
            if (selectedDate && !isNaN(selectedDate.getTime())) {
                if (timeInput.value === '') { 
                    setFieldError(timeInput, 'Az időpont kiválasztása kötelező.'); 
                    isValid = false; 
                } else {
                    // Mai napon múltbeli időpont ellenőrzése
                    const now = new Date();
                    const selectedDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
                     if (selectedDate.getTime() === today.getTime() && selectedDateTime < now) { 
                        setFieldError(timeInput, 'A mai napra csak jövőbeli időpontot adhat meg.'); 
                        isValid = false; 
                    }
                    // TODO: Érdemes lenne nyitvatartási időn belüli ellenőrzést is hozzáadni
                }
            }
            
            // Vendégszám validáció
            const guestsValue = parseInt(guestsInput.value, 10);
            const minGuests = parseInt(guestsInput.min, 10);
            const maxGuests = parseInt(guestsInput.max, 10);
            if (isNaN(guestsValue) || guestsValue < minGuests || guestsValue > maxGuests) { 
                setFieldError(guestsInput, `A vendégek száma ${minGuests} és ${maxGuests} között lehet.`); 
                isValid = false; 
            }

            // --- Küldés vagy Hiba ---
            if (isValid) {
                formStatus.textContent = 'Foglalás feldolgozása...';
                formStatus.className = 'form-status-message'; 
                formStatus.style.display = 'block';
                formStatus.style.color = 'var(--ak-text-muted)';


                // Szimulált küldés (ezt backendnek kellene kezelnie)
                setTimeout(() => {
                    const bookingDetails = {
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        date: dateInput.value,
                        time: timeInput.value,
                        guests: guestsInput.value,
                        notes: notesInput.value.trim(),
                        table: selectedTableIdInput.value || 'Nincs térképről választva'
                    };

                    // Sikeres foglalás üzenet
                    const successHTML = `
                        <div class="booking-confirmation-details">
                            <h4 style="color:var(--ak-success); margin-bottom:10px;"><i class="fas fa-check-circle"></i> Foglalását sikeresen rögzítettük!</h4>
                            <p>Hamarosan e-mailben értesítjük a részletekről a(z) <strong>${bookingDetails.email}</strong> címen.</p>
                            <p><strong>Foglalási adatok:</strong><br>
                                Név: ${bookingDetails.name}<br>
                                Dátum: ${bookingDetails.date}, Idő: ${bookingDetails.time}<br>
                                Vendégek: ${bookingDetails.guests} fő<br>
                                ${bookingDetails.table !== 'Nincs térképről választva' ? `Asztal: ${bookingDetails.table}<br>` : ''}
                                ${bookingDetails.notes ? `Megjegyzés: ${bookingDetails.notes}<br>` : ''}
                            </p>
                        </div>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=AranyKanalFogalas%0ANev: ${encodeURIComponent(bookingDetails.name)}%0ADatum: ${bookingDetails.date}%0AIdo: ${bookingDetails.time}%0AVendegek: ${bookingDetails.guests}" 
                             alt="Foglalás QR kód" class="qr-code-placeholder" style="margin:15px auto; display:block;">
                        <button id="googleCalendarButton" class="button button-outline-primary button-small google-calendar-button">
                            <i class="fab fa-google"></i> Hozzáadás Google Naptárhoz
                        </button>`;
                    
                    formStatus.innerHTML = successHTML;
                    formStatus.classList.remove('error');
                    formStatus.classList.add('success');
                    formStatus.style.color = ''; 
                    
                    // Google Naptár gomb eseménykezelője
                    const gcalButton = document.getElementById('googleCalendarButton');
                    if(gcalButton) {
                        gcalButton.addEventListener('click', () => {
                            try {
                                const startDate = new Date(`${bookingDetails.date}T${bookingDetails.time}`);
                                const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Feltételezünk 2 órás foglalást

                                function formatDateForGoogle(date) {
                                    if (isNaN(date.getTime())) throw new Error("Invalid date for GCal formatting");
                                    // UTC időt használunk a Z (Zulu) jelöléssel
                                    return date.toISOString().replace(/-|:|\.\d{3}/g, ''); 
                                }
                                
                                const gcalStartDate = formatDateForGoogle(startDate);
                                const gcalEndDate = formatDateForGoogle(endDate);
    
                                const eventTitle = encodeURIComponent(`Asztalfoglalás - Arany Kanál Étterem`);
                                const eventDetails = encodeURIComponent(`Foglalás ${bookingDetails.guests} főre.\nNév: ${bookingDetails.name}\nAsztal: ${bookingDetails.table}\n${bookingDetails.notes ? 'Megjegyzés: ' + bookingDetails.notes : ''}`);
                                const eventLocation = encodeURIComponent(`Arany Kanál Étterem, 1051 Budapest, Zrínyi utca 5.`);
    
                                const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${gcalStartDate}/${gcalEndDate}&details=${eventDetails}&location=${eventLocation}`;
                                
                                window.open(googleCalendarUrl, '_blank');
                            } catch (error) {
                                console.error("Error generating Google Calendar link:", error);
                                alert("Hiba történt a Google Naptár link generálása közben.");
                            }
                        });
                    }

                    bookingForm.reset(); // Űrlap ürítése
                    if(currentSelectedTableElement) { // Térképes kiválasztás resetelése
                        currentSelectedTableElement.classList.remove('table-selected');
                        currentSelectedTableElement.removeAttribute('aria-selected');
                        currentSelectedTableElement = null;
                        selectedTableInfo.textContent = 'Kérjük, válasszon asztalt a térképről, vagy használja az űrlapot.';
                        selectedTableInfo.style.color = 'var(--ak-primary-blue)';
                        selectedTableIdInput.value = '';
                    }

                }, 1500);
            } else {
                formStatus.textContent = 'Kérjük, ellenőrizze és javítsa a pirossal jelölt mezőket!';
                formStatus.classList.remove('success'); 
                formStatus.classList.add('error');
                formStatus.style.display = 'block';
                
                // Fókusz az első hibás mezőre
                const firstErrorField = bookingForm.querySelector('[aria-invalid="true"]');
                if (firstErrorField) { 
                    firstErrorField.focus(); 
                    // Görgetés csak ha szükséges (pl. a mező nincs teljesen a képernyőn)
                    // firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
                }
            }
        });
    } else {
        console.warn("Booking form (#onlineBookingForm) not found.");
    }

    // --- Valós idejű várakozási idő frissítése (mock) ---
    const waitTimeSpanBooking = document.getElementById('wait-time-value-booking');
    if (waitTimeSpanBooking) {
        function updateWaitTimeBooking() {
            const currentHour = new Date().getHours();
            let baseWaitMin, baseWaitMax;

            if (currentHour >= 12 && currentHour < 14) { 
                baseWaitMin = 10; baseWaitMax = 25;
            } else if (currentHour >= 18 && currentHour < 21) { 
                baseWaitMin = 15; baseWaitMax = 35;
            } else { 
                baseWaitMin = 5; baseWaitMax = 15;
            }
            const randomFactor = Math.floor(Math.random() * 5) - 2; 
            const finalWaitMin = Math.max(0, baseWaitMin + randomFactor);
            const finalWaitMax = Math.max(finalWaitMin + 5, baseWaitMax + randomFactor);
            
            waitTimeSpanBooking.textContent = `${finalWaitMin}-${finalWaitMax}p`;
        }
        updateWaitTimeBooking(); // Azonnali frissítés betöltéskor
        setInterval(updateWaitTimeBooking, 60000); // Percenkénti frissítés
    }

}); // DOMContentLoaded vége