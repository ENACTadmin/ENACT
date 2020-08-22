// jQuery(document).ready(function () {
//     jQuery("#add-event").submit(function () {
//         let values = {};
//         $.each($('#add-event').serializeArray(), function (i, field) {
//             values[field.name] = field.value;
//         });
//         console.log(
//             values
//         );
//     });
// });

(function () {
    'use strict';
    // ------------------------------------------------------- //
    // Calendar
    // ------------------------------------------------------ //
    jQuery(function () {
        let eventsInfo
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
            // header
            header: {
                left: 'title',
                center: 'month,agendaWeek,agendaDay',
                right: 'today prev,next'
            },
            // events: [
            //     {
            //         title: 'Dentist',
            //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu pellentesque nibh. In nisl nulla, convallis ac nulla eget, pellentesque pellentesque magna.',
            //         start: '2020-12-29T11:30:00',
            //         end: '2020-12-29T012:30:00',
            //         className: 'fc-bg-blue',
            //         icon: "medkit",
            //         allDay: false
            //     }
            // ],
            events: eventsInfo,
            dayClick: function () {
                jQuery('#modal-view-event-add').modal();
            },
            eventClick: function (event, jsEvent, view) {
                let now = new Date();
                jQuery('.event-icon').html("<i class='fa fa-" + event.icon + "'></i>");
                jQuery('.event-title').html(event.title);
                jQuery('.event-body').html(event.description + "<br>" + "Starts at: " + new Date(event.start + (now.getTimezoneOffset() * 60000)) + "<br>" + "Ends at: " + new Date(event.end + (now.getTimezoneOffset() * 60000)));
                jQuery('#eventUrl').attr('href', event.uri);
                jQuery('#modal-view-event').modal();
            },
        })
    });
})(jQuery);