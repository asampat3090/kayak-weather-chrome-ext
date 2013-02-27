 // add jQuery
//var script = document.createElement('script');
//script.src = 'http://jqueryjs.googlecode.com/files/jquery-1.2.6.min.js';
//script.type = 'text/javascript';
//document.getElementsByTagName('head')[0].appendChild(script);

var query;

document.forms[0].onsubmit = function(e) {
  e.preventDefault(); // Prevent submission
  query = document.getElementById('place').value;
  //getZipFromCity_: 
  var zip_agg;
  var req1;
  var req2;
  var req3;
  var matchedzipcode;
  


  req1=new XMLHttpRequest();

  req1.open("GET", 'http://api.geonames.org/postalCodeSearchJSON?' +
        'placename=' + encodeURIComponent(query) + '&' +
        'maxRows=10&' +
        'username=ms_test201302', true);
  req1.onload = function () {
    var data1 = JSON.parse(req1.responseText);
    // Find first postal code that matches
    matchedzipcode = data1.postalCodes[0].postalCode;


    //Req 2 - next request
    req2=new XMLHttpRequest(); 
    req2.open("GET", 'http://api.geonames.org/findNearbyPostalCodesJSON?' +
        'postalcode=' + encodeURIComponent(matchedzipcode) + '&' + 
        'country=US&' +
        'maxRows=10&' +
        'radius=30&' +
        'username=ms_test201302', true);
    req2.onload = function () {
      var data2 = JSON.parse(req2.responseText);
      //put all of the nearby zips together into a string
      zip_agg = matchedzipcode;
      for(var i  = 1 ; i< data2.postalCodes.length; i++) {
          zip_agg = zip_agg + ',' + data2.postalCodes[i].postalCode;
      }

      //Req 3 - next request
      req3=new XMLHttpRequest();
      req3.open("GET", 'http://i.wxbug.net/REST/Direct/GetObs.ashx?' +
        'zip=' + encodeURIComponent(zip_agg) + '&ic=1&' +
        'api_key=pd7k857xcvvgszap8ajkhdnu', true);
      req3.onload = function () {
        var weatherlocations = JSON.parse(req3.responseText);
        for (var i = 0; i < weatherlocations.length; i++) {
          var div = document.createElement('div');
          div.innerHTML = "Location: " + weatherlocations[i].stationName + 
          "Temperature: " + weatherlocations[i].temperature.toString();
          //img.src = this.constructKittenURL_(kittens[i]);
          //img.setAttribute('alt', kittens[i].getAttribute('title'));
          document.body.appendChild(div);
        }


      };
      req3.send(null);
    };
    req2.send(null);
  };
  req1.send(null);

  
  

  // getNearbyZipCodes_:;

  

  //getFromWeatherAPI_: ;

  
}; 



