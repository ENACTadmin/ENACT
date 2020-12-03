(function() {
    var counter = 0;
    var btn = document.getElementById('addBtn');
    var form = document.getElementById('form');
    var addInput = function() {
        counter++;
        var span = document.createElement("span")
            // <span class='input-group-text' style='width: 180px'>Name</span>
        span.class = 'input-group-text'
        span.style.width = '180px'
        span.text = 'Name'
        form.appendChild(span);

        var input = document.createElement("input");
        input.id = 'authorName-' + counter;
        input.class = 'form-control'
        input.type = 'text';
        input.name = 'name';
        input.placeholder = 'Input number ' + counter;
        form.appendChild(input);
    };
    btn.addEventListener('click', function() {
        addInput();
    }.bind(this));
})();