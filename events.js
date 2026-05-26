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
function filterEvents(filter, btn) {
    // Update active button
    document.querySelectorAll('.ev-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.event-item');
    items.forEach(item => {
        const status = item.dataset.status;
        if (filter === 'all' || status === filter) {
            item.classList.remove('ev-hidden');
        } else {
            item.classList.add('ev-hidden');
        }
    });

    // Show/hide section headings based on visible items
    toggleSectionVisibility('live-events', '#liveGrid .event-item:not(.ev-hidden)');
    toggleSectionVisibility('upcoming-events', '#upcomingGrid .event-item:not(.ev-hidden)');
    toggleSectionVisibility('past-events', '#pastGrid .event-item:not(.ev-hidden)');
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
