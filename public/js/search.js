$(document).ready(function () {
    let checkboxes = $(':checkbox');
    checkboxes.on('change', function () {
        let string = checkboxes.filter(':checked').map(function () {
            return this.value;
        }).get().join(',');
        $('#tagsToReturn').val(string);
    });

    // Get the input field
    let input = document.getElementById("resources");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        let code
        if (event.key !== undefined) {
            code = event.key;
        } else if (event.keyIdentifier !== undefined) {
            code = event.keyIdentifier;
        } else if (event.keyCode !== undefined) {
            code = event.keyCode;
        }
        if (code === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("myBtn").click();
        }
    });
});