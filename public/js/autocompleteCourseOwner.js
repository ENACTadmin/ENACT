$(document).ready(function () {
    "use strict";

    let profiles = null;

    // Fetch profiles data
    $.ajax({
        type: 'GET',
        url: '/profiles/faculties',
        async: false,
        dataType: 'json',
        success: function (data) {
            profiles = data;
            // Add a label field for autocomplete
            profiles.forEach(profile => {
                profile.label = profile.userName;
            });
        },
        error: function (err) {
            console.error('Error fetching profiles:', err);
        }
    });

    var input = document.getElementById("profiles");
    var ownerId = document.getElementById("ownerId");

    // Initialize autocomplete
    autocomplete({
        input: input,
        fetch: function (text, update) {
            text = text.toLowerCase();
            var suggestions = profiles.filter(profile =>
                profile.label && profile.label.toLowerCase().includes(text)
            );
            update(suggestions);
        },
        onSelect: function (item) {
            input.value = item.userName;
            ownerId.value = item._id;
        }
    });
});