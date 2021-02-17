$(document).ready(function () {
    // Delete modal
    $(".focusMe").click(function () {
        let id = this.id
        // alert($('#' + id).html().trim() === $('#findMe').html("&#9825;").text())
        if ($('#' + id).html().trim() === $('#findMe').html("&#9825;").text()) {
            $.ajax({
                type: 'POST',
                url: '/resource/starAlt/' + this.id,
                async: false,
                dataType: 'text',
                success: function () {
                    $('#' + id).html('&#9829;');
                }
            })
        } else {
            $.ajax({
                type: 'POST',
                url: '/resource/unstarAlt/' + this.id,
                async: false,
                dataType: 'text',
                success: function () {
                    $('#' + id).html('&#9825;');
                }
            })
        }
    })
})