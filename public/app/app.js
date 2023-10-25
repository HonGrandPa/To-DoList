// //check if client has the input
// $("#row-btn").on("click", function(){


//     var $inputBox = $("#input-box");
//     var inputValue = $inputBox.val();
//     var span = $('<span></span>')
//     span.text("\u00d7")

//     if(inputValue.length === 0) {

//         alert("Please Enter Something:(")

//     } else {

//         //add to the list

//         var $newTask = $('<li class="task"><input class="checkbox" type="checkbox">' + inputValue + '</li>').append(span);

//         $(".task-list").append($newTask);

//         $("#input-box").val("");

//     }
// })

function deleteTask(taskId) {
    // Set the value of the hidden input field to the task ID
    document.querySelector(".selection").value = taskId;
    
    // Submit the form
    document.forms['formList'].submit();
  }

//drop the task
$(".task-list").on("click", function (e){

    if (e.target.tagName === "SPAN") {
        // Remove the parent <li> when a <span> is clicked
        // $("#formList").submit();

        $(e.target).parent().remove();
        
    }
});


//complete the task
$(document).on("click", function(e) {
    if ($(e.target).hasClass("checkbox")) {
        var $parent = $(e.target).parent(); // Get the parent element

        if ($parent.hasClass("complete")) {
            $parent.removeClass("complete"); // If it has the "complete" class, remove it
        } else {
            $parent.addClass("complete"); // If it doesn't have the "complete" class, add it
        }
    }
});





const w = ['Sun', 'Mon', 'Tue','Wed', 'Thu', 'Fri', 'Sat'];
const today = w[new Date().getDay()];

$("li").each(function() {


    if($(this).html() === today){
    
        $(this).addClass("today");

    }
    
});
