$(document).ready(function () {
    let id_set = $('#idSet').text()
    if (id_set.length !== 0) {
        let id_set_array = id_set.split(',')
        for (let i = 0; i < id_set_array.length; i++) {
            let realType = $('#typeFromServer' + id_set_array[i]).text()
            realType = realType.substring(1, realType.length - 1)
            $('#typeSelect' + id_set_array[i] + ' option').each(function () {
                if ($(this).val() === realType) {
                    $(this).prop('selected', true)
                }
            })
            let state = $('#stateFromServer' + id_set_array[i]).text()
            state = state.substring(1, state.length - 1)
            $('#stateSelect' + id_set_array[i] + ' option').each(function () {
                if ($(this).val() === state) {
                    $(this).prop('selected', true)
                }
            })
            let status = $('#statusFromServer' + id_set_array[i]).text()
            status = status.substring(1, status.length - 1)
            $('#statusSelect' + id_set_array[i] + ' option').each(function () {
                if ($(this).val() === status) {
                    $(this).prop('selected', true)
                }
            })
            let tags = $('#tagsFromServer' + id_set_array[i]).text()
            tags = tags.substring(1, tags.length - 1)
            let tagsArray = tags.split(',')
            $(':checkbox').filter('#' + id_set_array[i]).each(function () {
                if (tagsArray.includes($(this).val())) {
                    $(this).prop('checked', true)
                }
            })
            let checkboxes = $(':checkbox').filter('#' + id_set_array[i]);
            checkboxes.on('change', function () {
                let string = checkboxes.filter(':checked').map(function () {
                    return this.value;
                }).get().join(',');
                console.log('string is now: ', string)
                $('#tagsToReturn' + id_set_array[i]).val(string);
            });
        }
    }
})