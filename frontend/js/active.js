// Saber si un elemento se encuentra activo
var activeContainer = document.getElementByClass("active-container");

// Get all buttons with class="btn" inside the container
var objs = activeContainer.getElementsByClassName("btn");
// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < objs.length; i++) {
    objs[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");

        // Si no hay cun objeto con clase active
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " active";
    });
}