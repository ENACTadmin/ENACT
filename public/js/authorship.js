$(document).ready(function () {
    $("#addButton").click(function () {
        // var id = ($('.form-horizontal .input-group-prepend').length + 1).toString();
        $('.form-horizontal').append('<br class="removeMe">' +
            '<div class="input-group-prepend">' +
            '<span class="input-group-text" style="width: 180px">Name</span>' +
            '<input class="form-control" type="text" name="authorName" style="margin: 0 20px 0 0">' +
            '<span class="input-group-text" style="width: 180px">Email</span>' +
            '<input class="form-control" type="text" name="authorEmail" style="margin: 0 20px 0 0">' +
            '</div>');
    });
    $("#removeButton").click(function () {
        if ($('.form-horizontal .input-group-prepend').length == 1) {
            alert("No more text-box to remove");
            return false;
        }
        $(".form-horizontal .input-group-prepend:last").remove();
        $(".form-horizontal .removeMe:last").remove();
    });
});
