/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, multivar, white, fudge, for */

var app = {},
    jt = {};

app = (function () {
    "use strict";

    var st = {em:"niko",
              sechome:"narikostudio.com"};  //state variables

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
        //jt.log("sizeNameToFit sv: " + sv);
        wo = st.snf.fs;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        //jt.log("sizeNameToFit fs: " + objvals(wo));
        namediv.style.fontSize = wo.cur + "px";
        jt.byId("sitepicsdiv").style.paddingTop = (wo.cur + 50) + "px";
        wo = st.snf.ls;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        //jt.log("sizeNameToFit ls: " + objvals(wo));
        namediv.style.letterSpacing = wo.cur + "em";
        if(st.snf.rti < st.snf.retries.length) {
            st.snf.rti += 1;
            setTimeout(sizeNameToFit, st.snf.retries[st.snf.rti]); }
    }


    function showEmailContact () {
        var div = jt.byId("maildiv"),
            pc = ["m", "a", "i",   //fuckin bots.  Worth a shot.
                  "l", "t", "o",
                  "@"];
        div.style.marginRight = "0px";
        div.style.transform = "rotate(0deg)";
        setTimeout(function () {
            pc = pc.join("").slice(0, -1) + ":" + st.em + pc[pc.length - 1];
            pc += st.sechome;
            jt.log("Activating mail link");
            div.innerHTML = jt.tac2html(
                ["a", {href:pc}, div.innerHTML]); }, 1500);
    }


    function externalLinkClick (event) {
        var src;
        jt.evtend(event);
        src = event.target || event.srcElement;
        if(src) {
            if(!src.href) {  //event src gives you the img
                src = src.parentNode; }
            window.open(src.href); }
    }


    function showInstagramLink () {
        var div = jt.byId("instdiv"),
            link = div.children[0];
        div.style.marginRight = "0px";
        div.style.transform = "rotate(0deg)";
        jt.on(link, "click", externalLinkClick);
    }


    function showSiteFlyLink () {
        var div = jt.byId("flydiv"),
            link = div.children[0];
        div.style.marginRight = "0px";
        div.style.transform = "rotate(0deg)";
    }


    function showContactInfo () {
        showEmailContact();
        showInstagramLink();
        showSiteFlyLink();
    }


    function init () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
        sizeNameToFit();
        setTimeout(showContactInfo, 1200);
    }


return {
    init: function () { init(); }
}
}());

