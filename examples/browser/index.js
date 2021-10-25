var object = { a: 1 };
eardrum.configure({
    object,
    property: 'b',
    value: 'lol',
    handler: function (event, arg) {
        console.log(arg);
    },
    listener: {
        type: 'click',
        target: document,
        bubble: false
    }
});