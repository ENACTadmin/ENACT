$(document).ready(function () {
    $("#addButton").click(function () {
        $("#form-horizontal").append('<br class="removeMe">' +
            '<div class="input-group-prepend" id="input-group-prepend' + '">' +
            '<span class="input-group-text" style="width: 180px">Start Time</span>' +
            '<input class="form-control" type="time" name="startTime" style="margin: 0 20px 0 0">' +
            '<span class="input-group-text" style="width: 180px">End Time</span>' +
            '<input class="form-control" type="time" name="endTime" style="margin: 0 20px 0 0">' +
            '<span class="input-group-text" style="width: 180px">Day</span>' +
            '<select id="day" class="form-control" name="day">\n' +
            '        <option value="Monday">Monday</option>\n' +
            '        <option value="Tuesday">Tuesday</option>\n' +
            '        <option value="Wednesday">Wednesday</option>\n' +
            '        <option value="Thursday">Thursday</option>\n' +
            '        <option value="Friday">Friday</option>\n' +
            '        <option value="Saturday">Saturday</option>\n' +
            '        <option value="Sunday">Sunday</option>\n' +
            '</select>' +
            '</div>');
    });
    $("#removeButton").click(function () {
        if ($("#input-group-prepend" + ".input-group-prepend").length == 0) {
            alert("No more text-box to remove");
            return false;
        }
        $("#input-group-prepend" + ".input-group-prepend:last").remove();
        $(".removeMe" + ":last").remove();
    });
});
