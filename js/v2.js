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
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(
            d3.zoom()
                .translateExtent([[0,0], [width, height]])
                .scaleExtent([1, 12])
                .extent([[0, 0], [width, height]])
                .on('zoom', zoom)
        );

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
              .range([0, width]);
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

    // zoom box
    svg.append('rect')
        .attr('class', 'zoom-panel')
        .attr('width', width)
        .attr('height', height)

    // append the bar rectangles to the svg element
    var bars = svg.append('g')
        .attr('clip-path', 'url(#v2-clip-path)')
        .selectAll("rect")
        .data(bins)
        .enter().append("rect")
            .attr("class", "bar")
            // .attr("x", 1)
            .attr("x", function(d) { return x(d.x0); })
            .attr("y", function(d) { return y(d.length); })
            .attr("fill", "steelblue")
            .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
            .attr("height", function(d) { return height - y(d.length); });

    var defs = svg.append('defs');

    // use clipPath
    defs.append('clipPath')
        .attr('id', 'v2-clip-path')
        .append('rect')
        .attr('width', width)
        .attr('height', height)


    // add the x Axis
    var xAxis = svg.append("g")
        .attr('class', 'xAxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    let hideTicksWithoutLabel = function() {
      d3.selectAll('.xAxis .tick text').each(function(d){
        if(this.innerHTML === '') {
          this.parentNode.style.display = 'none'
        }
      })
    }

    function zoom() {
      if (d3.event.transform.k < 1) {
        d3.event.transform.k = 1
        return
      }

      xAxis.call(
        d3.axisBottom(d3.event.transform.rescaleX(x))
      )

      hideTicksWithoutLabel()

      // the bars transform
      bars.attr("transform", "translate(" + d3.event.transform.x + ",0)scale(" + d3.event.transform.k + ",1)")
    }

});