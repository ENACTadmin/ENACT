var width = 100,
    perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = ((EstimatedTime / 1000) % 60) * 60;

// Percentage Increment Animation
var PercentageID = $("#percent1"),
    start = 0,
    end = 100;
animateValue(PercentageID, start, end, time);

function animateValue(id, start, end, duration) {

    var range = end - start,
        current = start,
        increment = end > start ? 1 : -1,
        stepTime = Math.abs(Math.floor(duration / range)),
        obj = $(id);

    var timer = setInterval(function () {
        current += increment;
        $(obj).text(current + "%");
        $("#bar1").css('width', current + "%");
        //obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Fading Out Loadbar on Finised
setTimeout(function () {
    $('.pre-loader').fadeOut(200);
}, time);