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
                        <tr><td>Carbon Monoxide (CO)</td><td>${components.co} μg/m<sup>3</sup></td></tr>
                        <tr><td>Ammonia (NH3)</td><td>${components.nh3} μg/m<sup>3</sup></td></tr>
                        <tr><td>Nitrogen Monoxide (NO)</td><td>${components.no} μg/m<sup>3</sup></td></tr>
                        <tr><td>Nitrogen Dioxide (NO2)</td><td>${components.no2} μg/m<sup>3</sup></td></tr>
                        <tr><td>Ozone (O3)</td><td>${components.o3} μg/m<sup>3</sup></td></tr>
                        <tr><td>Particles &lt; 2.5 μm</td><td>${components.pm2_5} μg/m<sup>3</sup></td></tr>
                        <tr><td>Particles &lt; 10 μm</td><td>${components.pm10} μg/m<sup>3</sup></td></tr>
                        <tr><td>Sulfur Dioxide (SO2)</td><td>${components.so2} μg/m<sup>3</sup></td></tr>
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
