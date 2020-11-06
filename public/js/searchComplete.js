// import autocomplete from "autocompleter";

$(document).ready(function () {
    "use strict"
    let resources = null
    // page is ready
    $.ajax({
        type: 'GET',
        url: '/resources/all',
        async: false,
        dataType: 'json',
        success: function (data) {
            resources = data
        }
    });

    for (var resource in resources) {
        resources[resource].label = resources[resource].name;
    }

    var input = document.getElementById("resources");

    autocomplete({
        input: input,
        fetch: function (text, update) {
            text = text.toLowerCase();
            // you can also use AJAX requests instead of preloaded data
            var suggestions = resources.filter(n => (n.label !== undefined && n.label.toLowerCase().startsWith(text)))
            // console.log("suggestions: ", suggestions)
            update(suggestions);
        },
        onSelect: function (item) {
            input.value = item.name;
        }
    });
})