$(document).ready(function () {
    let checkboxes = $(':checkbox');
    checkboxes.on('change', function () {
        let string = checkboxes.filter(':checked').map(function () {
            return this.value;
        }).get().join(',');
        $('#tagsToReturn').val(string);
    });
});