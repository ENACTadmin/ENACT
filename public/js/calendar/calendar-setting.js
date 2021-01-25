(function () {
    'use strict';
    // ------------------------------------------------------- //
    // Calendar
    // ------------------------------------------------------ //
    jQuery(function () {
        let eventsInfo = null
        // page is ready
        $.ajax({
            type: 'GET',
            url: '/events/all',
            async: false,
            dataType: 'json',
            success: function (data) {
                eventsInfo = data
            }
        });
        jQuery('#calendar').fullCalendar({
            themeSystem: 'bootstrap4',
            // emphasizes business hours
            businessHours: false,
            defaultView: 'month',
            // event dragging & resizing
            editable: false,
            selectable: true,
            // header
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay',
                right: 'today prev,next'
            },
            events: eventsInfo,
            dayClick: function () {
                jQuery('#modal-view-event-add').modal();
            },
            eventClick: function (event, jsEvent, view) {
                jQuery('.event-icon').html("<i class='fa fa-" + event.icon + "'></i>");
                jQuery('.event-title').html(event.title);
                jQuery('.event-body').html(event.description + "<br>" + "<b>Starts at: </b>" + new Date(event.start) + "<br>" + "<b>Ends at: </b>" + new Date(event.end));
                jQuery('#eventUrl').attr('href', event.uri);
                jQuery('#modal-view-event').modal();
            },
        })
    });
})(jQuery);