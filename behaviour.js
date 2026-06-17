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

    // Footer — render contributors from GitHub API
    const contributorsEl = document.getElementById('js-contributors');
    if (contributorsEl) {
        fetch('https://api.github.com/repos/formspiel/native-form-elements/contributors')
            .then(r => r.json())
            .then(list => {
                if (!Array.isArray(list)) return;
                list.forEach((c, i) => {
                    if (i > 0) contributorsEl.appendChild(document.createTextNode(', '));
                    const a = document.createElement('a');
                    a.href = c.html_url;
                    a.textContent = c.login;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    contributorsEl.appendChild(a);
                });
            })
            .catch(() => {});
    }

});
