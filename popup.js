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
  var lat_arr = [];
  var lng_arr = [];
  var req1;
  var req2;
  var req3;
  var req4;
  var matchedzipcode;
  var matchedlat;
  var matchedlng;

  req1000=new XMLHttpRequest();

  req1000.open("GET", 'http://api.geonames.org/postalCodeSearchJSON?' +
        'placename=' + encodeURIComponent(query) + '&' +
        'maxRows=10&' +
        'username=ms_test201302', false);
  req1000.send(null);
  //req1000.onload = function () {
  var data1 = JSON.parse(req1000.responseText);
  // Find first postal code that matches
  matchedzipcode = data1.postalCodes[0].postalCode;
  matchedlat = data1.postalCodes[0].lat;
  matchedlng = data1.postalCodes[0].lng;


  //Req 2 - next request
  req2000=new XMLHttpRequest(); 
  req2000.open("GET", 'http://api.geonames.org/findNearbyPlaceNameJSON?' +
    'lat=' + encodeURIComponent(matchedlat) + '&' + 
    'lng=' + encodeURIComponent(matchedlng) + '&' +
    'country=US&' +
    'maxRows=10&' +
    'radius=30&' +
    'username=ms_test201302', false);
  req2000.send(null);
  //req2000.onload = function () {};

  var data2 = JSON.parse(req2000.responseText);
  //put all of the nearby zips together into a string
  lat_arr[0] = matchedlat;
  lng_arr[0] = matchedlng;
  for(var i  = 1 ; i< data2.geonames.length; i++) {
    lat_arr[i] = data2.geonames[i].lat;
    lng_arr[i] = data2.geonames[i].lng;
  }

    // For loop through the zip_arr to find the warmest temperature by 
    // using the 7-day forecast call + City info call in WeatherBug API


      index = 0;
    
    //for(var index = 0; index<2*zip_arr.length; index = index + 2) {
      setTimeout(function() { 
        //Req 3 - next request
        index = 0;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 5000 + 5000*index);

      setTimeout(function() { 
        //Req 3 - next request
        index = 2;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 8000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 4;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 16000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 6;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 24000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 8;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 32000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 10;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 40000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 12;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 48000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 14;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 56000);

      setTimeout(function() { 
        //Req 3 - next request
        index = 16;
        window["req"+index.toString()]=new XMLHttpRequest();
        window["req"+index.toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetForecast.ashx?' +
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + '&nf=7&ih=1&ht=t&ht=i&l=en&c=US&' +
          'api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
         //window["req"+index.toString()].onload = function () {};
        window["req"+index.toString()].send(null);
        var seven_day_forecast = JSON.parse(window["req"+index.toString()].responseText);
        // find a maximum temperature in the 7 day forecast.
        var max = 0;
        var daytitle = null;
        for (var k = 0; k < seven_day_forecast.forecastList.length; k++) {
         if(seven_day_forecast.forecastList[k].high > max) {
          max = seven_day_forecast.forecastList[k].high;
          daytitle = seven_day_forecast.forecastList[k].dayTitle;
          }
        }

        

        
          // Req 4 - request for city information.
          window["req"+(index+1).toString()]=new XMLHttpRequest();
          window["req"+(index+1).toString()].open("GET", 'http://i.wxbug.net/REST/Direct/GetLocation.ashx?' + 
          'la=' + encodeURIComponent(lat_arr[index/2]) + '&' +
          'lo=' + encodeURIComponent(lng_arr[index/2]) + 
          '&api_key=pd7k857xcvvgszap8ajkhdnu' + 
          '&callback=?', false);
        //window["req"+(index+1).toString()].onload = function () {
          window["req"+(index+1).toString()].send(null);
          var loc_data = JSON.parse(window["req"+(index+1).toString()].responseText);
          var div = document.createElement('div');
          var div2 = document.createElement('div');
          var div3 = document.createElement('div');
          var div4 = document.createElement('div');
          div2.innerHTML = "Location: " + loc_data.location.city ;
          div3.innerHTML = "Day of the Week: " + daytitle;
          div4.innerHTML = "Temperature: " + max.toString();
          div.appendChild(div2);
          div.appendChild(div3);
          div.appendChild(div4);
          document.body.appendChild(div);
        }, 64000);
        
    //}



  
}; 



