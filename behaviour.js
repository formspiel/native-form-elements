
var arr = document.getElementsByClassname("js-add-style js-change-layout");

for (var k = 0; k < arr.length; k++)
    arr[k].addEventListener(yourListener);


//var el = document.querySelector('.js-add-style');

el.onclick = function () {
    el.classList.toggle('active');
}


//.js-add-style
//.js-change-layout