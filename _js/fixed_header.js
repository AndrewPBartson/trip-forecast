var header = document.getElementById("jj_header");

document.onscroll = function(){
  // firefox uses documentElement instead of body
  var top = document.body.scrollTop || document.documentElement.scrollTop;
  header.className = (top > 1) ? 'sticky' : '';
};
