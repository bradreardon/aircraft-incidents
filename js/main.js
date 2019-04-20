    // // Create array of objects summing up weather vs phase of flight
    // var incidentsWeatherPhase = d3.nest()
    //     .key(function(d) { return d.Broad_Phase_of_Flight; })
    //     .key(function(d) { return d.Weather_Condition; })
    //     .rollup(function(v) { return v.length; })
    //     .entries(incident_data);

    // incidentsWeatherPhase = incidentsWeatherPhase.filter(function(d) {
    //     return d.key != '' && d.key != 'UNKNOWN';
    // });

    // for (var i = 0; i < incidentsWeatherPhase.length; ++i) {
    //     incidentsWeatherPhase[i].values = incidentsWeatherPhase[i].values.filter(
    //         function(d) {
    //             return d.key != '' && d.key != 'UNK';
    //         });
    // }

    // console.log('weather/phase', incidentsWeatherPhase);

