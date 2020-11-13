$(document).ready(function () {
    let text = $('#contentSelect option:selected').text();
    extracted(text)

    $("#contentSelect").on("change", function () {
        text = $('#contentSelect option:selected').text();
        extracted(text);
    })

    function extracted(text) {
        if (text === 'Assignment/Grading Rubric Guidelines') {
            $(".toShowAll").hide()
            $(".toShow-AG").show()
        } else if (text === 'Advocacy Video') {
            $(".toShowAll").hide()
            $(".toShow-AV").show()
        } else if (text === 'Campaign Journal/Personal Reflections') {
            $(".toShowAll").hide()
            $(".toShow-CJ").show()
        } else if (text === 'Course Reading') {
            $(".toShowAll").hide()
            $(".toShow-CR").show()
        } else if (text === 'Elevator Speech') {
            $(".toShowAll").hide()
            $(".toShow-ES").show()
        } else if (text === 'Course Planning') {
            $(".toShowAll").hide()
            $(".toShow-CP").show()
        } else if (text === 'Fact Sheet/Storybook') {
            $(".toShowAll").hide()
            $(".toShow-FS").show()
        } else if (text === 'Next Steps') {
            $(".toShowAll").hide()
            $(".toShow-NS").show()
        } else if (text === 'Op-Ed') {
            $(".toShowAll").hide()
            $(".toShow-OE").show()
        } else if (text === 'Essays about ENACT') {
            $(".toShowAll").hide()
            $(".toShow-PR").show()
        } else if (text === 'Portfolio') {
            $(".toShowAll").hide()
            $(".toShow-Po").show()
        } else if (text === 'Presentations') {
            $(".toShowAll").hide()
            $(".toShow-Pr").show()
        } else if (text === 'Script for meeting with Ways and Means Staff') {
            $(".toShowAll").hide()
            $(".toShow-SS").show()
        } else if (text === 'Syllabus') {
            $(".toShowAll").hide()
            $(".toShow-Sy").show()
        } else if (text === 'Testimony') {
            $(".toShowAll").hide()
            $(".toShow-Te").show()
        } else {
            $(".toShowAll").hide()
        }
    }
})