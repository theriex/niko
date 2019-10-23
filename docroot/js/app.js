/*global jtminjsDecorateWithUtilities, document, setTimeout, window */
/*jslint browser, white, fudge, for, long */

var app = {};
var jt = {};
var menu = [
    {hash:"windisp", name:"Window Displays", type:"pics", content:[
        {sec:"1_temp_1200w.jpg", pics:[
            "2_1200w.jpg", "5_1200w.jpg", "8-798A9322_1200w.jpg", "17-798A9402_3_4_5_6_7_8_1200w.jpg", 
            "12-798A9410_1_2_1200w.jpg"]},
        {sec:"etc_windows-71_1200w.jpg", pics:[
            "etc_windows-57_1200w.jpg", "etc_windows-17_1200w.jpg", "etc_windows-24_1200w.jpg", 
            "etc_windows-2_1200w.jpg", "etc_windows-5_1200w.jpg"]}]},
    {hash:"sculpture", name:"Sculpture", type:"pics"},
    //{hash:"events", name:"Events", type:"pics"},
    {hash:"production", name:"Production", type:"pics"},
    {hash:"bio", name:"Bio", type:"pages", file:"bio.html"},
    {hash:"cv", name:"CV", type:"pages", file:"cv.html"},
    {hash:"email", name:"Contact", type:"email"}];


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
        //namediv
        var fontlink = document.createElement("link");
        fontlink.href = "//fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext";
        fontlink.rel = "stylesheet";
        //fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        jt.log("added stylesheet " + fontlink.href);
        //menulinksdiv...  Quicksand has rendering issues
        fontlink = document.createElement("link");
        fontlink.href = "https://fonts.googleapis.com/css?family=Quicksand&display=swap";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        jt.log("added stylesheet " + fontlink.href);
        //body
        fontlink = document.createElement("link");
        fontlink.href = "//fonts.googleapis.com/css?family=Open+Sans:400,700";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        jt.log("added stylesheet " + fontlink.href);
    }


    //minorly obfuscate this source to avoid crawler spam
    function getContactLink () {
        var pc = ["m", "a", "i",
                  "l", "t", "o",
                  "@"];
        var contact = pc.join("").slice(0, -1) + ":" + st.em + 
            pc[pc.length - 1] + st.sechome + "?subject=" +
            jt.dquotenc("website contact");
        return contact;
    }


    function showMenu () {
        var html = "";
        menu.forEach(function (mi, idx) {
            var ho = {};
            switch(mi.type) {
            case "email":
                ho.href = getContactLink();
                break;
            case "pics":
                ho.href = "#" + mi.hash;
                ho.onclick = jt.fs("app.showcontent(" + idx + ")");
                break;
            default: //assume "pages" file
                ho.href = "pages/" + mi.file;
                ho.onclick = jt.fs("app.showcontent(" + idx + ")"); }
            html += jt.tac2html(
                ["div",
                 ["a", ho, mi.name]]); });
        jt.out("menulinksdiv", html);
        jt.out("contentdiv", jt.tac2html(
            ["img", {cla:"dispimg", id:"sigpic", src:"img/frontpic_1200w.jpg",
                     onclick:jt.fs("app.togimgexp('sigpic')")}]));
    }


    function relativeToAbsolute (url) {
        var loc = window.location.href;
        loc = loc.slice(0, loc.lastIndexOf("/") + 1);
        return loc + url;
    }


    function displayDocContent (url, html) {
        if(!html || !html.trim()) {
            html = url + " contains no text."; }
        var idx = html.indexOf("<body");
        if(idx > 0) {
            html = html.slice(idx);
            idx = html.indexOf(">");
            html = html.slice(idx + 1, html.indexOf("</body")); }
        jt.out("contentdiv", html);
    }


    function showFileContents (cdef) {
        if(!cdef.file) {
            return jt.out("contentdiv", "No file specified for " + cdef.name); }
        var url = relativeToAbsolute(cdef.type + "/" + cdef.file);
        jt.out("contentdiv", "Retrieving " + url + " ...");
        //requires a local web server (cd docroot, http-server, localhost:8080)
        jt.request("GET", url, null,
                   function (resp) {
                       displayDocContent(url, resp); },
                   function (code, errtxt) {
                       displayDocContent(url, String(code) + ": " + errtxt); },
                   jt.semaphore("app.showFileContents"));
    }


    function sectionPicLink (mi, si) {
        var md = menu[mi];
        var sd = md.content[si];
        return jt.tac2html(
            ["a", {href:"#expand_" + si,
                   onclick:jt.fs("app.expsec(" + mi + "," + si + ")")},
             [["img", {src:"img/" + md.hash + "/" + sd.sec, cla:"idximg"}],
              ["span", {cla:"arrowspanright"}, "&gt;"]]]);
    }


    function showPics (cdef, mi) {
        if(!cdef.content || !cdef.content.length) {
            return jt.out("contentdiv", cdef.name + " being revised, " + 
                   "please check back in a few days."); }
        var html = "";
        cdef.content.forEach(function (ignore, idx) {
            html += jt.tac2html(
                ["div", {cla:"secpicdiv", id:"secpicdiv" + idx},
                 sectionPicLink(mi, idx)]); });
        jt.out("contentdiv", html);
    }


    function expandPicSection (mi, si) {
        var md = menu[mi];
        var sd = md.content[si];
        var html = jt.tac2html(
            ["div", {cla:"sectionclosediv"},
             ["a", {href:"#collapse_" + si,
                    onclick:jt.fs("app.closec(" + mi + "," + si + ")")},
              ["span", {cla:"arrowspanleft"}, "&lt;"]]]);
        var imgidb = "dimg_m" + mi + "s" + si;
        var srcb = "img/" + md.hash + "/";
        html += jt.tac2html(
            ["img", {cla:"dispimg", id:imgidb, src:srcb + sd.sec,
                     onclick:jt.fs("app.togimgexp('" + imgidb + "')")}]);
        sd.pics.forEach(function (pn, idx) {
            var iid = imgidb + "c" + idx;
            html += jt.tac2html(
                ["img", {cla:"dispimg", id:iid, src:srcb + pn,
                         onclick:jt.fs("app.togimgexp('" + iid + "')")}]); });
        jt.out("secpicdiv" + si, html);
    }


    function collapsePicSection (mi, si) {
        jt.out("secpicdiv" + si, sectionPicLink(mi, si));
    }


    function showContent (idx) {
        var cdef = menu[idx];
        jt.out("menulinksdiv", jt.tac2html(
            ["div",
             ["a", {href:"#menu", onclick:jt.fs("app.showmenu()")},
              [["span", {cla:"arrowspanleft"}, "&lt;"],
               cdef.name]]]));
        if(cdef.type === "pics") {
            showPics(cdef, idx); }
        else {
            showFileContents(cdef); }
    }


    // function objvals (obj) {
    //     var str = "";
    //     Object.keys(obj).forEach(function (key) {
    //         if(str) {
    //             str += ", "; }
    //         str += key + ": " + obj[key]; });
    //     return str;
    // }


    function sizeNameToFit () {
        var namediv = jt.byId("namediv"); var wo; var sv;
        namediv.style.marginLeft = "0px";
        st.snf = st.snf || {retries:[0, 1500, 2500, 7000], rti:0,
                            sc:{min:340, max:1000},
                            fs:{min:20, max:48, cur:24},
                            ls:{min:0.1, max:0.4, cur:0.1}};
        wo = st.snf.sc;
        wo.cur = window.innerWidth;
        wo.cur = Math.min(wo.cur, wo.max);
        wo.cur = Math.max(wo.cur, wo.min);
        //convert to scaled value in the range of 0 to 1
        sv = (wo.cur - wo.min) / (wo.max - wo.min);
        //jt.log("sizeNameToFit sv: " + sv);
        wo = st.snf.fs;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        //jt.log("sizeNameToFit fs: " + objvals(wo));
        namediv.style.fontSize = wo.cur + "px";
        wo = st.snf.ls;
        wo.cur = wo.min + (sv * (wo.max - wo.min));
        //jt.log("sizeNameToFit ls: " + objvals(wo));
        namediv.style.letterSpacing = wo.cur + "em";
        if(st.snf.rti < st.snf.retries.length) {
            st.snf.rti += 1;
            setTimeout(sizeNameToFit, st.snf.retries[st.snf.rti]); }
    }


    function init () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
        showMenu();
        sizeNameToFit();
    }


    function toggleImageExpansion (imgid) {
        var img = jt.byId(imgid);
        if(!img) {
            return jt.log("toggleImageExpansion no img id " + imgid); }
        if(img.className.indexOf("dispimg") >= 0) {
            img.className = "fullimg"; }
        else {
            img.className = "dispimg"; }
    }


return {
    init: function () { init(); },
    togimgexp: function (imgid) { toggleImageExpansion(imgid); },
    showcontent: function (idx) { showContent(idx); },
    showmenu: function () { showMenu(); },
    expsec: function (mi, si) { expandPicSection(mi, si); },
    closec: function (mi, si) { collapsePicSection(mi, si); }
};
}());

