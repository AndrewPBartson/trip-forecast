var headerHeight = $('.header--page').height() + $('.header--view').height();

$('.content--main .col-scrollable').on('scroll', function(e){
  var scrollLeft = $(this).scrollLeft();
  var scrollTop = $(this).scrollTop();
  var getMarginTop = function( scrollTop ){
    if( scrollTop >= headerHeight){
      return headerHeight;
    }
    else{
      return scrollTop;
    }
  };

  var marginTop = getMarginTop( scrollTop );

  $('.header--table .col-scrollable').scrollLeft(scrollLeft);
  $('.content--main .col-sticky').scrollTop(scrollTop);


  $('.header--page').css( {
    'margin-top' : -marginTop + 'px'
  });

  $(this).add('.content--main .col-sticky').css({
    'padding-top' : marginTop + 'px'
 });

});

$('.js-collapserows').on('click', function(){
  $('.wrapper--page .is-collapsible').toggleClass('is-collapsed');
})
