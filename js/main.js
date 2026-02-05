// Import translations
import enTranslations from '../lang/en.js'
import nlTranslations from '../lang/nl.js'


const translations = {
    en: enTranslations,
    nl: nlTranslations
};

let currentLang = 'nl';

function updateContent() {
    document.documentElement.lang = currentLang;
    
    // Handle text content translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[currentLang];
       
        try {
            for (const k of keys) {
                value = value[k];
            }
           
            if (value === undefined) {
                console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
                return;
            }
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        } catch (error) {
            console.error(`Error setting translation for key: ${key}`, error);
        }
    });

    // Handle HTML content translations
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const keys = key.split('.');
        let value = translations[currentLang];
       
        try {
            for (const k of keys) {
                value = value[k];
            }
           
            if (value === undefined) {
                console.warn(`Translation missing for HTML key: ${key} in language: ${currentLang}`);
                return;
            }
            element.innerHTML = value;
        } catch (error) {
            console.error(`Error setting HTML translation for key: ${key}`, error);
        }
    });
    
    // Handle href attributes
    document.querySelectorAll('[data-i18n-href]').forEach(element => {
        const key = element.getAttribute('data-i18n-href');
        const keys = key.split('.');
        let value = translations[currentLang];
        
        try {
            for (const k of keys) {
                value = value[k];
            }
            
            if (value === undefined) {
                console.warn(`Translation missing for href key: ${key} in language: ${currentLang}`);
                return;
            }
            
            element.setAttribute('href', value);
        } catch (error) {
            console.error(`Error setting href for key: ${key}`, error);
        }
    });
}

// Bonsai SVG morphing configuration
let currentBonsaiIndex = 0;
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize content
    updateContent();
    
    // Enable navbar toggler
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
        
        navbarToggler.addEventListener('click', (e) => {
            e.preventDefault();
            bsCollapse.toggle();
        });
    }
    
    // Set up language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    
    function updateLanguageButtons() {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            updateContent();
            updateLanguageButtons();
        });
    });

    // Initialize active language button
    updateLanguageButtons();

    // form listener
    document.getElementById('contactForm').addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.target);

        // Adding all form data to an object
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        try {
            const response = await fetch('https://api.formbee.dev/formbee/258ef555-8ce5-4cc9-b916-b357e6231add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (response.ok) {
                document.getElementById('formSuccessMessage').classList.remove('hidden');
                document.getElementById('formErrorMessage').classList.add('hidden');
                // clear form
                document.getElementById('contactForm').reset();
            } else {
                document.getElementById('formErrorMessage').classList.remove('hidden');
                document.getElementById('formSuccessMessage').classList.add('hidden');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form.');
        }
    });

    document.getElementById('contactForm').addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.target);

        // Adding all form data to an object
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        try {
            const response = await fetch('https://api.formbee.dev/formbee/258ef555-8ce5-4cc9-b916-b357e6231add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (response.ok) {
                document.getElementById('formSuccessMessage').classList.remove('hidden');
                document.getElementById('formErrorMessage').classList.add('hidden');
                // clear form
                document.getElementById('contactForm').reset();
            } else {
                document.getElementById('formErrorMessage').classList.remove('hidden');
                document.getElementById('formSuccessMessage').classList.add('hidden');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form.');
        }
    });

    // Set up LinkedIn links
    document.addEventListener('DOMContentLoaded', () => {
        function updateLinkedInLinks() {
            // Set Kamiel's LinkedIn URL
            const kamielLinkedIn = document.getElementById('kamiel-linkedin');
            if (kamielLinkedIn) {
                kamielLinkedIn.href = translations[currentLang].team.facilitators.kamiel.linkedin;
            }
            
            // Set Sytze's LinkedIn URL
            const sytzeLinkedIn = document.getElementById('sytze-linkedin');
            if (sytzeLinkedIn) {
                sytzeLinkedIn.href = translations[currentLang].team.facilitators.sytze.linkedin;
            }
        }
        
        // Initial update
        updateLinkedInLinks();
        
        // Update links when language changes
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(updateLinkedInLinks, 100); // Small delay to ensure translations are updated first
            });
        });
    });

    // Smooth scrolling for anchor links    <script>
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
