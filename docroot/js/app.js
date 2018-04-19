/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, multivar, white, fudge, for */

var app = {},
    jt = {};

app = (function () {
    "use strict";

    //Sometimes there's a significant lag loading the fonts, and if
    //that is done in the index page then you are just sitting there
    //waiting for the site to display.  That's annoying and looks bad.
    //Need to avoid that problem, so load the fonts last.  This might
    //cause a blink in the display, but it's worth it to not have that
    //hideous lag occasionally.
    function addFontSupport () {
        var fontlink = document.createElement("link");
        fontlink.href = "//fonts.googleapis.com/css?family=Boogaloo";
        fontlink.rel = "stylesheet";
        //fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        jt.log("added stylesheet " + fontlink.href);
        fontlink = document.createElement("link");
        fontlink.href = "//fonts.googleapis.com/css?family=Open+Sans:400,700";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        jt.log("added stylesheet " + fontlink.href);
    }


    function init () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
    }


return {
    init: function () { init(); }
}
}());

