var parseDate = d3.timeParse('%-m/%-d/%y');

d3.csv("aircraft_incidents.csv", function(incident_data) {
    // set margins & dimensions for both charts
    var margin = {
        top: 85,
        right: 50,
        bottom: 50,
        left: 50
    };

    var width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //add a new svg to hold the chart
    var svg = d3.select("#v2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("class", "title")
        .style("text-anchor", "middle")
        .attr("y", -margin.top / 2 + 8)  // above chart
        .attr("x", width / 2)
        .text("Recorded Fatalities");
    
    incident_data = incident_data.map(function(d) {
        d.date = parseDate(d.Event_Date)
        return d;
    });

    // set the ranges
    var x = d3.scaleTime()
              .domain(d3.extent(incident_data, function(d) { return d.date; }))
              .rangeRound([0, width]);
    var y = d3.scaleLinear()
              .range([height, 0]);

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.date; })
        .domain(x.domain())
        .thresholds(x.ticks(d3.timeMonth));

    // group the data for the bars
    var bins = histogram(incident_data);

    // Scale the range of the data in the y domain
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return height - y(d.length); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});