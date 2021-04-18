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
                res = `<tr><th>Your coordinates: </th><th> Lat:  ${result.pollutionData.coord['lat']}  , Lon:   ${result.pollutionData.coord['lon']}  </th></tr>
                         <tr><td>Carbon Monoxide (CO): </td><td>  ${components['co']}  </td></tr>
                         <tr><td>Amonia (NH3): </td><td>  ${components['nh3']}  </td></tr>
                         <tr><td>Nitric Oxide (NO): </td><td>  ${components['no']}  </td></tr>
                         <tr><td>Nitric Dioxide (NO2): </td><td>  ${components['no2']}  </td></tr>
                         <tr><td>Ozone (O3): </td><td>  ${components['o3']}  </td></tr>
                         <tr><td>Particles smaller than 2.5mm: </td><td>  ${components['pm2_5']}  </td></tr>
                         <tr><td>Particles smaller than 10mm: </td><td>  ${components['pm10']}  </td></tr>
                         <tr><td>Sulfur Dioxide: </td><td>  ${components['so2']}  </td></tr>`

                table.append(res)
                

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