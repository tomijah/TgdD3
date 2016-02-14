interface IDataElement{
	Id:number; 
	Name: string;
	Lang: string;
	Commits: number
}
declare var data : IDataElement[];

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
.on("click",()=>{
	data.sort((a, b) => d3.ascending(a.Lang,b.Lang));
	draw(data);
});

d3.select("body").append("button")
.text("Sort commits")
.on("click",()=>{
	data.sort((a, b) => d3.ascending(a.Commits,b.Commits));
	draw(data);
});

d3.select("body").append("button")
.text("Remove first 10")
.on("click",()=>{
	data.splice(0,10);
	draw(data);
});

function draw(dat:IDataElement[]){
	var yScale = d3.scale.linear()
		.domain(d3.extent(dat, (d,i) => d.Commits))
		.range([0, height]);

	var xScale = d3.scale.ordinal()
		.domain(dat.map((e)=>e.Name))
		.rangeRoundBands([0, width], .1, 0)

	var colorScale = d3.scale.category10()
		.domain(dat.map((e)=>e.Lang));
	
	
	var updateSelection = svg.selectAll("rect").data(dat, (d,i) => d.Id.toString());
	var enterSelection = updateSelection.enter();
	var exitSelection = updateSelection.exit();

	enterSelection.append("rect")
	.attr({
		x: (d,i)=> xScale(d.Name),
		y: (d,i) => height - yScale(d.Commits),
		width: xScale.rangeBand(),
		height: (d,i) => yScale(d.Commits)
	})
	.style({
		fill: (d, i) => colorScale(d.Lang)
	});
	
	updateSelection.transition().duration(1000).attr({
		x: (d,i)=> xScale(d.Name),
		y: (d,i) => height - yScale(d.Commits),
		width: xScale.rangeBand(),
		height: (d,i) => yScale(d.Commits)
	});
	
	exitSelection.transition().duration(1000).attr({height: 0, y: height}).style({opacity:0}).remove();
}

draw(data);
