

// Check in === current day, check out === the next day for booking default
let today = new Date();

year = today.getFullYear();
month = today.getMonth() + 1;
day = today.getDate();

current = String(year) + '-' + String(month) + '-' + String(day);
next = String(year) + '-' + String(month) + '-' + String(day+1);

$('#check-in').val(current);
$('#check-out').val(next);


// Scroll to top button
var mybutton = document.getElementById("scrolltop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

$('#scrolltop').click(function(){
    $('html, body').animate({scrollTop:0}, 'slow');
});
