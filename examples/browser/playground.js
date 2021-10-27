var objectHandle = document.getElementById('objectHandle');
var propertyHandle = document.getElementById('propertyHandle');
var valueHandle = document.getElementById('valueHandle');
var handlerHandle = document.getElementById('handlerHandle');
var listenerHandle = document.getElementById('listenerHandle');
var listenerRemovalConditionHandle = document.getElementById('listenerRemovalConditionHandle');
var additionalRefPropsHandle = document.getElementById('additionalRefPropsHandle');
var handles = [
    objectHandle,
    propertyHandle,
    handlerHandle,
    listenerHandle,
    listenerRemovalConditionHandle,
    additionalRefPropsHandle
];

handles.forEach(function (handle) {
    assignUserCodeToVar(handle);
});

function assignUserCodeToVar (handle) {
        var varName = handle.dataset.var;
        handle.onchange = function () {
            try {
                var string = handle.value.trim();
                var sanitized = sanitizeJsStr(string);
                var assignment = varName + ' = ' + sanitized;
                eval(assignment);

                handle.value = sanitized;
                handle.classList.remove('error');
                refreshOutput();
            } catch (err) {
                displayError(handle, err);
            }
        };
}

function sanitizeJsStr (str) {
    if (str === '') return 'undefined';
    return str;
}

function displayError (handle, err) {
    if (!handle.classList.contains('error')) {
        handle.classList.add('error');
    }
    var errElement = handle.nextElementSibling;
    if (!errElement) {
        // Create error element if it does not already exists
        errElement = document.createElement('p');
        errElement.classList = 'alert alert-danger';
    }
    errElement.textContent = err.stack;
    var btn = document.createElement('i');
    btn.className = 'toggle-btn fa fa-times';
    btn.onclick = function () { handle.parentElement.removeChild(errElement); };
    errElement.appendChild(btn);
    handle.parentElement.appendChild(errElement);
}
