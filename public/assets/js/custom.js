$(document).ready(function(){

    $('#srach-button').click(function(){
        $('.search-form').toggle();
    });
    $('.dropdown').on('show.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
      });
      // Add slideUp animation to Bootstrap dropdown when collapsing.
      $('.dropdown').on('hide.bs.dropdown', function() {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
      });
});


