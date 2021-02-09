$(document).ready(function () {
    // Delete modal
    $(".focusMe").click(function () {
        let id = this.id
        if ($('#' + id).html().trim() === $('#findMe').html("&#9825;").text()) {
            $.ajax({
                type: 'POST',
                url: '/resource/star/' + this.id,
                async: true,
                dataType: 'text',
                success: function () {
                    $('#' + id).html('&#9829;');
                }
            })
        } else {
            $.ajax({
                type: 'POST',
                url: '/resource/unstar/' + this.id,
                async: true,
                dataType: 'text',
                success: function () {
                    $('#' + id).html('&#9825;');
                }
            })
        }
    })
})