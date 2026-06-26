// import autocomplete from "autocompleter";

$(document).ready(function () {
    "use strict"
    let resourcesJSON = null
    // page is ready
    $.ajax({
        type: 'GET',
        url: '/resources/all',
        async: false,
        dataType: 'json',
        success: function (data) {
            resourcesJSON = data
        }
    });

    let tagsJSON = null
    // page is ready
    $.ajax({
        type: 'GET',
        url: '/tags/all',
        async: false,
        dataType: 'json',
        success: function (data) {
            tagsJSON = data
        }
    });

    let tags = ['agriculture'
        , 'arts and culture'
        , 'cannabis'
        , 'consumer protection'
        , 'COVID-19'
        , 'criminal justice'
        , 'disability'
        , 'education'
        , 'elderly'
        , 'energy'
        , 'environment/climate change'
        , 'gun control'
        , 'healthcare'
        , 'higher education'
        , 'housing and homelessness'
        , 'immigration'
        , 'labor'
        , 'LGBTQ+'
        , 'mental health'
        , 'opioids'
        , 'public health'
        , 'public safety'
        , 'race'
        , 'substance use and recovery'
        , 'taxes'
        , 'technology'
        , 'tourism'
        , 'transportation'
        , 'veterans'
        , 'violence and sexual assault'
        , 'voting'
        , 'women and gender']

    for (let tag = 0; tag < tagsJSON.length; tag++) {
        tags.push(tagsJSON[tag].info)
    }

    for (let resource = 0; resource < resourcesJSON.length; resource++) {
        if (resourcesJSON[resource].contentType !== "empty")
            resourcesJSON[resource].label = resourcesJSON[resource].name + " [" + resourcesJSON[resource].contentType + "] ";
        else
            resourcesJSON[resource].label = resourcesJSON[resource].name;
    }

    let input = document.getElementById("resources");

    // build static lookup lists once
    let tagLookup = tags.map(t => ({ label: t }));
    let nameLookup = [];
    let seenNames = new Set();
    for (let resource in resourcesJSON) {
        let name = resourcesJSON[resource].ownerName;
        if (!seenNames.has(name)) {
            nameLookup.push({ label: name });
            seenNames.add(name);
        }
    }
    let contentLookup = [];
    let seenContent = new Set();
    for (let resource in resourcesJSON) {
        let contentType = resourcesJSON[resource].contentType;
        if (!seenContent.has(contentType)) {
            contentLookup.push({ label: contentType });
            seenContent.add(contentType);
        }
    }

    let debounceTimer = null;

    autocomplete({
        input: input,
        fetch: function (text, update) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                text = text.toLowerCase();
                let suggestions = resourcesJSON.filter(n => n.label !== undefined && n.label.toLowerCase().includes(text)).slice(0, 10);
                let tagSuggestions = tagLookup.filter(n => n.label.toLowerCase().includes(text));
                let nameSuggestions = nameLookup.filter(n => n.label.toLowerCase().includes(text));
                let contentSuggestions = contentLookup.filter(n => n.label.toLowerCase().includes(text));
                suggestions = tagSuggestions.concat(nameSuggestions).concat(contentSuggestions).concat(suggestions);
                update(suggestions);
            }, 150);
        },
        onSelect: function (item) {
            input.value = item.label;
        },
        render: function (item, currentValue) {
            let div = document.createElement("div");
            div.textContent = item.label;
            div.setAttribute('class', "complete-items");
            return div;
        },
        // className: "className",
        disableAutoSelect: true
    });
})