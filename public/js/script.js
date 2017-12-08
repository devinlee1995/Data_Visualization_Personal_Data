//navbar jquery 
$(".Home_Link").click(function() {
     $('html, body').animate({
        scrollTop: $("#Home").offset().top - 100
    }, 2000);
});

$(".Diet_Link").click(function() {
    $('html, body').animate({
        scrollTop: $("#Diet").offset().top - 60
    }, 2000);
});

$(".Mobile_Link").click(function() {
     $('html, body').animate({
        scrollTop: $("#Mobile").offset().top - 60
    }, 2000);
});

$(".Sleep_Link").click(function() {
     $('html, body').animate({
        scrollTop: $("#Sleep").offset().top - 60
    }, 2000);
});

$(".Comparison_Link").click(function() {
     $('html, body').animate({
        scrollTop: $("#Comparison").offset().top - 60
    }, 2000);
});

//Pie Chart for Diet Data 
d3.select("input[value=\"total\"]").property("checked", true);

var svg = d3.select("#Diet")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labelName");
svg.append("g")
	.attr("class", "labelValue");
svg.append("g")
	.attr("class", "lines");

var width = parseInt(d3.select('#Diet').style('width'), 10)
    height = 400,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var colorRange = d3.scale.category20();
console.log(colorRange);
var color = d3.scale.ordinal()
	.range(["#439aca", "#ffce4b", "#ff5252"]);

datasetTotal = [
		{label:"Carbs", value:65}, 
        {label:"Fat", value:15}, 
        {label:"Protein", value:20},
        ];

datasetSeptember = [
		{label:"Carbs", value:66}, 
        {label:"Fat", value:16}, 
        {label:"Protein", value:18},
        ];

datasetOctober = [
        {label:"Carbs", value:64}, 
        {label:"Fat", value:14}, 
        {label:"Protein", value:22},
        ];

datasetNovember = [
        {label:"Carbs", value:67}, 
        {label:"Fat", value:13}, 
        {label:"Protein", value:20},
        ];


change(datasetTotal);


d3.selectAll("select")
	.on("change", selectDataset);
	
function selectDataset()
{
	var value = this.value;
	if (value == "total")
	{
		change(datasetTotal);
	}
	else if (value == "option1")
	{
        change(datasetSeptember);
	}
	else if (value == "option2")
	{
		change(datasetOctober);
	}
    else if (value == "option3")
    {
        change(datasetNovember);
    }

}

function change(data) {
    console.log("in change");

	//Pie slices
	var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })

   //for hover label     
   /* slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+"<br>"+(d.data.value)+"%");
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();*/

    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });

    //Text Labels

    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
        });


    text.exit()
        .remove();

    //Polylines

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
};	