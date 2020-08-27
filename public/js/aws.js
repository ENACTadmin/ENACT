$(document).ready(function () {
    "use strict"

    /*
    Function to get the temporary signed request from the app.
    If request successful, continue to upload the file using this signed
    request.
    */
    function getSignedRequest(file) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    uploadFile(file, response.signedRequest, response.url);
                } else {
                    alert('Could not get signed URL.');
                }
            }
        };
        xhr.send();
    }

    /*
    Function called when file input updated. If there is a file selected, then
    start upload procedure by asking for a signed request from the app.
    */
    (() => {
        document.getElementById("file-input").onchange = () => {
            const files = document.getElementById('file-input').files;
            const file = files[0];
            if (file === null) {
                return alert('No file selected.');
            }
            $('.uploaded').text('Uploading')
            $('#uploadStatus').attr("src", "https://blog.brightonps.sa.edu.au/wp-content/uploads/2018/11/runningman.gif");
            getSignedRequest(file);
        };
    })();
});
