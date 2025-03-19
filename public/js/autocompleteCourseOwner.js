$(document).ready(function () {
    "use strict";

    let profiles = [];

    // Fetch profiles data
    $.ajax({
        type: 'GET',
        url: '/profiles/faculties',
        dataType: 'json',
        success: function (data) {
            profiles = data.map(profile => ({
                label: profile.userName,
                value: profile.userName, // Ensures correct selection
                id: profile._id // Store _id separately
            }));
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
            input.value = item.value; // Correct username
            ownerId.value = item.id;  // Correct faculty _id
        }
    });

    // Ensure ownerId is updated if input is manually changed and matches an existing profile
    input.addEventListener('blur', function () {
        const selectedProfile = profiles.find(profile => profile.value === input.value);
        if (selectedProfile) {
            ownerId.value = selectedProfile.id;
        } else {
            ownerId.value = ''; // Clear ID if no match
        }
    });
});