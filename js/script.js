/* ============================================
   VINEET — Portfolio Interactions
   Lightweight, dependency-free JavaScript
   ============================================ */

(function () {
    'use strict';

    // ── DOM References ──
    const html = document.documentElement;
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const sections = document.querySelectorAll('.section, .hero');

    // ── Theme Manager ──
    // Detects system preference, allows manual toggle, persists choice in localStorage
    const ThemeManager = {
        STORAGE_KEY: 'vineet-portfolio-theme',

        init() {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this.apply(saved);
            } else {
                // Detect system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.apply(prefersDark ? 'dark' : 'light');
            }

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.apply(e.matches ? 'dark' : 'light');
                }
            });
        },

        apply(theme) {
            html.setAttribute('data-theme', theme);
        },

        toggle() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.apply(next);
            localStorage.setItem(this.STORAGE_KEY, next);
        }
    };

    // ── Mobile Navigation ──
    const MobileNav = {
        init() {
            if (!hamburger || !navMenu) return;

            hamburger.addEventListener('click', () => this.toggle());

            // Close menu when a nav link is clicked
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
            });
        },

        toggle() {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        },

        close() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    };

    // ── Active Section Observer ──
    // Highlights the current section link in navigation using IntersectionObserver
    const ActiveNav = {
        init() {
            if (!sections.length || !navLinks.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.getAttribute('id');
                            this.setActive(id);
                        }
                    });
                },
                {
                    rootMargin: '-20% 0px -75% 0px',
                    threshold: 0
                }
            );

            sections.forEach(section => observer.observe(section));
        },

        setActive(sectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    // ── Navbar Scroll Shadow ──
    // Adds a subtle shadow to the header when the page is scrolled down
    const NavbarScroll = {
        init() {
            if (!header) return;

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        if (window.scrollY > 10) {
                            header.style.boxShadow = 'var(--shadow-md)';
                        } else {
                            header.style.boxShadow = 'none';
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    };

    // ── Copy Email to Clipboard ──
    const CopyEmail = {
        init() {
            if (!copyEmailBtn) return;

            copyEmailBtn.addEventListener('click', () => this.copy());
        },

        async copy() {
            const email = copyEmailBtn.getAttribute('data-email');
            const copyText = copyEmailBtn.querySelector('.copy-text');
            const iconCopy = copyEmailBtn.querySelector('.icon-copy');
            const iconCheck = copyEmailBtn.querySelector('.icon-check');

            try {
                await navigator.clipboard.writeText(email);
                this.showSuccess(copyText, iconCopy, iconCheck);
            } catch (err) {
                // Fallback for older browsers or insecure contexts
                this.fallbackCopy(email, copyText, iconCopy, iconCheck);
            }
        },

        fallbackCopy(text, copyText, iconCopy, iconCheck) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                this.showSuccess(copyText, iconCopy, iconCheck);
            } catch (err) {
                copyText.textContent = 'Copy failed';
            }
            document.body.removeChild(textarea);
        },

        showSuccess(copyText, iconCopy, iconCheck) {
            // Update button text and icons
            copyText.textContent = 'Email Copied!';
            copyEmailBtn.classList.add('copied');
            if (iconCopy) iconCopy.style.display = 'none';
            if (iconCheck) iconCheck.style.display = 'block';

            // Reset after 2.5 seconds
            setTimeout(() => {
                copyText.textContent = 'Copy Email Address';
                copyEmailBtn.classList.remove('copied');
                if (iconCopy) iconCopy.style.display = 'block';
                if (iconCheck) iconCheck.style.display = 'none';
            }, 2500);
        }
    };

    // ── Scroll Reveal Animation ──
    // Adds a subtle fade-up animation for sections as they enter the viewport
    const ScrollReveal = {
        init() {
            // Respect reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const revealElements = document.querySelectorAll(
                '.section-header, .skill-category, .project-card, .cert-card, .education-card, .highlight-card, .contact-content'
            );

            // Set initial hidden state
            revealElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            // Stagger the animation slightly for grouped elements
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 60);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                }
            );

            revealElements.forEach(el => observer.observe(el));
        }
    };

    // ── Initialize Everything ──
    function init() {
        ThemeManager.init();
        MobileNav.init();
        ActiveNav.init();
        NavbarScroll.init();
        CopyEmail.init();
        ScrollReveal.init();

        // Theme toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', () => ThemeManager.toggle());
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
