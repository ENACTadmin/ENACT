$(document).ready(function () {
    let id_set = $('#idSet').text()
    if (id_set.length !== 0) {
        let id_set_array = id_set.split(',')
        for (let i = 0; i < id_set_array.length; i++) {
            $("#addButton" + id_set_array[i]).click(function () {
                $("#form-horizontal" + id_set_array[i]).append('<br class="removeMe' + id_set_array[i] + '">' +
                    '<div class="input-group-prepend" id="input-group-prepend' + id_set_array[i] + '">' +
                    '<span class="input-group-text" style="width: 180px">Name</span>' +
                    '<input class="form-control" type="text" name="authorName" style="margin: 0 20px 0 0">' +
                    '<span class="input-group-text" style="width: 180px">Email</span>' +
                    '<input class="form-control" type="text" name="authorEmail" style="margin: 0 20px 0 0">' +
                    '</div>');
            });
            $("#removeButton" + id_set_array[i]).click(function () {
                console.log($("#input-group-prepend" + id_set_array[i] + ".input-group-prepend").length)
                if ($("#input-group-prepend" + id_set_array[i] + ".input-group-prepend").length == 0) {
                    alert("No more text-box to remove");
                    return false;
                }
                $("#input-group-prepend" + id_set_array[i] + ".input-group-prepend:last").remove();
                $(".removeMe" + id_set_array[i] + ":last").remove();
            });
        }
    }
});
