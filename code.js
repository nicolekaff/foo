"use strict";
window.onload = main;

// Constants - update these as needed!
const USER_NAME = "nicolekaff";
const REPO_NAME = "arth-pair-practice";
const COURSE = "ARTH200";

// Global arrays for works
let art = [];
let architecture = [];
let all = [];

// Current works
let jsonA;
let jsonB;

function main() {
    // Update page heading
    document.querySelector("#heading").innerHTML = COURSE + " Exam Practice"
    
    // Assemble url
    let url = "https://api.github.com/repos/" + USER_NAME + "/" + REPO_NAME + "/contents/data/meta/";

    // Populate global art array
    let art_json = JSON.parse(Get(url + "art"));
    for (let element of art_json) {
        if ((element.download_url).endsWith(".json")) {
            art.push(element.download_url);
        }
    }

    // Populate global architecture array
    let arch_json = JSON.parse(Get(url + "architecture"));
    for (let element of arch_json) {
        if ((element.download_url).endsWith(".json")) {
            architecture.push(element.download_url);
        }
    }

    // Populate global "all" array
    all = art.concat(architecture);

    // Register event handlers
    document.querySelector("#imgButton").onclick = loadImages;
    document.querySelector("#metaButton").onclick = loadMetadata;
}

function loadImages() {
    // Get form values 
    let num_images = document.querySelector('input[name="num"]:checked').value;
    let category = document.querySelector('input[name="category"]:checked').value;

    // Validate 
    if (num_images === "1") {
        if ((category === "art" && art.length < 1) ||
            (category === "architecture" && architecture.length < 1) ||
            (category === "all" && all.length < 1)) {
            // If there are no images in the category, do nothing
            return;
        }
    } else {
        if ((category === "art" && art.length === 1) ||
            (category === "architecture" && architecture.length === 1) ||
            (category === "all" && all.length === 1)) {
            // If there is exactly 1 image in the category, set num to 1
            num_images = "1";
        } else if ((category === "art" && art.length < 2) ||
            (category === "architecture" && architecture.length < 2) ||
            (category === "all" && all.length < 2)) {
            // If there are no images in the category, do nothing
            return;
        }
    }

    // Get random images 
    let workA = getRandomWork(category);
    let workB;
    if (num_images === "1") {
        workB = undefined;
    } else {
        // Repeat until a distinct second work is chosen 
        do {
            workB = getRandomWork(category);
        } while (workA === workB);
    }
    
    // Format HTML
    let url = "https://raw.githubusercontent.com/" + USER_NAME + "/" + REPO_NAME + "/main/data/imgs/";
    jsonA = JSON.parse(Get(workA));
    let codeA = '<img src="' + url + jsonA.image + '">';
    let codeB;
    
    if (num_images === "1") {
        jsonB = undefined;
        codeB = "";
    } else {
        jsonB = JSON.parse(Get(workB));
        codeB = '<img src="' + url + jsonB.image + '">';
    }
    
    // Update HTML
    document.querySelector("#imgA").innerHTML = codeA;
    document.querySelector("#imgB").innerHTML = codeB;
    document.querySelector("#capA").innerHTML = " ";
    document.querySelector("#capB").innerHTML = " ";
}


function getRandomWork(category) {
    let getRandomNum = (min, max) => Math.floor(Math.random() * (max - min) + min);
    let randWork;
    if (category === "art") {
        randWork = art[getRandomNum(0, art.length)];
    } else if (category === "architecture") {
        randWork = architecture[getRandomNum(0, architecture.length)];
    } else {
        randWork = all[getRandomNum(0, all.length)];
    }
    
    return randWork;
}

function loadMetadata() {
    // Format HTML
    let codeA = "";
    let codeB = "";
    if (jsonA !== undefined) {
        codeA = jsonA.metadata;
    }
    
    if (jsonB !== undefined) {
        codeB = jsonB.metadata;
    }
    
    // Update HTML
    document.querySelector("#capA").innerHTML = codeA;
    document.querySelector("#capB").innerHTML = codeB;
}

// Fetch JSON
// Source: https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}
