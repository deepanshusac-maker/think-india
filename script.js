        // Scroll progress
        const prog = document.getElementById('scrollProg');
        if (prog) {
            window.addEventListener('scroll', () => {
                const sc = document.documentElement.scrollTop;
                const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (sh > 0) prog.style.width = (sc / sh * 100) + '%';
            });
        }

        // Navbar
        const nav = document.getElementById('navbar');
        if (nav) {
            window.addEventListener('scroll', () => {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                const secs = document.querySelectorAll('section[id]');
                const links = document.querySelectorAll('.nav-links a');
                let curSec = '';
                secs.forEach(s => { if (window.scrollY >= s.offsetTop - 130) curSec = s.id; });
                links.forEach(a => {
                    const href = a.getAttribute('href');
                    a.classList.toggle('active', href === '#' + curSec || href === 'index.html#' + curSec);
                });
            });
        }

        // Reveal
        const revEls = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.1 });
        revEls.forEach(r => obs.observe(r));

        // Mobile menu
        function toggleMenu() { document.getElementById('hamburger').classList.toggle('open'); document.getElementById('mobileMenu').classList.toggle('open'); }
        function closeMenu() { document.getElementById('hamburger').classList.remove('open'); document.getElementById('mobileMenu').classList.remove('open'); }

        // Form submit
        function handleSubmit(btn, label) {
            if (!btn) return;
            const form = btn.closest('form');
            btn.addEventListener('click', function (e) {
                if (form && !form.checkValidity()) {
                    return;
                }
                e.preventDefault();
                this.textContent = '✓ Submitted! Jai Hind 🇮🇳';
                this.style.background = 'linear-gradient(135deg, var(--green), var(--green-light))';
                this.style.color = '#fff';
                setTimeout(() => { this.textContent = label; this.style.background = ''; this.style.color = ''; }, 3500);
            });
        }
        handleSubmit(document.getElementById('joinSubmit'), 'Submit Application →');
        handleSubmit(document.getElementById('contactSubmit'), 'Send Message →');

        // Register buttons
        document.querySelectorAll('.ev-reg').forEach(b => {
            b.addEventListener('click', (e) => {
                const joinSection = document.getElementById('join');
                if (joinSection) {
                    e.preventDefault();
                    joinSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Hero particles
        const heroParticlesEl = document.getElementById('heroParticles');
        if (heroParticlesEl) {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('div');
                p.className = 'hero-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 8 + 's';
                p.style.animationDuration = (6 + Math.random() * 6) + 's';
                p.style.width = (2 + Math.random() * 3) + 'px';
                p.style.height = p.style.width;
                heroParticlesEl.appendChild(p);
            }
        }

        // Animated stat counters
        const statNums = document.querySelectorAll('.h-stat-num[data-count]');
        if (statNums.length > 0) {
            const statObs = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseInt(el.dataset.count);
                        const duration = 2000;
                        const startTime = performance.now();
                        function animateCount(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = Math.round(eased * target);
                            el.textContent = current >= 100 ? current + '+' : current + '+';
                            if (target === 2006) el.textContent = current;
                            if (progress < 1) requestAnimationFrame(animateCount);
                        }
                        requestAnimationFrame(animateCount);
                        statObs.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            statNums.forEach(el => statObs.observe(el));
        }

        // Hide scroll indicator on scroll
        const heroScroll = document.getElementById('heroScroll');
        if (heroScroll) {
            window.addEventListener('scroll', () => {
                heroScroll.style.opacity = window.scrollY > 100 ? '0' : '';
                heroScroll.style.transition = 'opacity 0.3s';
            });
        }

        // Floating CTA Scroll Toggle (FAB)
        const floatCta = document.getElementById('floatingCta');
        if (floatCta) {
            const isHomepage = !!document.getElementById('hero');
            const isContactPage = window.location.pathname.includes('contact.html');
            const updateFab = () => {
                if (isContactPage) {
                    floatCta.classList.remove('visible');
                } else if (isHomepage) {
                    floatCta.classList.toggle('visible', window.scrollY > 300);
                } else {
                    floatCta.classList.add('visible');
                }
            };
            window.addEventListener('scroll', updateFab);
            updateFab(); // Run initially
        }

        // Magnetic Button Hover Attraction
        document.querySelectorAll('.btn-saffron, .ev-view-all-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                btn.style.transition = 'transform 0.1s ease';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
