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
    
    //  https://stackoverflow.com/questions/26203453/jquery-generate-unique-ids
    function Generator() {}
        Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();
        Generator.prototype.getId = function() {
            return this.rand++;
        };
    
    var idGen = new Generator();
    
    /* TODO: Convert skipt links to function
    $.fn.dynamicSkiplinks = function (name) {
        // 
    };
    */
    

// Skip link function
$(function () {
    
    // Basics
    $('html').removeClass('no-js');
    
    // DEBUG
    //if(window.location.href.includes('github')) {
    if (document.location.href.indexOf('github') === -1) {
        $('#design-01').attr('checked', true);
        // $('#design-02').attr('checked', true);
        // $('#design-03').attr('checked', true);
    }
    
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
        
        var noContent = 'No label';
    
        if ($(this).hasAttr('aria-label')) {
            var elementAriaLabel = getElementAriaLabel;
        } else {
            var elementText = getElementText;
        }
        
        if ($(this).hasAttr('id')) {
            // console.log("true");
        } else {
            var elementUniqueId = idGen.getId();
            
            $(this).attr('id', elementUniqueId);
            $('#js-nav-skip-links').append(
                '<li><a href="#' + elementUniqueId + '">Go to ' + (typeof elementAriaLabel !== 'undefined' ? elementAriaLabel : (elementText != '' ? elementText : noContent)) + " (" + elementName + ")" + "</a></li>"
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
