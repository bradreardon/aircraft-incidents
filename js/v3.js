d3.csv("aircraft_incidents.csv", function(incident_data) {
    // set margins & dimensions for both charts
    var margin = {
        top: 85,
        right: 50,
        bottom: 50,
        left: 50
    };

    var width = 550 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var radius = (Math.min(width, height - 150)) / 2;
    var thickness = 40;

    var color = function (d) {
        if (d.data.key == 'TAKEOFF') {
            return d3.schemeCategory10[0];
        } else if (d.data.key == 'LANDING') {
            return d3.schemeCategory10[1];
        } else if (d.data.key == 'CLIMB') {
            return d3.schemeCategory10[2];
        } else if (d.data.key == 'DESCENT') {
            return d3.schemeCategory10[3];
        } else if (d.data.key == 'APPROACH') {
            return d3.schemeCategory10[4];
        } else {
            return d3.schemeCategory10[7]; // gray
        }
    };

    //add a new svg to hold the chart
    var svg = d3.select("#v3").append("svg")
        .attr("id", "v3c1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var labelG = svg.append('g');

    labelG.append('text')
        .style('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr("class", "fa")
        .attr('font-size', '100px')
        .attr('x', width / 2)
        .text(function(d) { return '\uf6c4'; });

    labelG.append('text')
        .style('text-anchor', 'middle')
        .style('text-transform', 'uppercase')
        .style('font-weight', 'bolder')
        .attr('font-size', '24pt')
        .attr('x', width / 2)
        .attr('y', 100)
        .text('VMC');

    // Create array of objects summing up weather vs phase of flight
    var vmcIncidents = d3.nest()
        .key(function(d) {
            if (d.Broad_Phase_of_Flight == 'TAKEOFF' || d.Broad_Phase_of_Flight == 'LANDING' || 
                d.Broad_Phase_of_Flight == 'APPROACH' || d.Broad_Phase_of_Flight == 'DESCENT' || d.Broad_Phase_of_Flight == 'CLIMB') {
                return d.Broad_Phase_of_Flight;
            } else {
                return 'OTHER';
            }
        })
        .rollup(function(v) { return v.length; })
        .entries(incident_data.filter(function(d) { return d.Weather_Condition == 'VMC'}));

    vmcIncidents = vmcIncidents.filter(
        function(d) {
            return d.key != '' && d.key != 'UNK';
        });


    var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2 + 50) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(vmcIncidents))
        .enter()
        .append("g")
        .on("mouseover", function(d) {
              let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");
         
              g.append("text")
                .attr("class", "name-text")
                .text(function(d) { return d.data.key; })
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');
          
              g.append("text")
                .attr("class", "value-text")
                .text(function(d) { return d.data.value; })
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em')
                .style('font-size', '24pt')
                .style('font-weight', 'bolder');
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(d))
                .select(".text-group").remove();
            })
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) { return color(d); })
          .on("mouseover", function(d) {
              d3.select(this)     
                .style("cursor", "pointer")
                .style("fill", "black");
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(d));
            });




    //add a new svg to hold the chart
    var svg = d3.select("#v3").append("svg")
        .attr("id", "v3c2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var labelG = svg.append('g');

    labelG.append('text')
        .style('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr("class", "fa")
        .attr('font-size', '100px')
        .attr('x', width / 2)
        .text(function(d) { return '\uf73d'; });

    labelG.append('text')
        .style('text-anchor', 'middle')
        .style('text-transform', 'uppercase')
        .style('font-weight', 'bolder')
        .attr('font-size', '24pt')
        .attr('x', width / 2)
        .attr('y', 100)
        .text('IMC');

    // Create array of objects summing up weather vs phase of flight
    var imcIncidents = d3.nest()
        .key(function(d) {
            if (d.Broad_Phase_of_Flight == 'TAKEOFF' || d.Broad_Phase_of_Flight == 'LANDING' || 
                d.Broad_Phase_of_Flight == 'APPROACH' || d.Broad_Phase_of_Flight == 'DESCENT' || d.Broad_Phase_of_Flight == 'CLIMB') {
                return d.Broad_Phase_of_Flight;
            } else {
                return 'OTHER';
            }
        })
        .rollup(function(v) { return v.length; })
        .entries(incident_data.filter(function(d) { return d.Weather_Condition == 'IMC'}));

    imcIncidents = imcIncidents.filter(
        function(d) {
            return d.key != '' && d.key != 'UNK';
        });


    var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2 + 50) + ')');

    var arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function(d) { return d.value; })
        .sort(null);

    var path = g.selectAll('path')
        .data(pie(imcIncidents))
        .enter()
        .append("g")
        .on("mouseover", function(d) {
              let g = d3.select(this)
                .style("cursor", "pointer")
                .style("fill", "black")
                .append("g")
                .attr("class", "text-group");
         
              g.append("text")
                .attr("class", "name-text")
                .text(function(d) { return d.data.key; })
                .attr('text-anchor', 'middle')
                .attr('dy', '-1.2em');
          
              g.append("text")
                .attr("class", "value-text")
                .text(function(d) { return d.data.value; })
                .attr('text-anchor', 'middle')
                .attr('dy', '.6em')
                .style('font-size', '24pt')
                .style('font-weight', 'bolder');
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(d))
                .select(".text-group").remove();
            })
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) { return color(d); })
          .on("mouseover", function(d) {
              d3.select(this)     
                .style("cursor", "pointer")
                .style("fill", "black");
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")  
                .style("fill", color(d));
            });

});