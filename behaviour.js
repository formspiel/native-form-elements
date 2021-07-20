/*
 * It looks like jQuery but it's Cash 💰
 * You'll find the documentation on GitHub: https://github.com/fabiospampinato/cash#readme
 *
 * Thanks to Stephan M. for helping me out with JS
 */


/*
 * Helper Functions
 * - find an attribute
 */
    $.fn.hasAttr = function (name) {
        return this.attr(name) !== undefined;
    };
    
    /* TODO: Convert skipt links to function
    $.fn.dynamicSkiplinks = function (name) {
        // 
    };
    */

// Skip link function
$(function () {
    
    // Basics
    $('html').removeClass('no-js');
    
    /*
     * Dynamic Skip Links
     *  looks for specific elements and built a list (select)
     */
    
    $('legend,h1,h2')
    .attr('tabindex', '-1')
    .removeAttr('title')
    .each(function () {
        var elementName = $(this).get(0).tagName.toLowerCase();
        var getElementAriaLabel = $(this).attr('aria-label');
        var getElementText = $(this).text();
        
        var noContent = 'hallo';
    
        if ($(this).hasAttr('aria-label')) {
            var elementAriaLabel = getElementAriaLabel;
        } else {
            var elementText = getElementText;
        }
        
        if ($(this).hasAttr('id')) {
            // console.log("true");
        } else {
            $(this).attr('id', elementName);
            $('#js-nav-skip-links').append(
                '<li><a href="#' + elementName + '">Go to ' + (elementAriaLabel!=null ? elementAriaLabel : (elementText!=null ? elementText : 'undefined')) + " (" + elementName + ")" + "</a></li>"
            );
        }
    });
    
    /*
     * Design options
     * optional styles based on checkboxes
     */
    
    $('.design-option').on('change', function() {
        var elementId = this.id;
        
        if(this.checked) {
            $('body').addClass(elementId);
        } else {
            $('body').removeClass(elementId);
        }
    });

});