var n = 10 + Math.random()*1000;

function Caesar(text, rot, inverse) {
    result = "";
    rot = rot - 1;
    rot = rot ** 3;
    rot = rot.toString();
    if (text.length < rot.toString().length)
        return null;

    rot  = "0".repeat(text.length - rot.toString().length) + rot;
    mask = 31;
    for (var i=0; i<text.length; i++) {
        mask = (mask*7) % 95;
        result += String.fromCharCode(32 + ((((text.charCodeAt(i) - 32) + (inverse ? mask : 95-mask)) + rot.charCodeAt(i) - 48) % 95));
    }
    return result;
}

function deobfuscate() {
    if (n == 0)
    return;

    let obfs = {
        // Hello future self, if you're wondering: use Caesar("...", 1, true) to generate these
        "#pragmathics": ">ok0-SiMt^u3",
        ".the_author":  "en^?E\\iG,Yw.;GhE+T",
        "a.the_email":  "&n^?<Gv=qcz/2dgn-SiBx#u/)",
        "a.the_linkedin": "Jhg]0UmI#V!$!ma><Kw"
    };
    let href = {
        the_email: "mailto:{0}",
        the_linkedin: "https://www.linkedin.com/in/{0}"
    };

    if (n & 1) { n = 3*n + 1} else { n = n >> 1;};

    for (var key of Object.keys(obfs))
    for (var elem of document.querySelectorAll(key)) {
        let deobfuscated = Caesar(obfs[key], n);
        if (deobfuscated != null) 
            elem.innerHTML = deobfuscated;
        if (deobfuscated != null && (key in href))
            elem.attributes["href"].value = href[key].format(deobfuscated);
    }

    if (Caesar("_ng4", n) == "Done")
    n = 0;
};

document.addEventListener("scroll", deobfuscate);
document.addEventListener("mousemove", deobfuscate);