document.addEventListener('DOMContentLoaded', () => {

    document.documentElement.classList.remove('no-js');

    const design01 = document.getElementById('design-01');
    if (design01) {
        design01.checked = true;
        document.body.classList.add('design-01');
    }

    // Indeterminate checkboxes — must be set via JS, cannot be done in HTML
    ['check-indeterminate', 'check-indeterminate-dis'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.indeterminate = true;
    });

    // Design tier toggles — apply/remove body class matching checkbox id
    document.querySelectorAll('.design-option').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            document.body.classList.toggle(this.id, this.checked);
            // Showcase tier requires Minimal Design as its base
            if (this.id === 'design-03' && this.checked) {
                const design02 = document.getElementById('design-02');
                if (design02 && !design02.checked) {
                    design02.checked = true;
                    document.body.classList.add('design-02');
                }
            }
            // Removing the base tier also removes Showcase, which depends on it
            if (this.id === 'design-02' && !this.checked) {
                const design03 = document.getElementById('design-03');
                if (design03 && design03.checked) {
                    design03.checked = false;
                    document.body.classList.remove('design-03');
                }
            }
        });
    });

    // Slider outputs — keep output value in sync with range input
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const output = document.getElementById(input.id + '-output');
        if (!output) return;
        input.addEventListener('input', () => { output.value = input.value; });
    });

    // Page title — append section name from hash so shared anchor links are distinguishable
    const BASE_TITLE = 'Native HTML Form Elements';
    function updateTitleFromHash() {
        const hash = window.location.hash.slice(1);
        if (!hash) { document.title = BASE_TITLE; return; }
        const section = document.getElementById(hash);
        const label = section && (
            section.querySelector('legend')?.textContent.trim() ||
            section.querySelector('h1,h2,h3')?.textContent.trim()
        );
        document.title = label ? `${BASE_TITLE} — ${label}` : BASE_TITLE;
    }
    window.addEventListener('hashchange', updateTitleFromHash);
    updateTitleFromHash();

    // Status banner — accessible feedback for section form submit/invalid/reset
    const banner = document.getElementById('status-banner');
    const bannerText = document.getElementById('status-banner-text');
    const bannerClose = document.getElementById('status-banner-close');
    let bannerTimer = null;

    function showBanner(message) {
        bannerText.textContent = message;
        banner.classList.add('is-visible');
        clearTimeout(bannerTimer);
        bannerTimer = setTimeout(hideBanner, 7000);
    }

    function hideBanner() {
        banner.classList.remove('is-visible');
        clearTimeout(bannerTimer);
    }

    if (bannerClose) bannerClose.addEventListener('click', hideBanner);

    function formLabel(form) {
        const heading = form.querySelector('legend') || form.querySelector('h1,h2,h3');
        return heading ? heading.textContent.trim() : 'Section';
    }

    // Submit — intercept, never actually send anywhere; show the serialized payload
    document.addEventListener('submit', (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        event.preventDefault();
        const pairs = [];
        for (const [key, value] of new FormData(form).entries()) {
            pairs.push(`${key}=${value}`);
        }
        const payload = pairs.length ? pairs.join(', ') : '(empty)';
        showBanner(`${formLabel(form)} — submitted. Payload: ${payload}`);
    });

    // Invalid — does not bubble, must listen on the capture phase.
    // Native validation fires one 'invalid' event per invalid control, all
    // synchronously before any UI/focus happens, so debounce with a 0ms
    // timer to collect the full count for one submit attempt.
    let invalidForm = null;
    let invalidCount = 0;
    let invalidTimer = null;
    document.addEventListener('invalid', (event) => {
        const form = event.target.form;
        if (!form) return;
        if (invalidForm !== form) {
            invalidForm = form;
            invalidCount = 0;
        }
        invalidCount++;
        clearTimeout(invalidTimer);
        invalidTimer = setTimeout(() => {
            const field = invalidCount === 1 ? 'field' : 'fields';
            showBanner(`${formLabel(form)} — submission blocked by native validation: ${invalidCount} invalid ${field}, browser focused the first.`);
            invalidForm = null;
        }, 0);
    }, true);

    // Reset — the reset event fires before the browser reverts field values,
    // so slider outputs must be re-synced a tick later.
    document.addEventListener('reset', (event) => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        showBanner(`${formLabel(form)} — reset to default values.`);
        setTimeout(() => {
            form.querySelectorAll('input[type="range"]').forEach(input => {
                const output = document.getElementById(input.id + '-output');
                if (output) output.value = input.value;
            });
        }, 0);
    });

    // Footer — render contributors from GitHub API
    const contributorsEl = document.getElementById('js-contributors');
    if (contributorsEl) {
        fetch('https://api.github.com/repos/formspiel/native-form-elements/contributors')
            .then(r => r.json())
            .then(list => {
                if (!Array.isArray(list)) return;
                list.forEach((c, i) => {
                    if (!c || typeof c.login !== 'string') return;
                    if (i > 0) contributorsEl.appendChild(document.createTextNode(', '));
                    if (typeof c.html_url === 'string' && c.html_url.startsWith('https://github.com/')) {
                        const a = document.createElement('a');
                        a.href = c.html_url;
                        a.textContent = c.login;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        contributorsEl.appendChild(a);
                    } else {
                        contributorsEl.appendChild(document.createTextNode(c.login));
                    }
                });
            })
            .catch(() => {});
    }

});
