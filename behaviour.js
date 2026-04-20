/*
 * It looks like jQuery but it's Cash 💰
 * https://github.com/fabiospampinato/cash#readme
 */

$(function () {

    $('html').removeClass('no-js');

    // Enable Streamline typography by default on local builds
    if (window.location.hostname !== 'nativeformelements.com') {
        $('#design-01').prop('checked', true);
        $('body').addClass('design-01');
    }

    // Indeterminate checkbox — must be set via JS, cannot be done in HTML
    const checkIndeterminate = document.getElementById('check-indeterminate');
    if (checkIndeterminate) checkIndeterminate.indeterminate = true;

    // Design tier toggles — apply/remove body class matching checkbox id
    $('.design-option').on('change', function () {
        if (this.checked) {
            $('body').addClass(this.id);
        } else {
            $('body').removeClass(this.id);
        }
    });

});
