interface IDataElement {
    Id: string;
    Name: string;
    Lang: string;
    Gender: string;
    Commits: number;
}
declare var data: IDataElement[];

type Primitive = number | string | boolean;

interface Attributes<Datum> {
    [key: string]: Primitive | ((datum: Datum, index: number, outerIndex: number) => Primitive)
}

var width = 900;
var height = 550;
var rightPadding = 100;
var bottomPadding = 150;
var leftPadding = 50;
var langSelected = false;
var svg = d3.select("body").append("svg")
    .attr({
        width: width,
        height: height
    });

var barsContainer = svg.append("g");
var legendContainer = svg.append("g").classed("legend", true)
    .attr("transform", `translate(${width - rightPadding}, 0)`);
var yScale = d3.scale.linear().range([height - bottomPadding, 0]);
var xScale = d3.scale.ordinal().rangeBands([leftPadding, width - rightPadding], 0.1, 0);
var colorScale = d3.scale.category10().domain(d3.map(data, d => d.Lang).keys());

var xAxisCont = svg.append("g").classed("axis", true)
    .attr("transform", `translate(0, ${height - bottomPadding})`);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yAxisCont = svg.append("g").classed("axis", true)
    .attr("transform", `translate(${leftPadding}, 0)`);
var yAxis = d3.svg.axis().scale(yScale).orient("left");

function drawScales(dat: IDataElement[]) {
    yScale.domain([0, d3.max(dat, d => d.Commits)]);
    xScale.domain(dat.map(d => d.Name));
    var xAxisTransition = xAxisCont.transition().duration(750).call(xAxis);
        xAxisTransition.selectAll("g").delay((d, i) => i * 10);
        xAxisTransition.selectAll("text")
            .attr({
                transform: "rotate(90)",
                y: -4,
                x: 9
            })
            .style({
                "text-anchor": "start"
            });
    yAxisCont.transition().duration(750).call(yAxis);
}

function drawBarChart(dat: IDataElement[]) {
    drawScales(dat);

    var update = barsContainer.selectAll("rect").data(dat, d => d.Id);
    var enter = update.enter();
    var exit = update.exit();
    var barAttributes: Attributes<IDataElement> = {
        width: xScale.rangeBand(),
        y: (d, i) => yScale(d.Commits),
        height: d => height - bottomPadding - yScale(d.Commits),
        x: (d, i) => xScale(d.Name)
    };

    enter.append("rect").attr(barAttributes).style({
            fill: d => colorScale(d.Lang),
            opacity: 0
        })
        .on("click", (d) => {
            if (langSelected) {
                showAll();
            } else {
                showLang(d);
            }
        })
        .append("title").text(d => d.Commits);

    update.transition().duration(750)
        .delay((d, i) => i * 10)
        .attr(barAttributes).style({
            fill: d => colorScale(d.Lang),
            opacity: 1
        });

    exit.transition().duration(750).style({
        opacity: 0
    }).remove();

    drawLegend(dat);
}

function drawLegend(dat: IDataElement[]) {
    var legendItems = d3.map(dat, d => d.Lang).keys();

    var update = legendContainer.selectAll("g").data(legendItems, d => d);
    var enter = update.enter();
    var exit = update.exit();

    var items = enter
        .append("g").attr({
            transform: (d, i) => `translate(10,${i * 25})`
        });
    items.append("rect").attr({
        width: 20,
        height: 20
    }).style({
        fill: colorScale
        });
    items.append("text").text(d => d).attr({
        x: 25,
        y: 15
    });

    update.transition().duration(750).attr({
        transform: (d, i) => `translate(10,${i * 25})`
    });
    update.select("rect").style({
        fill: colorScale
    });
    update.select("text").text(d => d);

    exit.transition().duration(750).style({
        opacity: 0
    }).remove();
}

function showLang(d: IDataElement) {
    langSelected = true;
    drawBarChart(data.filter(x => x.Lang === d.Lang));
}

function showAll() {
    langSelected = false;
    drawBarChart(data);
}

drawBarChart(data);


var removedCache = new Array<IDataElement>();
d3.select("body").append("button").text("Sort commits")
        .on("click", () => {
            data.sort((a, b) => d3.ascending(a.Commits, b.Commits));
            drawBarChart(data);
        });

    d3.select("body").append("button").text("Remove first 10")
        .on("click", () => {
            data.splice(0, 10).forEach(d => removedCache.push(d));
            drawBarChart(data);
        });

    d3.select("body").append("button").text("Add 10")
        .on("click", () => {
            removedCache.splice(0, 10).forEach(d => data.push(d));
            drawBarChart(data);
        });


    d3.select("body").append("button").text("Shuffle data")
        .on("click", () => {
            d3.shuffle(data);
            drawBarChart(data);
        });

    d3.select("body").append("button").text("Randomize")
        .on("click", () => {
            var max = Math.round(Math.random() * 1500) + 1000
            data.forEach(d => {
                d.Commits = Math.round(Math.random() * max - 10) + 10
            })
            drawBarChart(data);
        });

    d3.select("body").append("button").text("Sort langs")
        .on("click", () => {
            data.sort((a, b) => d3.ascending(a.Lang, b.Lang));
            drawBarChart(data);
        });