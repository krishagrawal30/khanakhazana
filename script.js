// JavaScript for restaurant website
function clearScreen(){
    document.getElementById("result").value="";
}
function display(value){
    document.getElementById("result").value += value;
}
function calculate(){
    var p = document.getElementById("result").value;
    var q= eval(p);
    document.getElementById("result").value= q;
}
function show(){
    // Validate mobile number
    var mobile = document.getElementById('moblie').value;
    var email = document.getElementById('email').value;
    var mobileValid = /^\d{10}$/.test(mobile);
    var emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!mobileValid) {
        document.getElementById('cal').innerHTML = '<span style="color:red;">Please enter a valid 10-digit mobile number.</span>';
        return false;
    }
    if (!emailValid) {
        document.getElementById('cal').innerHTML = '<span style="color:red;">Please enter a valid email address.</span>';
        return false;
    }
    document.getElementById("cal").innerHTML='Your Order will be delivered soon to your Address. Pay the bill in cash after receiving.';
    return true;
}
// Smooth scroll for navigation
window.onload = function() {
    document.querySelectorAll('nav a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = link.getAttribute('href');
            if(href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({behavior: 'smooth'});
            }
        });
    });
}
