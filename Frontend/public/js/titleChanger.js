

const title = ['DoKM91AS', 'Steam HourBooster', 'Crew-Crew'];
let titleNumber = 0;
let letterIndex = 1;



function betterTitleScroll() {
    let next = false;
    let timeout = 750;
    let titleMessage = "";

    next = scroll();

    if (next) {
        timeout = 3000;
        titleNumber++;
        //resets back to the first title
        if (titleNumber === title.length) {
            titleNumber = 0;
        }
        letterIndex = 0;

    }
    window.setTimeout(betterTitleScroll, timeout);
}

betterTitleScroll();

function scroll() {
    let test = '_________________________________';

    titleMessage = title[titleNumber].substr(0, letterIndex).concat(test.substr(letterIndex, title[titleNumber].length - letterIndex));

    let nexttitle = false

    letterIndex++;
    if (letterIndex === title[titleNumber].length + 1) {
        letterIndex = 0;
        nexttitle = true;
    }
    document.title = titleMessage;
    return nexttitle
}