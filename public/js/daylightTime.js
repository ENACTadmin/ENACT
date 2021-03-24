$(document).ready(function () {
    Date.prototype.stdTimezoneOffset = function () {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    Date.prototype.isDstObserved = function () {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }

    var today = new Date();
    if (today.isDstObserved()) {
        $(".DST").each(function () {
            $(this).val(1)
        })
    } else {
        $(".DST").each(function () {
            $(this).val(0)
        })
    }
})