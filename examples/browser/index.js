// Utils
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomCol () {
    return 'rgb(' + getRandomInt(50, 205) + ',' + getRandomInt(50, 205) + ',' + getRandomInt(50, 205) + ')';
}
/**
 * 
 * @param {string} rgb color in rgb format
 * @returns {string} same color, transparent, in rgba format
 */
function transparentize (rgb, a) {
    var split = rgb.split(')')[0];
    var arr = ['rgba', split.split('rgb')[1], ', ', (a || .5), ')'];
    return arr.join('');
}

// Create butterflies
var butterflies = [];
var currentButterflyId = -1;
var clockwise = false;
var createButterfly = function (clickEvent) {
    ++currentButterflyId;
    clockwise = !clockwise;
    var radius = 60;
    var margin = getRandomInt(radius/2, radius*3);
    var width = radius + margin;
    var fontSize = getRandomInt(20, 40);
    var speed = getRandomInt(2, 13);
    var color = getRandomCol();

    var element = document.createElement('div');
    element.className = 'butterfly';
    element.id = 'butterfly' + currentButterflyId;
    element.style.height = width + 'px';
    element.style.width = width + 'px';
    element.style.fontSize = fontSize + 'px';
    element.style.color = color;
    //element.style.border = '1px solid ' + transparentize(color);

    var icon = document.createElement('i');
    icon.className = 'fa fa-bug';
    element.appendChild(icon);

    var butterfly = {
        id: currentButterflyId,
        html: element,
        deg: 0,
        clockwise: clockwise,
        radius: radius,
        margin: margin,
        speed: speed,
        fontSize: fontSize,
        color: color
    };

    moveButterfly(clickEvent, butterfly) // initialize butterfly position
    var parent = document.getElementById('butterflies');
    if (parent) {
        parent.appendChild(element);
    }
    butterflies.push(butterfly);
    return butterfly;
};

// Move butterfly to mouse position
var moveButterfly = function (mouseEvent, butterfly) {
    var clientX = mouseEvent.clientX;
    var clientY = mouseEvent.clientY;
    var x = clientX - ((butterfly.radius + butterfly.margin)/2);
    var y = clientY - ((butterfly.radius + butterfly.margin)/2);
    if (butterfly.clockwise) {
        butterfly.deg += butterfly.speed;
    } else {
        butterfly.deg -= butterfly.speed;
    }
    butterfly.html.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + butterfly.deg + 'deg)';
};


// Create configurable object
var myObject = {};

/*
======================================
   Configure object with eardrum.js
======================================
*/
function configureObject (clickEvent) {
    var newButterfly = createButterfly(clickEvent);

    eardrum.configure({
        object: myObject,
        property: 'property',
        handler: function (mouseEvent, config) {
            moveButterfly(mouseEvent, newButterfly);
        },
        listener: {
            target: window,
            type: 'mousemove'
        },
        additionalRefProperties: {
            butterfly: newButterfly
        }
    });
}





// DOM
var configureObjectBtn = document.getElementById('configureObjectBtn');
configureObjectBtn.onclick = configureObject;