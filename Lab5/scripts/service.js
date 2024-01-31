// Function to verify that the phone number is correct.
// (999) 999-9999
// Tutorials on Regular expressions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
// https://flaviocopes.com/javascript-regular-expressions/
// Regular expressions can get complex, you can think in terms of a series of characters
// or numbers
function validatePhone(txtPhone) {
    var a = document.getElementById(txtPhone).value;
    // This filter asks for something like (123) 999-9999, so parentheses with any number (at least 1)
    // of digits
    var filter = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
    if (filter.test(a)) {
        return true;
    }
    else {
        return false;
    }
}

// Function to verify that the credit card number is correct.
// 9999 9999 9999 9999
// Tutorials on Regular expressions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
// https://flaviocopes.com/javascript-regular-expressions/
// Regular expressions can get complex, you can think in terms of a series of characters
// or numbers
function validateCreditCard(txtCreditCard) {
    var a = document.getElementById(txtCreditCard).value;
    // This filter asks for something like 9999 9999 9999 9999, so parentheses with any number (at least 1)
    // of digits
    var filter = /([0-9]{16})|([0-9]{4}\s+[0-9]{4}\s+[0-9]{4}\s+[0-9]{4})/;
    if (filter.test(a)) {
        return true;
    }
    else {
        return false;
    }
}


// Using date restrictions on datepicker
// Document of datepicker is here: https://api.jqueryui.com/datepicker/
// The following code shows how to set specific dates to exclude, as well as Sundays (Day 0)
// Make sure in your version that you associate Days to remove with Experts (e.g. John doesn't work Mondays)
var unavailableDates = ["06/29/2020","07/07/2020","07/10/2020"];
const setDateFormat = "mm/dd/yy";

function disableDates(date) {
    // Sunday is Day 0, disable all Sundays
    if (date.getDay() === 0)
        return [false];
    var string = jQuery.datepicker.formatDate(setDateFormat, date);
    return [ unavailableDates.indexOf(string) === -1 ]
}

function disableDatesFaten(date) {
    // Sunday is Day 0, disable all Sundays
    
    if (date.getDay() === 6)
        return [false];
    if (date.getDay() === 3)
        return [false];
    var string = jQuery.datepicker.formatDate(setDateFormat, date);
    return [ unavailableDates.indexOf(string) === -1 ]
}


// HERE, JQuery "LISTENING" starts
$(document).ready(function(){

    // phone validation, it calls validatePhone
    // and also some feedback as an Alert + putting a value in the input that shows the format required
    // the "addClass" will use the class "error" defined in style.css and add it to the phone input
    // The "error" class in style.css defines yellow background and red foreground
    $("#phone").on("change", function(){
        if (!validatePhone("phone")){
            alert("Make sure the format looks like this: (999) 999-9999");
            $("#phone").val("");
            $("#phone").addClass("error");
        }
        else {
            $("#phone").removeClass("error");
        }
    });

    // credit card validation, it calls validateCreditCard
    // and also some feedback as an Alert + putting a value in the input that shows the format required
    // the "addClass" will use the class "error" defined in style.css and add it to the phone input
    // The "error" class in style.css defines yellow background and red foreground
    $("#creditCard").on("change", function(){
        if (!validateCreditCard("creditCard")){
            alert("Make sure the format looks like this: 9999 9999 9999 9999");
            $("#creditCard").val("");
            $("#creditCard").addClass("error");
        }
        else {
            $("#creditCard").removeClass("error");
        }
    });


    $("#faten").on("change", function(){
        $( "#dateInput" ).datepicker('option',{
            beforeShowDay: function(date) {
                var day = date.getDay();
                return [(day != 0 && day != 6 && day != 3),  ''];
            }
        });
    });

    $("#saleh").on("change", function(){
        $( "#dateInput" ).datepicker('option',{
            beforeShowDay: function(date) {
                var day = date.getDay();
                return [(day != 0 && day != 5),  ''];
            }
        });
    });

    // To change the style of the calender, look in jqueryui.com, under Themes, in the ThemeRoller Gallery
    // You can try different themes (the names are under the calendars) / This is Excite Bike
    // To use a different theme you must include its css in your HTML file.
    // The one I included in my HTML is the Excite Bike, but you can try others

    // Also, here is a good tutorial for playing with the datepicker in https://webkul.com/blog/jquery-datepicker/
    // Datepicker is also documented as one of the widgets here: https://api.jqueryui.com/category/widgets/
   $( "#dateInput" ).datepicker(
        {
            beforeShowDay: function(date) {
                var day = date.getDay();
                return [(day != 0 && day != 1 && day != 2 && day != 3 && day != 4 && day != 5 && day != 6),  ''];
            }
        }
    );


    // Look at the different events on which an action can be performed
    // https://www.w3schools.com/jquery/jquery_events.asp
    // Here, we put
    $("#debit").on("mouseenter", function(){
        $("#debit").addClass("showInput");
    });

    $("#debit").on("mouseleave", function(){
        $("#debit").removeClass("showInput");
    });

    // https://jqueryui.com/tooltip/
    // The class "highlight" used here is predefined in JQuery UI
    // the message of the tooltip is encoded in the input (in the HTML file)
    $("#debit").tooltip({
        classes: {
            "ui-tooltip": "highlight"
        }
    });

    $("#bookApp").on("click", function(){
        confirm("Great! We have booked your requested appointment!");
    });

});