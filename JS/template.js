/* SEARCH */
$(document).ready(function () {
  const searchData = [
    'Adana',
    'Ağrı',
    'Bursa',
    'Bitlis',
    'Denizli',
    'Diyarbakır',
    'Elazığ',
    'Hatay',
    'Sivas',
    'Malatya',
    'Van', 
    'Adana',
    'Ağrı',
    'Bursa',
    'Bitlis',
    'Denizli',
    'Diyarbakır',
    'Elazığ',
    'Hatay',
    'Sivas',
    'Malatya',
    'Van'
  ];

  $('#search_id').autocomplete({
    source: searchData,
  });
});

 /* Back to top icon */
$(document).ready(function () {
  // backtop id almak
  const backTop = $('#back_top_id');

  // scrollTop mesafesi 80 olduğunda gizle
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 200) {
      backTop.fadeIn(200);
    } else {
      backTop.fadeOut(200);
    }
  }); 
  // backtop id'ye tıklandığında sayfayı yukarı kaydır
  backTop.on("click", function(e){
    e. preventDefault();
    $('html').animate({ scrollTop:0},1000,"linear", function(){backTop.fadeOut(200)});
  })


});