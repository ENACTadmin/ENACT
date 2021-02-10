$(document).ready(function () {
    // Delete modal
    $("#loadMore").click(function () {
        let courseId = $('#courseId').text()
        $.ajax({
            type: 'GET',
            url: '/course/view/' + courseId + '/' + $('#skip').text(),
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        let htmlToAppend = '<div class=\'card-body\' style="margin-bottom: 20px">\n' +
                            '            <h4>' + data[i].name + '</h4>' +
                            '            <div class=\'card-text\'>' +
                            '                <ul class=\'list-group\'>' +
                            '                    <li class=\'list-group-item borderless box-padding\'>' +
                            '                        <b>Description: </b> ' + data[i].description +
                            '                    </li>' +
                            '                    <li class=\'list-group-item borderless box-padding\'>' +
                            '                        <b>Year: </b> ' + data[i].yearOfCreation +
                            '                    </li>' +
                            '                    <li class=\'list-group-item borderless box-padding\'>' +
                            '                        <b>State:</b> ' + data[i].state +
                            '                    </li>' +
                            '                </ul>' +
                            '            </div>'
                        if (data[i].mediaType === 'video') {
                            htmlToAppend += '            <li class=\'list-group-item borderless box-padding\'>\n' +
                                '                            <video width="400" controls>\n' +
                                '                                <source src=' + data[i].uri + 'type="video/mp4">\n' +
                                '                            </video>\n' +
                                '                        </li>'
                        } else {
                            htmlToAppend += '            <li class=\'list-group-item borderless box-padding\'>\n' +
                                '                            <b>Link: </b> <a href=' + data[i].uri + '>click me</a>\n' +
                                '                        </li>'
                        }
                        htmlToAppend += '        <li class=\'list-group-item borderless box-padding\'>\n' +
                            '                        <b>Institution: </b>' + data[i].institution + '\n' +
                            '                    </li>\n' +
                            '                    <li class=\'list-group-item borderless box-padding\'>\n' +
                            '                        <b>Author: </b>' + data[i].ownerName + '\n' +
                            '                    </li>'
                        if (data[i].tags.length >= 1 && data[i].tags[0].length !== 0) {
                            htmlToAppend += '            <li class=\'list-group-item borderless box-padding\'>\n' +
                                '                            <b>Tags:</b>' + data[i].tags + '\n' +
                                '                        </li>'
                        }

                        htmlToAppend += '<li class=\'list-group-item borderless box-padding\'>\n' +
                            '                        <b>Actions:</b>\n' +
                            '                        <button type="submit"\n' +
                            '                                style=\'border:0px solid transparent\'\n' +
                            '                                class=\'focusMe btn btn-outline-danger\'\n' +
                            '                                id="' + data[i]._id + '">' + '\n'

                        if ($('#resourceIdsMe').text().toString().includes(data[i]._id.toString())) {
                            htmlToAppend += '&#9829; </button>\n'
                        } else {
                            htmlToAppend += '&#9825; </button>\n'
                        }
                        if ($('#status').text() === 'admin' || $('#status').text() === 'faculty' || data[i].ownerId.toString() === $('#userId').text().toString()) {
                            htmlToAppend +=
                                '                            <button id="' + data[i]._id + '" type=\'button\'\n' +
                                '                                    class=\'editBtn btn btn-outline-info\'\n' +
                                '                                    style=\'border:0 solid transparent\'\n' +
                                '                                    data-toggle=\'modal\'\n' +
                                '                                    data-target=\'#editModal\'>\n' +
                                '                                Edit\n' +
                                '                            </button>\n' +
                                '                            <button id="' + data[i]._id + '" type=\'button\'\n' +
                                '                                    class=\'deleteBtn btn btn-outline-danger\'\n' +
                                '                                    style=\'border:0px solid transparent\'\n' +
                                '                                    data-toggle=\'modal\'\n' +
                                '                                    data-target=\'#deleteModal\'>\n' +
                                '                                Delete\n' +
                                '                            </button>\n'
                        }
                        if (data[i].ownerId.toString() !== $('#userId').text().toString()) {
                            htmlToAppend += '<a href=\'/messages/view/' + $('#userId').text() + '/' + data[i].ownerId + '/' + data[i]._id + '\'><input\n' +
                                '                        class=\'btn btn-outline-primary\' style=\'border:0px solid transparent\'\n' +
                                '                        type=\'button\' value=\'Contact the author\'></a>'
                        }
                        htmlToAppend += '                    </li></div>'
                        htmlToAppend += '<div id="appendAfterMe' + (parseInt($('#skip').text()) + 1) + '"' + '></div>'
                        htmlToAppend += '<script src="/js/likeAjax1.js"></script>\n'
                        htmlToAppend += '<script src="/js/editModalAjax.js"></script>\n'

                        $('#appendAfterMe' + $('#skip').text()).hide().append(htmlToAppend).slideDown()
                        $('#skip').text(parseInt($('#skip').text()) + 1)
                    }
                } else {
                    alert("No more resource available.")
                    $('#loadMore').hide()
                }
            }
        })
    })
})