/*
Function to carry out the actual PUT request to S3 using the signed request from the app.
*/
function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById('preview').src = url;
                document.getElementById('imageURL').value = url;
            } else {
                alert('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}