/*
 * own functions
 */

function showErrorToast(text) {
    var d = {
        html: text,
        classes: 'toast-error',
        displayLength: 8000
    };
    M.toast(d);
}

function showToast(text) {
    var d = {
        html: text,
        displayLength: 4000
    };
    M.toast(d);
}

function showSuccessToast(text) {
    var d = {
        html: text,
        classes: 'toast-success',
        displayLength: 4000
    };
    M.toast(d);
}

function showWarningToast(text) {
    var d = {
        html: text,
        classes: 'toast-warning',
        displayLength: 6000
    };
    M.toast(d);
}