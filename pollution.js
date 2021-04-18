let table = $('#table')
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
                //for (let i = 0; i < result)
                let res = ''
                res += "Your coordinates: Lat:" + result.pollutionData.coord['lat'] + ", Lon: " + result.pollutionData.coord['lon']

                console.log(res)

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