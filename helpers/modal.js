$(document).ready(function () {

  $("a[data-modalable]").on('click', function(e){
    e.preventDefault();
      console.log($(e.target));
  });

});
