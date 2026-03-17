// Linux - Interactive enhancements

// Visitor counter (admin-only) - change ADMIN_PASSWORD to your secret
const ADMIN_PASSWORD = 'Alqmy876';
const VISITOR_COUNT_KEY = 'linux_site_visits';

function getVisitorCount() {
    const count = localStorage.getItem(VISITOR_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
}

function incrementVisitorCount() {
    const count = getVisitorCount() + 1;
    localStorage.setItem(VISITOR_COUNT_KEY, count.toString());
    return count;
}

function isAdmin() {
    return sessionStorage.getItem('linux_admin') === '1';
}

function setAdminMode(active) {
    if (active) {
        sessionStorage.setItem('linux_admin', '1');
    } else {
        sessionStorage.removeItem('linux_admin');
    }
}

function showAdminPrompt() {
    const password = prompt('Admin password:');
    if (password === ADMIN_PASSWORD) {
        setAdminMode(true);
        injectVisitorCounter();
    }
}

function injectVisitorCounter() {
    const adminLink = document.getElementById('admin-login-link');
    if (adminLink) adminLink.style.display = 'none';

    let badge = document.getElementById('admin-visitor-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'admin-visitor-badge';
        badge.className = 'admin-visitor-badge';
        document.body.appendChild(badge);
    }
    const count = getVisitorCount();
    badge.innerHTML = '<span class="admin-badge-label">Visitors</span><span class="admin-badge-count">' + count + '</span><button type="button" class="admin-logout-btn" title="Logout">×</button>';
    badge.style.display = 'flex';

    const logoutBtn = badge.querySelector('.admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            setAdminMode(false);
            badge.style.display = 'none';
            injectAdminLink();
            const link = document.getElementById('admin-login-link');
            if (link) link.style.display = '';
        });
    }
}

function injectAdminLink() {
    let link = document.getElementById('admin-login-link');
    if (!link) {
        link = document.createElement('a');
        link.id = 'admin-login-link';
        link.href = '#';
        link.className = 'admin-login-link';
        link.textContent = 'Admin';
        link.addEventListener('click', function (e) {
            e.preventDefault();
            showAdminPrompt();
        });
        document.body.appendChild(link);
    }
    link.style.display = '';
}

document.addEventListener('DOMContentLoaded', function () {
    incrementVisitorCount();
    if (isAdmin()) {
        injectVisitorCounter();
    } else {
        injectAdminLink();
    }
    // Smooth scroll for any future anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add subtle animation on card visibility
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
