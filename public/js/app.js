$(document).ready(function () {

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px',
    //autocomplete_url:'fake_json_endpoint.html'
  });

/*  $('#datedebut, #datefin').datepicker({
    format: "d/m/yyyy",
    language: "en",
    autoclose: true,
    todayHighlight: true

  });*/


/*  var $container = $('#isotope-container');
      /!*$checkboxes = $('#filters input');*!/

  $container.isotope({
    itemSelector: '.item'
  });
  // get Isotope instance
  var isotope = $container.data('isotope');
  // add even classes to every other visible item, in current order
/!*  function addEvenClasses() {
    isotope.$filteredAtoms.each( function( i, elem ) {
      $(elem)[ ( i % 2 ? 'addClass' : 'removeClass' ) ]('even')
    });
  }*!/

  $("ul.filter li a").click(function(e){
    e.preventDefault();
    $("ul.filter li").removeClass('active');
    $(this).parent().addClass("active");
    var filtersXX = $(this).attr('data-filter');
    // get checked checkboxes values
    /!*$checkboxes.filter(':checked').each(function(){
      filters.push( this.value );
    });*!/
    console.log($(this).attr('data-filter'));
    // ['.red', '.blue'] -> '.red, .blue'
    //filters = $(this).attr('data-filter'); //filters.join(', ');
    $container.isotope({ filter: filtersXX });
    /!*addEvenClasses();*!/
  });*/



  // external js: isotope.pkgd.js


    // init Isotope
    var $container = $('#isotope-container').isotope({
      itemSelector: '.item'
    });


    // bind filter button click
  $("ul.filter li a").click(function(e){
      e.preventDefault();
      $("ul.filter li").removeClass('active');
      $(this).parent().addClass("active");
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue =  filterValue;
      console.log (filterValue);
      $container.isotope({ filter: filterValue });
    });






});
