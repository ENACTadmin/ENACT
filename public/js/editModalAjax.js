$(document).ready(function () {
    // Delete modal
    $('#deleteModal').hide()
    $(".deleteBtn").click(function () {
        let resource = null
        $.ajax({
            type: 'GET',
            url: '/resource/' + this.id,
            async: false,
            dataType: 'json',
            success: function (data) {
                resource = data
                // change form action attribute
                $('#deleteForm').attr('action', '/resource/remove/' + resource._id)
                $('#deleteModal').show()
            }
        });
    });

    // Edit modal
    $('#editModal').hide()
    $(".editBtn").click(function () {
        let resource = null
        $.ajax({
            type: 'GET',
            url: '/resource/' + this.id,
            async: false,
            dataType: 'json',
            success: function (data) {
                resource = data
                // console.log("Resource: ", resource)
                console.log(resource.name)
                $('#ownerNames').text(resource.ownerName)
                $('#resourceName').val(resource.name)
                $('#description').text(resource.description)
                $('#fileURL').val(resource.uri)
                $('#institution').val(resource.institution)
                $('#yearOfCreation').val(resource.yearOfCreation)
                let contentType = resource.contentType
                // console.log("Content type: ", resource.contentType)
                $('#contentTypeSelect' + ' option').each(function () {
                    if ($(this).val() === contentType) {
                        $(this).prop('selected', true)
                    }
                })
                let mediaType = resource.mediaType
                console.log("Content type: ", resource.mediaType)
                $('#mediaTypeSelect' + ' option').each(function () {
                    if ($(this).val() === mediaType) {
                        $(this).prop('selected', true)
                    }
                })
                let state = resource.state
                $('#stateSelect' + ' option').each(function () {
                    if ($(this).val() === state) {
                        $(this).prop('selected', true)
                    }
                })
                let status = resource.status
                $('#statusSelect' + ' option').each(function () {
                    if ($(this).val() === status) {
                        $(this).prop('selected', true)
                    }
                })
                let tags = resource.tags.toString()
                let tagsArray = tags.split(',')
                $(':checkbox').each(function () {
                    if (tagsArray.includes($(this).val())) {
                        $(this).prop('checked', true)
                    }
                })
                let checkboxes = $(':checkbox')
                let string = checkboxes.filter(':checked').map(function () {
                    return this.value;
                }).get().join(',');
                $('#tagsToReturn').val(string);
                checkboxes.on('change', function () {
                    let string = checkboxes.filter(':checked').map(function () {
                        return this.value;
                    }).get().join(',');
                    $('#tagsToReturn').val(string);
                })
                // change form action attribute
                $('#editForm').attr('action', '/resource/update/' + resource._id)
                $('#editModal').show()
            }
        });
        // display correct tags for different content types
        let text = $('#contentTypeSelect option:selected').text();
        if (text === 'Assignment Guidelines & Rubrics' || text === 'Course Reading' || text === 'ENACT Faculty Research' || text === 'Course Planning' || text === 'Online Teaching Resources' || text === 'Outlets for Publication' || text === 'Rubrics for grading' || text === 'State Legislative Website Resources') {
            $(".toShow").hide()
            $(".toShow2").hide()
        } else if (text === 'Syllabi') {
            $(".toShow2").show()
            $(".toShow").hide()
        } else {
            $(".toShow").show()
            $(".toShow2").hide()
        }
        $("#contentTypeSelect").on("change", function () {
            text = $('#contentTypeSelect option:selected').text();
            if (text === 'Assignment Guidelines & Rubrics' || text === 'Course Reading' || text === 'ENACT Faculty Research' || text === 'Course Planning' || text === 'Online Teaching Resources' || text === 'Outlets for Publication' || text === 'Rubrics for grading' || text === 'State Legislative Website Resources') {
                $(".toShow").hide()
                $(".toShow2").hide()
            } else if (text === 'Syllabi') {
                $(".toShow2").show()
                $(".toShow").hide()
            } else {
                $(".toShow").show()
                $(".toShow2").hide()
            }
        })
    })
})