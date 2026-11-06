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
    const paletteTrigger = document.getElementById('paletteTrigger');
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn, .copy-email-trigger');
    const sections = document.querySelectorAll('.section, .hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ── Theme Manager ──
    // Detects system preference, allows manual toggle, persists choice in localStorage
    const ThemeManager = {
        STORAGE_KEY: 'vineet-portfolio-theme',
        transitionTimer: 0,

        getSavedTheme() {
            try {
                const saved = localStorage.getItem(this.STORAGE_KEY);
                return saved === 'dark' || saved === 'light' ? saved : null;
            } catch (error) {
                return null;
            }
        },

        saveTheme(theme) {
            try {
                localStorage.setItem(this.STORAGE_KEY, theme);
            } catch (error) {
                // The theme still changes for this page view when storage is unavailable.
            }
        },

        init() {
            const saved = this.getSavedTheme();
            if (saved) {
                this.apply(saved);
            } else {
                // Detect system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.apply(prefersDark ? 'dark' : 'light');
            }

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getSavedTheme()) {
                    this.apply(e.matches ? 'dark' : 'light');
                }
            });
        },

        apply(theme) {
            if (html.getAttribute('data-theme') !== theme && !reduceMotion.matches) {
                html.classList.add('theme-changing');
                window.clearTimeout(this.transitionTimer);
                this.transitionTimer = window.setTimeout(() => html.classList.remove('theme-changing'), 560);
            }
            html.setAttribute('data-theme', theme);
            if (themeToggle) {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';
                const label = `Switch to ${nextTheme} theme`;
                themeToggle.setAttribute('aria-label', label);
                themeToggle.title = label;
            }
        },

        toggle() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.apply(next);
            this.saveTheme(next);
        }
    };

    // ── Keyboard-accessible command palette ──
    const CommandPalette = {
        init() {
            const dialog = document.getElementById('commandPalette');
            const input = document.getElementById('paletteInput');
            const results = document.getElementById('paletteResults');
            if (!dialog || !input || !results || !paletteTrigger) return;

            const items = [
                { label: 'Home', detail: 'Go to the introduction', href: '#hero', keywords: 'top intro' },
                { label: 'About', detail: 'Read my story', href: '#about', keywords: 'story learning' },
                { label: 'Skills', detail: 'Explore my technical toolkit', href: '#skills', keywords: 'cloud aws networking linux' },
                { label: 'Field Notes', detail: 'Read short technical notes', href: '#field-notes', keywords: 'dns cdn linux' },
                { label: 'Projects', detail: 'View project case studies', href: '#projects', keywords: 'portfolio secura github' },
                { label: 'Certifications', detail: 'Browse credentials', href: '#certifications', keywords: 'certificates' },
                { label: 'Education', detail: 'View academic background', href: '#education', keywords: 'degree' },
                { label: 'Contact', detail: 'Find contact options', href: '#contact', keywords: 'email linkedin' },
                { label: 'Toggle theme', detail: 'Switch between legacy dark and light', action: 'theme', keywords: 'dark light appearance' },
                { label: 'Play Vineet.exe', detail: 'Open the cloud networking game', action: 'arcade', keywords: 'game arcade' }
            ];
            let visibleItems = items;
            let activeIndex = 0;

            const render = () => {
                const query = input.value.trim().toLowerCase();
                visibleItems = items.filter(item => `${item.label} ${item.detail} ${item.keywords}`.toLowerCase().includes(query));
                activeIndex = Math.min(activeIndex, Math.max(visibleItems.length - 1, 0));
                results.replaceChildren();
                visibleItems.forEach((item, index) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'palette-option';
                    button.id = `palette-option-${index}`;
                    button.setAttribute('role', 'option');
                    button.setAttribute('aria-selected', String(index === activeIndex));
                    button.dataset.paletteIndex = String(index);
                    const label = document.createElement('span'); label.textContent = item.label;
                    const detail = document.createElement('span'); detail.className = 'palette-option-detail'; detail.textContent = item.detail;
                    const hint = document.createElement('span'); hint.className = 'palette-option-hint'; hint.textContent = item.href ? '↵' : '↗';
                    button.append(label, detail, hint);
                    results.appendChild(button);
                });
                if (visibleItems.length) input.setAttribute('aria-activedescendant', `palette-option-${activeIndex}`);
                else input.removeAttribute('aria-activedescendant');
                if (!visibleItems.length) {
                    const empty = document.createElement('p'); empty.className = 'palette-empty'; empty.textContent = 'No matching sections or actions.';
                    results.appendChild(empty);
                }
            };

            const close = () => { if (dialog.open) dialog.close(); };
            const run = index => {
                const item = visibleItems[index];
                if (!item) return;
                close();
                if (item.href) window.location.hash = item.href;
                if (item.action === 'theme') themeToggle?.click();
                if (item.action === 'arcade') window.setTimeout(() => document.getElementById('arcadeLaunch')?.click(), 0);
            };
            const open = () => {
                if (dialog.open) return;
                input.value = '';
                activeIndex = 0;
                render();
                dialog.showModal();
                input.setAttribute('aria-expanded', 'true');
                input.focus();
            };

            paletteTrigger.addEventListener('click', open);
            input.addEventListener('input', () => { activeIndex = 0; render(); });
            input.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown' && visibleItems.length) { event.preventDefault(); activeIndex = (activeIndex + 1) % visibleItems.length; render(); results.querySelector(`[data-palette-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' }); }
                if (event.key === 'ArrowUp' && visibleItems.length) { event.preventDefault(); activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length; render(); results.querySelector(`[data-palette-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' }); }
                if (event.key === 'Enter') { event.preventDefault(); run(activeIndex); }
            });
            results.addEventListener('click', event => {
                const option = event.target.closest('[data-palette-index]');
                if (option) run(Number(option.dataset.paletteIndex));
            });
            dialog.addEventListener('keydown', event => {
                if (event.key === 'Escape') { event.preventDefault(); close(); }
            });
            dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
            dialog.addEventListener('close', () => {
                input.setAttribute('aria-expanded', 'false');
                input.removeAttribute('aria-activedescendant');
                paletteTrigger.focus();
            });
            document.addEventListener('keydown', event => {
                const target = event.target;
                const typing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
                if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
                    event.preventDefault();
                    if (dialog.open) close(); else open();
                }
            });
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
            copyEmailButtons.forEach(button => button.addEventListener('click', () => this.copy(button)));
        },

        async copy(button) {
            const email = button.getAttribute('data-email');
            const copyText = button.querySelector('.copy-text');
            const iconCopy = button.querySelector('.icon-copy');
            const iconCheck = button.querySelector('.icon-check');

            try {
                await navigator.clipboard.writeText(email);
                this.showSuccess(button, copyText, iconCopy, iconCheck);
            } catch (err) {
                // Fallback for older browsers or insecure contexts
                this.fallbackCopy(button, email, copyText, iconCopy, iconCheck);
            }
        },

        fallbackCopy(button, text, copyText, iconCopy, iconCheck) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                if (!document.execCommand('copy')) throw new Error('Clipboard copy failed');
                this.showSuccess(button, copyText, iconCopy, iconCheck);
            } catch (err) {
                if (copyText) copyText.textContent = 'Select and copy: ' + text;
                button.setAttribute('aria-label', 'Copy failed. Email address: ' + text);
            }
            document.body.removeChild(textarea);
        },

        showSuccess(button, copyText, iconCopy, iconCheck) {
            const originalLabel = button.getAttribute('aria-label') || copyText?.textContent || 'Copy email address';
            const originalTitle = button.getAttribute('title');
            // Update button text and icons
            if (copyText) copyText.textContent = 'Email Copied!';
            button.setAttribute('aria-label', 'Email address copied');
            button.title = 'Email address copied';
            button.classList.add('copied');
            if (iconCopy) iconCopy.style.display = 'none';
            if (iconCheck) iconCheck.style.display = 'block';

            // Reset after 2.5 seconds
            setTimeout(() => {
                if (copyText) copyText.textContent = 'Copy Email Address';
                button.setAttribute('aria-label', originalLabel);
                if (originalTitle) button.title = originalTitle;
                else button.removeAttribute('title');
                button.classList.remove('copied');
                if (iconCopy) iconCopy.style.display = 'block';
                if (iconCheck) iconCheck.style.display = 'none';
            }, 2500);
        }
    };

    // ── Filterable skill categories ──
    const SkillsFilter = {
        init() {
            const controls = document.getElementById('skillsFilters');
            const grid = document.getElementById('skillsGrid');
            const status = document.getElementById('skillsFilterStatus');
            if (!controls || !grid || !status) return;

            const buttons = controls.querySelectorAll('[data-skill-filter]');
            const cards = grid.querySelectorAll('[data-skill-category]');
            controls.hidden = false;

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const selected = button.dataset.skillFilter;
                    let visibleCount = 0;

                    buttons.forEach(filterButton => {
                        filterButton.setAttribute('aria-pressed', String(filterButton === button));
                    });

                    cards.forEach(card => {
                        const matches = selected === 'all' || card.dataset.skillCategory === selected;
                        card.hidden = !matches;
                        if (matches) visibleCount += 1;
                    });

                    status.textContent = selected === 'all'
                        ? `Showing all ${visibleCount} skill categories.`
                        : `Showing ${button.textContent.trim()} skills.`;
                });
            });
        }
    };

    // ── Scroll Reveal Animation ──
    // Adds a subtle fade-up animation for sections as they enter the viewport
    const ScrollReveal = {
        init() {
            // Respect reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const revealElements = document.querySelectorAll(
                '.section-header, .about-text, .skill-category, .project-card, .cert-card, .education-card, .highlight-card, .contact-content'
            );

            // Set initial hidden state
            revealElements.forEach(el => el.classList.add('reveal-ready'));

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
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

    // ── Reading progress ──
    const ReadingProgress = {
        init() {
            const bar = document.createElement('div');
            bar.className = 'reading-progress';
            bar.setAttribute('aria-hidden', 'true');
            document.body.appendChild(bar);

            let ticking = false;
            const update = () => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
                ticking = false;
            };
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            }, { passive: true });
            update();
        }
    };

    // ── Subtle pointer tilt on large cards ──
    const CardTilt = {
        init() {
            if (reduceMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

            document.querySelectorAll('.project-card, .terminal-card').forEach(card => {
                card.addEventListener('pointermove', event => {
                    const bounds = card.getBoundingClientRect();
                    const x = (event.clientX - bounds.left) / bounds.width;
                    const y = (event.clientY - bounds.top) / bounds.height;
                    card.style.setProperty('--pointer-x', `${x * 100}%`);
                    card.style.setProperty('--pointer-y', `${y * 100}%`);
                    card.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
                    card.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
                });
                card.addEventListener('pointerleave', () => {
                    card.style.setProperty('--tilt-x', '0deg');
                    card.style.setProperty('--tilt-y', '0deg');
                });
            });
        }
    };

    const CardSpotlight = {
        init() {
            if (reduceMotion.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
            document.querySelectorAll('.skill-category, .cert-card, .education-card, .highlight-card, .contact-content, .field-note').forEach(card => {
                card.addEventListener('pointermove', event => {
                    const bounds = card.getBoundingClientRect();
                    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
                    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
                    card.classList.add('spotlight-active');
                });
                card.addEventListener('pointerleave', () => card.classList.remove('spotlight-active'));
            });
        }
    };

    // ── Interactive portfolio terminal ──
    const PortfolioTerminal = {
        init() {
            const form = document.getElementById('terminalForm');
            const input = document.getElementById('terminalInput');
            const session = document.getElementById('terminalSession');
            if (!form || !input || !session) return;

            const commands = {
                help: { text: 'Try: about, skills, projects, contact, whoami, arcade, or clear.' },
                about: { text: 'A Computer Science graduate in Lucknow, building skills in cloud infrastructure, networking, and automation.', href: '#about', label: 'Read more about me' },
                skills: { text: 'AWS · TCP/IP · Linux · Bash · Python · Nmap · Git', href: '#skills', label: 'Explore all skills' },
                projects: { text: 'Cloud hosting on AWS and SECURA secure file storage architecture.', href: '#projects', label: 'View featured projects' },
                contact: { text: 'Find the email address and copy button in the contact section.', href: '#contact', label: 'Go to contact options' },
                whoami: { text: 'Vineet — aspiring Cloud Engineer and DevOps enthusiast.' },
                arcade: { text: 'Launching Vineet.exe — ready for a quick side quest?' }
            };
            const history = [];
            let historyIndex = 0;

            form.addEventListener('submit', event => {
                event.preventDefault();
                const value = input.value.trim();
                if (!value) return;

                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line terminal-echo';
                const prompt = document.createElement('span');
                prompt.className = 'terminal-prompt';
                prompt.textContent = '$';
                const command = document.createElement('span');
                command.className = 'terminal-command';
                command.textContent = value;
                commandLine.append(prompt, command);
                session.appendChild(commandLine);
                history.push(value);
                historyIndex = history.length;

                if (value.toLowerCase() === 'clear') {
                    session.replaceChildren();
                } else {
                    const result = commands[value.toLowerCase()];
                    const output = document.createElement('div');
                    output.className = 'terminal-output terminal-response';
                    if (result) {
                        output.append(document.createTextNode(result.text));
                        if (result.href) {
                            const link = document.createElement('a');
                            link.className = 'terminal-response-link';
                            link.href = result.href;
                            link.textContent = result.label;
                            output.append(document.createTextNode(' '), link);
                        }
                    } else {
                        output.textContent = `Command not found: ${value}. Type help to see available commands.`;
                    }
                    session.appendChild(output);
                }

                if (value.toLowerCase() === 'arcade') {
                    document.getElementById('arcadeLaunch')?.click();
                }

                input.value = '';
                input.focus();
            });

            input.addEventListener('keydown', event => {
                if (event.key === 'ArrowUp' && historyIndex > 0) {
                    event.preventDefault();
                    input.value = history[--historyIndex];
                } else if (event.key === 'ArrowDown' && historyIndex < history.length) {
                    event.preventDefault();
                    input.value = history[++historyIndex] || '';
                }
            });
        }
    };

    // ── Name typing animation ──
    const NameTyping = {
        init() {
            const name = document.getElementById('typedName');
            if (!name || reduceMotion.matches) return;

            const fullName = name.textContent;
            name.textContent = '';
            name.classList.add('is-typing');
            let index = 0;
            const typeNext = () => {
                name.textContent = fullName.slice(0, ++index);
                if (index < fullName.length) {
                    window.setTimeout(typeNext, 115);
                } else {
                    name.classList.remove('is-typing');
                }
            };
            window.setTimeout(typeNext, 480);
        }
    };

    // ── Subtle live matrix rain behind the hero ──
    const HeroMatrix = {
        init() {
            const canvas = document.getElementById('matrixCanvas');
            if (!canvas || !canvas.getContext) return;
            const context = canvas.getContext('2d');
            const fontSize = 18;
            const trailLength = 5;
            const randomGlyph = () => String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
            let drops = [];
            let glyphs = [];
            let glyphFrame = 0;
            let width = 0;
            let height = 0;
            let frame = 0;
            let lastFrameAt = 0;
            let visible = false;

            const resize = () => {
                const bounds = canvas.getBoundingClientRect();
                const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
                width = bounds.width;
                height = bounds.height;
                canvas.width = Math.round(width * ratio);
                canvas.height = Math.round(height * ratio);
                context.setTransform(ratio, 0, 0, ratio, 0, 0);
                const columns = Math.ceil(width / fontSize);
                drops = reduceMotion.matches
                    ? Array.from({ length: columns }, (_, column) => (column * 7) % Math.max(1, Math.floor(height / fontSize)))
                    : Array.from({ length: columns }, () => -Math.random() * 24);
                glyphs = Array.from({ length: columns }, () => Array.from({ length: trailLength + 1 }, randomGlyph));
                glyphFrame = 0;
                if (visible) start();
            };

            const render = (timestamp = performance.now()) => {
                frame = 0;
                if (!visible || document.hidden) return;
                if (!reduceMotion.matches && timestamp - lastFrameAt < 33) {
                    frame = window.requestAnimationFrame(render);
                    return;
                }
                lastFrameAt = timestamp;
                context.clearRect(0, 0, width, height);
                context.font = `${fontSize}px monospace`;
                context.textAlign = 'center';
                glyphFrame += 1;
                drops.forEach((drop, column) => {
                    const x = column * fontSize + fontSize / 2;
                    for (let trail = trailLength; trail >= 0; trail -= 1) {
                        const glyphY = (drop - trail * 1.15) * fontSize;
                        if (glyphY < 0 || glyphY > height) continue;
                        if (glyphFrame % 8 === 0 && Math.random() > 0.68) glyphs[column][trail] = randomGlyph();
                        const intensity = 1 - trail / (trailLength + 1);
                        context.fillStyle = trail === 0
                            ? 'rgba(187, 247, 208, 0.92)'
                            : `rgba(34, 197, 94, ${0.08 + intensity * 0.5})`;
                        context.fillText(glyphs[column][trail], x, glyphY);
                    }
                    if (!reduceMotion.matches) {
                        drops[column] += Math.random() * 0.7 + 0.35;
                        if (drop * fontSize > height && Math.random() > 0.98) drops[column] = -Math.random() * 18;
                    }
                });
                if (!reduceMotion.matches) frame = window.requestAnimationFrame(render);
            };

            const start = () => {
                if (!visible || frame || document.hidden) return;
                render();
            };
            const stop = () => {
                if (frame) window.cancelAnimationFrame(frame);
                frame = 0;
            };
            const observer = new IntersectionObserver(entries => {
                visible = entries.some(entry => entry.isIntersecting);
                if (visible) start(); else stop();
            });
            observer.observe(canvas);
            window.addEventListener('resize', resize, { passive: true });
            reduceMotion.addEventListener('change', resize);
            document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
            resize();
        }
    };

    // ── Decorative live shell prompt behind the hero ──
    const HeroTerminal = {
        init() {
            const output = document.getElementById('heroTerminalCommand');
            if (!output) return;

            const commands = [
                'trace --route',
                'aws s3 sync ./site s3://portfolio',
                'cat ~/learning/current',
                'git status --short'
            ];
            let commandIndex = 0;
            let characterIndex = 0;
            let timer = 0;

            const typeNext = () => {
                if (reduceMotion.matches) {
                    output.textContent = commands[0];
                    return;
                }
                const command = commands[commandIndex];
                if (characterIndex < command.length) {
                    output.textContent = command.slice(0, ++characterIndex);
                    timer = window.setTimeout(typeNext, 62);
                    return;
                }
                timer = window.setTimeout(() => {
                    output.textContent = '';
                    characterIndex = 0;
                    commandIndex = (commandIndex + 1) % commands.length;
                    timer = window.setTimeout(typeNext, 260);
                }, 1250);
            };

            typeNext();
            reduceMotion.addEventListener('change', () => {
                window.clearTimeout(timer);
                characterIndex = 0;
                output.textContent = '';
                typeNext();
            });
        }
    };

    // ── Vineet.exe: keyboard and touch Cloud Runner ──
    const Arcade = {
        init() {
            const launch = document.getElementById('arcadeLaunch');
            const dialog = document.getElementById('arcadeDialog');
            const canvas = document.getElementById('arcadeCanvas');
            const startButton = document.getElementById('arcadeStart');
            const closeButton = document.getElementById('arcadeClose');
            if (!launch || !dialog || !canvas || !startButton || !canvas.getContext) return;

            const context = canvas.getContext('2d');
            const score = document.getElementById('arcadeScore');
            const bestTimeDisplay = document.getElementById('arcadeBestTime');
            const signalCount = document.getElementById('arcadeSignalCount');
            const message = document.getElementById('arcadeMessage');
            const reveal = document.getElementById('arcadeReveal');
            const startScreen = document.getElementById('arcadeStartScreen');
            const lanes = [150, 360, 570];
            const playerY = 248;
            const bestTimeKey = 'vineet-arcade-best-time';
            let lane = 1;
            let signals = 0;
            let entities = [];
            let lastTime = 0;
            let spawnElapsed = 0;
            let frame = 0;
            let running = false;
            let lastEntityType = 'firewall';
            let gameStartedAt = 0;
            let bestTimeSeconds = null;

            try {
                const savedBest = Number(localStorage.getItem(bestTimeKey));
                if (Number.isFinite(savedBest) && savedBest > 0) bestTimeSeconds = savedBest;
            } catch (error) {
                // The current session can still track a best time if storage is unavailable.
            }

            const formatTime = seconds => `${seconds.toFixed(2)}s`;
            const renderBestTime = () => {
                bestTimeDisplay.textContent = bestTimeSeconds === null ? '—' : formatTime(bestTimeSeconds);
            };
            renderBestTime();

            const draw = () => {
                const width = canvas.width;
                const height = canvas.height;
                context.clearRect(0, 0, width, height);
                context.fillStyle = '#0a1221';
                context.fillRect(0, 0, width, height);
                context.strokeStyle = 'rgba(125, 211, 252, 0.08)';
                context.lineWidth = 1;
                for (let x = 30; x < width; x += 30) {
                    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
                }
                for (let y = 0; y < height; y += 30) {
                    context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
                }
                lanes.forEach(x => {
                    context.setLineDash([4, 9]);
                    context.strokeStyle = 'rgba(125, 211, 252, 0.18)';
                    context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
                });
                context.setLineDash([]);

                entities.forEach(entity => {
                    const x = lanes[entity.lane];
                    if (entity.type === 'signal') {
                        context.save();
                        context.shadowColor = '#38bdf8';
                        context.shadowBlur = 18;
                        context.fillStyle = '#7dd3fc';
                        context.beginPath();
                        context.moveTo(x, entity.y - 12); context.lineTo(x + 12, entity.y);
                        context.lineTo(x, entity.y + 12); context.lineTo(x - 12, entity.y);
                        context.closePath(); context.fill();
                        context.restore();
                    } else {
                        context.save();
                        context.fillStyle = '#fb7185';
                        context.shadowColor = '#fb7185'; context.shadowBlur = 12;
                        context.beginPath(); context.roundRect(x - 18, entity.y - 13, 36, 26, 6); context.fill();
                        context.shadowBlur = 0;
                        context.strokeStyle = 'rgba(255,255,255,.75)'; context.lineWidth = 2;
                        context.beginPath(); context.moveTo(x - 8, entity.y - 7); context.lineTo(x - 8, entity.y + 7); context.moveTo(x + 8, entity.y - 7); context.lineTo(x + 8, entity.y + 7); context.stroke();
                        context.restore();
                    }
                });

                const x = lanes[lane];
                context.save();
                context.fillStyle = '#38bdf8'; context.shadowColor = '#38bdf8'; context.shadowBlur = 22;
                context.beginPath(); context.arc(x - 12, playerY, 13, 0, Math.PI * 2); context.arc(x + 10, playerY - 3, 16, 0, Math.PI * 2); context.arc(x + 25, playerY + 2, 11, 0, Math.PI * 2); context.fill();
                context.fillRect(x - 12, playerY, 37, 12);
                context.restore();
                context.fillStyle = 'rgba(255,255,255,.55)';
                context.font = '12px monospace';
                context.fillText('← MOVE  ·  COLLECT SIGNALS  ·  AVOID FIREWALLS →', 18, 24);
            };

            const endGame = (won, elapsedSeconds) => {
                running = false;
                startScreen.hidden = true;
                if (won) {
                    const isNewBest = bestTimeSeconds === null || elapsedSeconds < bestTimeSeconds;
                    if (isNewBest) {
                        bestTimeSeconds = elapsedSeconds;
                        try {
                            localStorage.setItem(bestTimeKey, String(bestTimeSeconds));
                        } catch (error) {
                            // Keep the best run for this page session even if storage is unavailable.
                        }
                        renderBestTime();
                        message.textContent = `New browser best: ${formatTime(elapsedSeconds)}! You found a little piece of my story:`;
                    } else {
                        message.textContent = `Route secured in ${formatTime(elapsedSeconds)}. Your best is ${formatTime(bestTimeSeconds)}:`;
                    }
                    reveal.hidden = false;
                } else {
                    message.textContent = `Firewall hit. You routed ${signals} of 3 signals. Give it another try!`;
                    startScreen.hidden = false;
                    startScreen.querySelector('p').textContent = 'A firewall got in the way. Ready to try again?';
                    startButton.textContent = 'Try again';
                }
            };

            const tick = time => {
                if (!running || !dialog.open) return;
                const delta = Math.min((time - (lastTime || time)) / 1000, 0.04);
                lastTime = time;
                spawnElapsed += delta;
                if (spawnElapsed > 0.78) {
                    spawnElapsed = 0;
                    const type = lastEntityType === 'signal' ? 'firewall' : (Math.random() > 0.4 ? 'signal' : 'firewall');
                    lastEntityType = type;
                    entities.push({ lane: Math.floor(Math.random() * lanes.length), y: -18, type });
                }
                entities.forEach(entity => { entity.y += delta * 145; });
                const remaining = [];
                for (const entity of entities) {
                    if (entity.lane === lane && Math.abs(entity.y - playerY) < 27) {
                        if (entity.type === 'signal') {
                            signals += 1;
                            score.textContent = `${signals} / 3`;
                            signalCount.textContent = signals;
                            message.textContent = `Signal collected: ${signals} / 3`;
                            if (signals >= 3) { entities = remaining; draw(); endGame(true, (time - gameStartedAt) / 1000); return; }
                            continue;
                        }
                        entities = remaining;
                        draw(); endGame(false); return;
                    }
                    if (entity.y < 325) remaining.push(entity);
                }
                entities = remaining;
                draw();
                frame = window.requestAnimationFrame(tick);
            };

            const startGame = () => {
                window.cancelAnimationFrame(frame);
                lane = 1; signals = 0; entities = []; lastTime = 0; spawnElapsed = 0; lastEntityType = 'firewall';
                score.textContent = '0 / 3'; signalCount.textContent = '0';
                message.textContent = 'Signal collected: 0 / 3';
                reveal.hidden = true;
                startScreen.hidden = true;
                gameStartedAt = performance.now();
                running = true;
                draw();
                canvas.focus();
                frame = window.requestAnimationFrame(tick);
            };

            const move = direction => { lane = Math.max(0, Math.min(lanes.length - 1, lane + direction)); };
            launch.addEventListener('click', () => {
                if (!dialog.open) dialog.showModal();
                startButton.focus();
            });
            closeButton.addEventListener('click', () => dialog.close());
            startButton.addEventListener('click', startGame);
            dialog.addEventListener('close', () => {
                running = false;
                window.cancelAnimationFrame(frame);
                lane = 1; signals = 0; entities = []; lastTime = 0; spawnElapsed = 0;
                score.textContent = '0 / 3'; signalCount.textContent = '0';
                message.textContent = 'Signal collected: 0 / 3';
                reveal.hidden = true;
                startScreen.querySelector('p').textContent = 'Ready to route some packets?';
                startButton.textContent = 'Start game';
                startScreen.hidden = false;
                draw();
                launch.focus();
            });
            dialog.querySelectorAll('[data-move]').forEach(button => {
                button.addEventListener('click', () => move(button.dataset.move === 'left' ? -1 : 1));
            });
            document.addEventListener('keydown', event => {
                if (!dialog.open || !running || (event.target instanceof Element && event.target.matches('input, textarea, select, [contenteditable="true"]'))) return;
                const key = event.key.toLowerCase();
                if (key === 'arrowleft' || key === 'a') { event.preventDefault(); move(-1); }
                if (key === 'arrowright' || key === 'd') { event.preventDefault(); move(1); }
            });
            dialog.addEventListener('click', event => {
                if (event.target === dialog) dialog.close();
            });
            document.getElementById('arcadeStoryLink')?.addEventListener('click', () => dialog.close());
            draw();
        }
    };

    // ── Initialize Everything ──
    function init() {
        ThemeManager.init();
        CommandPalette.init();
        MobileNav.init();
        ActiveNav.init();
        NavbarScroll.init();
        CopyEmail.init();
        SkillsFilter.init();
        ScrollReveal.init();
        ReadingProgress.init();
        CardTilt.init();
        CardSpotlight.init();
        PortfolioTerminal.init();
        NameTyping.init();
        HeroMatrix.init();
        HeroTerminal.init();
        Arcade.init();

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
