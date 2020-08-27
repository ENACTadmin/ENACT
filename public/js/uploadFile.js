$(document).ready(function () {
    $('#closeBtn').hide()
    $('#fileName').hide()
    $('#fileType').hide()
    let checkboxes = $(':checkbox');
    checkboxes.on('change', function () {
        let string = checkboxes.filter(':checked').map(function () {
            return this.value;
        }).get().join(',');
        $('#tagsToReturn').val(string);
    });
});

function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // autofill url
                document.getElementById('fileURL').value = url;
                // document.getElementById('resourceName').value = file.name.split('.')[0];
                $('#closeBtn').show()
                $('#fileName').text('File name: ' + file.name)
                $('#fileName').show()
                $('#fileType').text('File type: ' + file.type)
                $('#fileType').show()
                $('.uploaded').text('Uploaded!')
                $('#uploadStatus').attr("src", "https://cdn0.iconfinder.com/data/icons/sports-colored-icons-3/48/110-512.png");
            } else {
                alert('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}