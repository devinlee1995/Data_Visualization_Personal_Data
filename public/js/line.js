//Line Chart for Mobile Data 
var myData = "date, Mobile, Sleep \n\
20170828,138,\n\
20170901,208,420,\n\
20170902,256,300,\n\
20170903,305,240,\n\
20170904,258,300,\n\
20170905,225,240,\n\
20170906,257,360,\n\
20170907,152,420,\n\
20170908,330,300,\n\
20170909,83,540,\n\
20170910,124,540,\n\
20170911,123,600,\n\
20170912,265,300,\n\
20170913,171,360,\n\
20170914,106,300,\n\
20170915,251,420,\n\
20170916,197,540,\n\
20170917,211,540,\n\
20170918,221,360,\n\
20170919,143,420,\n\
20170920,101,300,\n\
20170921,119,360,\n\
20170922,403,180,\n\
20170923,36,480,\n\
20170924,253,300,\n\
20170925,178,360,\n\
20170926,155,540,\n\
20170927,69,480,\n\
20170928,62,480,\n\
20170929,190,420,\n\
20170930,156,300,\n\
20171001,0,300,\n\
20171002,0,300,\n\
20171003,0,360,\n\
20171004,0,240,\n\
20171005,133,420,\n\
20171006,250,180,\n\
20171007,289,240,\n\
20171008,169,540,\n\
20171009,10,420,\n\
20171010,222,240,\n\
20171011,146,360,\n\
20171012,121,540,\n\
20171013,88,480,\n\
20171014,195,240,\n\
20171015,164,420,\n\
20171016,274,300,\n\
20171017,86,480,\n\
20171018,183,300,\n\
20171019,120,420,\n\
20171020,144,480,\n\
20171021,128,240,\n\
20171022,131,540,\n\
20171023,222,480,\n\
20171024,404,240,\n\
20171025,269,360,\n\
20171026,311,540,\n\
20171027,223,600,\n\
20171028,251,360,\n\
20171029,60,540,\n\
20171030,110,420,\n\
20171031,291,300,\n\
20171101,335,240,\n\
20171102,84,300,\n\
20171103,163,0,\n\
20171104,149,180,\n\
20171105,164,420,\n\
20171106,446,180,\n\
20171107,261,360,\n\
20171108,270,480,\n\
20171109,554,180,\n\
20171110,217,300,\n\
20171111,92,360,\n\
20171112,0,540,\n\
20171113,228,480,\n\
20171114,287,420,\n\
20171115,359,240,\n\
20171116,222,420,\n\
20171117,215,480,\n\
20171118,218,540,\n\
20171119,254,300,\n\
20171120,229,420,\n";

    var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
      },
      width = parseInt(d3.select('#Comparison_graph').style('width'), 10) - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = d3.scale.ordinal()
  .range(["#9edbcc", "#c2b3e8"]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.temperature);
      });

    var svg = d3.select("#Comparison_graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .style("fill", "#828282")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var data = d3.csv.parse(myData);
    console.log(data[0]);


    color.domain(d3.keys(data[0]).filter(function(key) {
      return key !== "date";
    }));

    data.forEach(function(d) {
        d.date = parseDate(d.date); 
        //console.log(d);
    });

    var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {
            date: d.date,
            temperature: +d[name]
          };
        })
      };
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));

    y.domain([
      d3.min(cities, function(c) {
        return d3.min(c.values, function(v) {
          return v.temperature;
        });
      }),
      d3.max(cities, function(c) {
        return d3.max(c.values, function(v) {
          return v.temperature;
        });
      })
    ]);

 /*   var legend = svg.selectAll('g')
      .data(cities)
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width + 20)
      .attr('y', function(d, i) {
        return i * 20;
      })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
        return color(d.name);
      });

    legend.append('text')
      .attr('x', width + 40)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
        return d.name;
      });*/

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("fill", "#828282")
      .call(xAxis);


    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "#828282")
      .text("Time Spent (Minutes)");

    
    //the lines themselves
    var city = svg.selectAll(".city")
      .data(cities)
      .enter().append("g")
      .attr("class", "city");

    city.append("path")
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke-width", "2.5px")
      .style("stroke", function(d) {
        return color(d.name);
      });

    city.append("text")
      .datum(function(d) {
        return {
          name: d.name,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
      })
      .attr("x", 6)
      .attr("dy", ".8em")
      .text(function(d) {
        return d.name;
      });


    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "#828282")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(cities)
      .enter()
      .append("g")
      .style("fill", "#828282")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            console.log(x.invert(mouse[0]))
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            var text0 = String(x.invert(mouse[0]));
            var text1 = text0.substring(4, 10) + ": ";
            console.log(text1);
            var text2 = (text1 +(y.invert(pos.y).toFixed(0)))
            
            d3.select(this).select('text')
              .text(text2);
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });


