

// Check in === current day, check out === the next day
let today = new Date();

year = today.getFullYear();
month = today.getMonth() + 1;
day = today.getDate();

current = String(year) + '-' + String(month) + '-' + String(day);
next = String(year) + '-' + String(month) + '-' + String(day+1);

$('#check-in').val(current);
$('#check-out').val(next);
