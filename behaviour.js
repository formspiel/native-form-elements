document.addEventListener('DOMContentLoaded', function () {

    document.documentElement.classList.remove('no-js');

    // Enable Streamline typography by default on local builds
    if (window.location.hostname !== 'nativeformelements.com') {
        const design01 = document.getElementById('design-01');
        if (design01) {
            design01.checked = true;
            document.body.classList.add('design-01');
        }
    }

    // Indeterminate checkbox — must be set via JS, cannot be done in HTML
    const checkIndeterminate = document.getElementById('check-indeterminate');
    if (checkIndeterminate) checkIndeterminate.indeterminate = true;

    // Design tier toggles — apply/remove body class matching checkbox id
    document.querySelectorAll('.design-option').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            document.body.classList.toggle(this.id, this.checked);
        });
    });

    // Slider outputs — keep output value in sync with range input
    document.querySelectorAll('input[type="range"]').forEach(function (input) {
        const output = document.getElementById(input.id + '-output');
        if (!output) return;
        input.addEventListener('input', function () {
            output.value = input.value;
        });
    });

});
