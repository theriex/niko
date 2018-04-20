/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, multivar, white, fudge, for */

var app = {},
    jt = {};

app = (function () {
    "use strict";

    var st = {};  //state variables

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


    function objvals (obj) {
        var str = "";
        Object.keys(obj).forEach(function (key) {
            if(str) {
                str += ", "; }
            str += key + ": " + obj[key]; });
        return str;
    }


    function sizeNameToFit () {
        var namediv = jt.byId("namediv"), wo, sv;
        namediv.style.marginLeft = "0px";
        st.snf = st.snf || {retries:[0, 1500, 2500, 7000], rti:0,
                            sc:{min:340, max:1000},
                            fs:{min:22, max:48, cur:24},
                            ls:{min:0.1, max:0.4, cur:0.1}};
        wo = st.snf.sc;
        wo.cur = window.innerWidth;
        wo.cur = Math.min(wo.cur, wo.max);
        wo.cur = Math.max(wo.cur, wo.min);
        //convert to scaled value in the range of 0 to 1
        sv = (wo.cur - wo.min) / (wo.max - wo.min)
        jt.log("sizeNameToFit sv: " + sv);
        wo = st.snf.fs;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        jt.log("sizeNameToFit fs: " + objvals(wo));
        namediv.style.fontSize = wo.cur + "px";
        wo = st.snf.ls;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        jt.log("sizeNameToFit ls: " + objvals(wo));
        namediv.style.letterSpacing = wo.cur + "em";
        if(st.snf.rti < st.snf.retries.length) {
            st.snf.rti += 1;
            setTimeout(sizeNameToFit, st.snf.retries[st.snf.rti]); }
    }


    function init () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
        sizeNameToFit();
    }


return {
    init: function () { init(); }
}
}());

