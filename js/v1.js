d3.csv("aircraft_incidents.csv", function(incident_data) {
    var aircraftData = d3.nest()
        .key(function(d) { return d.Make + ' ' + d.Model; })
        .rollup(function(v) {
            return {
                incidents: v.length,
                fatalities: d3.sum(v, function(d) { return d.Total_Fatal_Injuries; }),
                destroyed: v.filter(function(d) { return d.Aircraft_Damage == 'Destroyed'; }).length
            };
        })
        .entries(incident_data);

    aircraftDataTop = aircraftData.sort(function (a, b) {
        return d3.descending(a.value.incidents, b.value.incidents);
    }).slice(0, 20) // select top 20 for chart 1

    aircraftDataTopDestroyed = aircraftData.sort(function (a, b) {
        return d3.descending(a.value.destroyed, b.value.destroyed);
    }).slice(0, 20) // select top 20 destroyed aircraft for chart 1


    // set margins & dimensions for both charts
    var margin = {
        top: 85,
        right: 50,
        bottom: 15,
        left: 140
    };

    var width = 550 - margin.left - margin.right,
        height = 570 - margin.top - margin.bottom;

    // create first chart for incidents

    var svg = d3.select("#v1").append("svg")
        .attr("id", "v1c1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("class", "title")
        .style("text-anchor", "middle")
        .attr("y", -margin.top / 2 + 8)  // above chart
        .attr("x", width / 2)
        .text("Number of Recorded Incidents");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(aircraftDataTop, function (d) {
            return d.value.incidents;
        })]);

    var y = d3.scaleBand()
        .rangeRound([0, height], .1)
        .padding(.2)
        .domain(aircraftDataTop.map(function (d) {
            return d.key;
        }));

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSizeInner(5)
        .tickSizeOuter(0);

    var colorScale = d3.scaleSequential(d3.interpolateBlues).domain([aircraftDataTop.length * 2, 0]);

    // create a tooltip
    var Tooltip = d3.select("#wrapper")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1);

        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    }

    var mousemove = function(d) {
        Tooltip
            .html("<strong>" + d.key + "</strong><br/>" +
                  "<strong>Incidents:</strong> " + d.value.incidents + "<br/>" +
                  "<strong>Destroyed Aircraft:</strong> " + d.value.destroyed + "<br/>" +
                  "<strong>Total Fatalities:</strong> " + d.value.fatalities + "<br/>")
            .style("left", (d3.event.pageX + 70) + "px")
            .style("top", (d3.event.pageY) + "px")
    }

    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0);

        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    }

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(aircraftDataTop)
        .enter()
        .append("g")

    // bars
    bars.append("rect")
        .attr("class", "bar")
        .style("fill", function(d, i) { return colorScale(i); })
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.bandwidth())
        .attr("x", 1)
        .attr("width", function (d) {
            return x(d.value.incidents);
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // value labels
    bars.append("text")
        .attr("class", "label")
        .attr("y", function (d) {
            return y(d.key) + y.bandwidth() / 2 + 4;
        })
        .attr("x", function (d) {
            return x(d.value.incidents) + 5;
        })
        .text(function (d) {
            return d.value.incidents;
        });


    // second chart: destroyed aircraft


    var svg = d3.select("#v1").append("svg")
        .attr("id", "v1c2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("class", "title")
        .style("text-anchor", "middle")
        .attr("y", -margin.top / 2 + 8)  // above chart
        .attr("x", width / 2)
        .text("Number of Aircraft Destroyed");

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(aircraftDataTopDestroyed, function (d) {
            return d.value.destroyed;
        })]);

    var y = d3.scaleBand()
        .rangeRound([0, height], .1)
        .padding(.2)
        .domain(aircraftDataTopDestroyed.map(function (d) {
            return d.key;
        }));

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSizeInner(5)
        .tickSizeOuter(0);

    var colorScale = d3.scaleSequential(d3.interpolateReds).domain([aircraftDataTopDestroyed.length * 2, 0]);

    // create a tooltip
    var Tooltip = d3.select("#wrapper")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
        Tooltip
            .style("opacity", 1);

        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    }

    var mousemove = function(d) {
        Tooltip
            .html("<strong>" + d.key + "</strong><br/>" +
                  "<strong>Incidents:</strong> " + d.value.incidents + "<br/>" +
                  "<strong>Destroyed Aircraft:</strong> " + d.value.destroyed + "<br/>" +
                  "<strong>Total Fatalities:</strong> " + d.value.fatalities + "<br/>")
            .style("left", (d3.event.pageX + 70) + "px")
            .style("top", (d3.event.pageY) + "px")
    }

    var mouseleave = function(d) {
        Tooltip
            .style("opacity", 0);

        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    }

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var bars = svg.selectAll(".bar")
        .data(aircraftDataTopDestroyed)
        .enter()
        .append("g")

    // bars
    bars.append("rect")
        .attr("class", "bar")
        .style("fill", function(d, i) { return colorScale(i); })
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.bandwidth())
        .attr("x", 1)
        .attr("width", function (d) {
            return x(d.value.destroyed);
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // value labels
    bars.append("text")
        .attr("class", "label")
        .attr("y", function (d) {
            return y(d.key) + y.bandwidth() / 2 + 4;
        })
        .attr("x", function (d) {
            return x(d.value.destroyed) + 5;
        })
        .text(function (d) {
            return d.value.destroyed;
        });
});
