// ─── EVENTS PAGE LOGIC ───

// ── COUNTDOWN TIMERS ──
const countdowns = [
    { target: '2026-04-05T10:00:00', ids: ['cd1-d','cd1-h','cd1-m','cd1-s'] },
    { target: '2026-05-02T09:00:00', ids: ['cd2-d','cd2-h','cd2-m','cd2-s'] },
    { target: '2026-05-20T08:30:00', ids: ['cd3-d','cd3-h','cd3-m','cd3-s'] },
];

function updateCountdowns() {
    const now = new Date();
    countdowns.forEach(cd => {
        const target = new Date(cd.target);
        const diff = target - now;
        if (diff <= 0) {
            cd.ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '00';
            });
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        const vals = [days, hours, mins, secs];
        cd.ids.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(vals[i]).padStart(2, '0');
        });
    });
}
updateCountdowns();
setInterval(updateCountdowns, 1000);

// ── FILTER LOGIC ──
let filterTimeout = null;

function filterEvents(filter, btn) {
    // Cancel any pending visibility toggling timeouts
    if (filterTimeout) {
        clearTimeout(filterTimeout);
    }

    // Update active button
    document.querySelectorAll('.ev-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.event-item');
    const sections = ['live-events', 'upcoming-events', 'past-events'];

    // 1. Instantly show all sections that might contain items so they can transition in
    sections.forEach(secId => {
        const sec = document.getElementById(secId);
        if (sec) sec.style.display = '';
    });

    // 2. Filter items with staggered transitions
    let visibleIndex = 0;
    items.forEach(item => {
        const status = item.dataset.status;
        if (filter === 'all' || status === filter) {
            // Remove hidden state
            item.classList.remove('ev-hidden');
            // Stagger entrance transitions
            item.style.transitionDelay = `${visibleIndex * 60}ms`;
            visibleIndex++;
        } else {
            // Add hidden state immediately
            item.style.transitionDelay = '0ms';
            item.classList.add('ev-hidden');
        }
    });

    // 3. Smooth scroll lock to the top of the event filter strip/grid so the user doesn't lose placement
    const filterStrip = document.querySelector('.ev-filter-strip');
    if (filterStrip) {
        const yOffset = -85; // accounts for floating scrolled header height (80px + safety margin)
        const y = filterStrip.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // 4. Wait for card transitions to finish before completely hiding empty sections
    filterTimeout = setTimeout(() => {
        toggleSectionVisibility('live-events', '#liveGrid .event-item:not(.ev-hidden)');
        toggleSectionVisibility('upcoming-events', '#upcomingGrid .event-item:not(.ev-hidden)');
        toggleSectionVisibility('past-events', '#pastGrid .event-item:not(.ev-hidden)');
    }, 450); // Matches CSS transition duration of 0.45s
}

function toggleSectionVisibility(sectionId, selector) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const visible = section.querySelectorAll(selector);
    section.style.display = visible.length > 0 ? '' : 'none';
}

// ── REVEAL animations for events page ──
const evRevEls = document.querySelectorAll('.reveal');
if (evRevEls.length > 0) {
    const evObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                evObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    evRevEls.forEach(r => evObs.observe(r));
}

// ── ICS CALENDAR GENERATOR ──
function downloadICS(title, desc, location, startStr, endStr) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, "");
    };
    
    const icsContent = 
        "BEGIN:VCALENDAR\n" +
        "VERSION:2.0\n" +
        "PRODID:-//Think India NIT Patna//Calendar App//EN\n" +
        "BEGIN:VEVENT\n" +
        "SUMMARY:" + title + "\n" +
        "DESCRIPTION:" + desc + "\n" +
        "LOCATION:" + location + "\n" +
        "DTSTART:" + formatDate(startStr) + "\n" +
        "DTEND:" + formatDate(endStr) + "\n" +
        "END:VEVENT\n" +
        "END:VCALENDAR";
        
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
