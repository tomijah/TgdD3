var width = 700;
var height = 500;
var svg = d3.select("body")
    .append("svg")
    .attr({
    width: width,
    height: height
});
d3.select("body").append("button")
    .text("Sort lang")
    .on("click", function () {
    data.sort(function (a, b) { return d3.ascending(a.Lang, b.Lang); });
    draw(data);
});
d3.select("body").append("button")
    .text("Sort commits")
    .on("click", function () {
    data.sort(function (a, b) { return d3.ascending(a.Commits, b.Commits); });
    draw(data);
});
d3.select("body").append("button")
    .text("Remove first 10")
    .on("click", function () {
    data.splice(0, 10);
    draw(data);
});
function draw(dat) {
    var yScale = d3.scale.linear()
        .domain(d3.extent(dat, function (d, i) { return d.Commits; }))
        .range([0, height]);
    var xScale = d3.scale.ordinal()
        .domain(dat.map(function (e) { return e.Name; }))
        .rangeRoundBands([0, width], .1, 0);
    var colorScale = d3.scale.category10()
        .domain(dat.map(function (e) { return e.Lang; }));
    var updateSelection = svg.selectAll("rect").data(dat, function (d, i) { return d.Id.toString(); });
    var enterSelection = updateSelection.enter();
    var exitSelection = updateSelection.exit();
    enterSelection.append("rect")
        .attr({
        x: function (d, i) { return xScale(d.Name); },
        y: function (d, i) { return height - yScale(d.Commits); },
        width: xScale.rangeBand(),
        height: function (d, i) { return yScale(d.Commits); }
    })
        .style({
        fill: function (d, i) { return colorScale(d.Lang); }
    });
    updateSelection.transition().duration(1000).attr({
        x: function (d, i) { return xScale(d.Name); },
        y: function (d, i) { return height - yScale(d.Commits); },
        width: xScale.rangeBand(),
        height: function (d, i) { return yScale(d.Commits); }
    });
    exitSelection.transition().duration(1000).attr({ height: 0, y: height }).style({ opacity: 0 }).remove();
}
draw(data);
