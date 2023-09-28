   // changed the search function so that it can search for the filters without keywords.
   
   $(document).ready(function () {
        let checkboxes = $(':checkbox');
        checkboxes.on('change', function () {
            let string = checkboxes.filter(':checked').map(function () {
                return this.value;
            }).get().join(',');
            $('#tagsToReturn').val(string);
        });
    
        // Get the input field for keywords
        let inputKeywords = $('#resources');
    
        // Get the select element for the filter
        let selectFilter = $('#contentSelect');
    
        // Get the submit button
        let submitButton = $('#myBtn');
    
        // Execute a function when the user releases a key on the keyboard
        inputKeywords.on("keyup", function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Trigger the button element with a click
                submitButton.click();
            }
        });
    
        // Execute a function when the filter changes
        selectFilter.on("change", function () {
            // Trigger the button element with a click
            submitButton.click();
        });
    });