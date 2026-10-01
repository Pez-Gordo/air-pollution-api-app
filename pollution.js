const table = $('#result')
const positionElement = document.getElementById("position")

const showError = (message) => {
    table.empty()
    positionElement.textContent = message
}

if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(
        function(position) {

            $.ajax({
                url: "pollution.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                },

                success: function(result) {

                    const pollutionData = result?.pollutionData
                    const components = pollutionData?.list?.[0]?.components

                    if (!components || !pollutionData?.coord) {
                        showError("Unable to read air pollution data.")
                        return
                    }

                    const res = `
                        <tr><th>Pollutant</th><th>Measure</th></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Carbon_monoxide" target="_blank" rel="noopener noreferrer">Carbon Monoxide (CO)</a></td><td>${components.co} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Ammonia" target="_blank" rel="noopener noreferrer">Ammonia (NH3)</a></td><td>${components.nh3} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Nitric_oxide" target="_blank" rel="noopener noreferrer">Nitrogen Monoxide (NO)</a></td><td>${components.no} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Nitrogen_dioxide" target="_blank" rel="noopener noreferrer">Nitrogen Dioxide (NO2)</a></td><td>${components.no2} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Ozone" target="_blank" rel="noopener noreferrer">Ozone (O3)</a></td><td>${components.o3} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Particulates" target="_blank" rel="noopener noreferrer">Particles &lt; 2.5 μm</a></td><td>${components.pm2_5} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Particulates" target="_blank" rel="noopener noreferrer">Particles &lt; 10 μm</a></td><td>${components.pm10} μg/m<sup>3</sup></td></tr>
                        <tr><td><a href="https://en.wikipedia.org/wiki/Sulfur_dioxide" target="_blank" rel="noopener noreferrer">Sulfur Dioxide (SO2)</a></td><td>${components.so2} μg/m<sup>3</sup></td></tr>
                    `

                    table.html(res)

                    positionElement.innerHTML =
                        `<p><strong>Your position</strong> → Lat: <strong>${pollutionData.coord.lat}</strong>, Lon: <strong>${pollutionData.coord.lon}</strong></p>`
                },

                error: function(jqXHR) {
                    const message =
                        jqXHR.responseJSON?.status?.description ||
                        "Unable to retrieve air pollution data."

                    showError(message)
                }
            })
        },

        function(error) {
            if (error.code === error.PERMISSION_DENIED) {
                showError("Location permission was denied.")
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                showError("Your location is unavailable.")
            } else if (error.code === error.TIMEOUT) {
                showError("Location request timed out.")
            } else {
                showError("Unable to determine your location.")
            }
        },

        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000
        }
    )

} else {
    showError("Geolocation is not available in this browser.")
}
