let table = $('#result')

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("you are in -->", position.coords.latitude, position.coords.longitude)
    
        $.ajax({
            url: "pollution.php",
            type: 'post',
            dataType: 'json',
            data: {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            },      
            success: function(result) {
                
                let components = result.pollutionData.list[0].components
                let res = ''
                res = `<tr><th>Pollutant</th><th>Measure</th></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Carbon_monoxide" target="blank">Carbon Monoxide (CO)</a>: </td><td>  ${components['co']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Ammonia" target="blank">Amonia (NH3)</a>: </td><td>  ${components['nh3']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Nitric_oxide" target="blank">Nitrogen Monoxide (NO)</a>: </td><td>  ${components['no']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Nitrogen_dioxide" target="blank">Nitrogen Dioxide (NO2)</a>: </td><td>  ${components['no2']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Ozone" target="blank">Ozone (O3)</a>: </td><td>  ${components['o3']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Particulates#Size,_shape_and_solubility_matter" target="blank">Particles < 2.5mm</a>: </td><td>  ${components['pm2_5']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Particulates#Size,_shape_and_solubility_matter" target="blank">Particles < 10mm</a>: </td><td>  ${components['pm10']} μg/m<sup>3</sup> </td></tr>
                         <tr><td><a href="https://en.wikipedia.org/wiki/Sulfur_dioxide" target="blank">Sulfur Dioxide (SO2)</a>: </td><td>  ${components['so2']} μg/m<sup>3</sup> </td></tr>`

                table.append(res)
                
                document.getElementById("position").innerHTML = `<p><strong>Your position </strong>--> Lat: <strong> ${result.pollutionData.coord['lat']} </strong> , Lon: <strong>  ${result.pollutionData.coord['lon']} </strong> </p><br><br>`

                console.log('pollution PHP',result);
                

            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });         
    
    });
    
  } else {
    console.log("la geolocalización no está disponible")
  }