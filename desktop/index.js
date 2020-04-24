const apiBase = 'http://localhost:5000';
const routeSaveNote = '/save-note';
const routeGetNoteBody = '/get-note-body';
const notesIcon = document.querySelector('.cpa__dock-app-icon#notes');
const activeAppTarget = document.querySelector('.cpa__app-body');

// const notesInterface = 
// hardcoded functionality for mvp prototype
const noteBodyTextArea = document.querySelector('.modules-notes__text-area');

notesIcon.addEventListener('click', () => {
    alert('click');
});

/**
 * Sample doc block
 * @param {String} url - the API endpoint 
 * @param {Object} data - JSON 
 * @param {Function} success - callback 
 */
// MDN post function
const postAjax = (url, data, success) => {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        else { console.log('req failed', xhr.responseText) }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
    return xhr;
}

// on key up send request to save
let keyupTimeout;

noteBodyTextArea.addEventListener('keyup', () => {
    const textArea = noteBodyTextArea;
    keyupTimeout = setTimeout(() => {
        postAjax(
            apiBase + routeSaveNote,
            {"noteName": "new note", // saves to same note
                "noteBody": textArea.value},
            (data) => {
                console.log('success callback: ', data); });
    }, 1000);
});