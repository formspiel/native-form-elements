// Simple prototype for a dynamic skip link navigation see https://codepen.io/formspiel/pen/XWpyLwO
// Developer needed to make it ready to go live

// looks like jQuery but it's 'Cash' ;-) ==> https://github.com/fabiospampinato/cashs

$(function () {
    $('html').removeClass('no-js');
    
    // HELPER
    $.fn.hasAttr = function (name) {
        return this.attr(name) !== undefined;
    };
    
    // DESIGN TOGGLE
    $('#design-01').change(function(){
        if($(this).is(":checked")) {
            console.log("design 01 on");
            $('html').addClass("design-01");
        } else {
            console.log("design 01 OFF");
            $('html').removeClass("design-01");
        }
    });
    
    // DYNAMIC SKIP LINKS
    $('legend')
    .attr("tabindex", "-1")
    .removeAttr("title")
    .each(function () {
      var elementname = $(this).get(0).tagName.toLowerCase();
      var getElementAriaLabel = $(this).attr("aria-label");

      if ($(this).hasAttr("aria-label")) {
        //console.log("I've an aria label");
        console.log("label " + elementname + " " + getElementAriaLabel);
        var elementAriaLabel = getElementAriaLabel;
      } else {
        console.log("no label for " + elementname);
      }

      if ($(this).hasAttr("id")) {
        // console.log("true");
      } else {
        // console.log("false " + elementname);
        $(this).attr("id", elementname);
        $("#js-nav-skip-links").append(
          '<li><a href="#' +
            elementname +
            '">Go to ' +
            elementname +
            " " +
            elementAriaLabel +
            "</a></li>"
        );
      }
    });

});

//.js-add-style
//.js-change-layout