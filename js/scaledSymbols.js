// scaledSymbols

function scaledSymbols(){
	
	
	
	
	
	var margin = { top: 75, right: 50, bottom: 50, left: 0 };
	
	vis.scale = d3.scaleLinear().domain([0,15000000]).range([20,1000]);
	vis.xTranslate = margin.left;
	vis.svg = d3.select("#trl-chart")
		.append("svg")
		.attr("id", "mainSvg")
		.attr("width", vis.width)
		.attr("height", vis.height);
				
	
	vis.xTranslate = 0;
	vis.thisSide = 0;
	vis.previousSide = 0;
	vis.spacer = 5;
	vis.mainOffset = 0;
	vis.totalVisWidth = 0;
	vis.totalVisWidth2 = 0;
	vis.maxSide = 0;
	vis.yOffSet = 32.5;
	vis.layerCount = 0;
	vis.totalyOffset = 1;
	
	
	d3.csv(vis.config.vars.dataFile2, type, function(error, data) {
		if (error) throw error;
		
		
		vis.prevLayerOffset = vis.scale(Math.sqrt(data[0].value));
			
		vis.svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")	
				.attr("class", function(d,i){
					return "rectangle " + SpaceToUnderscore(d.country) + " " + d.form;
				})	
				.attr("x" , function(d,i){
					
					
					if( (vis.totalVisWidth)<vis.config.vars.mapDimensions[0] ){
						
						if ( i==0 ) {
							vis.xTranslate =0;	
						}
						else {
							vis.xTranslate = vis.xTranslate + vis.scale(vis.previousSide)+vis.spacer;	
						}
						vis.previousSide = Math.sqrt(d.value);
						vis.totalVisWidth = Number(vis.totalVisWidth + vis.scale(Math.sqrt(d.value)) + vis.spacer + vis.scale(Math.sqrt(vis.previousSide)));
					
					}
					else if( vis.totalVisWidth>vis.config.vars.mapDimensions[0] ){
						vis.totalVisWidth = 0.0;
						vis.maxSide = -999;
						vis.xTranslate = vis.spacer;
						vis.previousSide = Math.sqrt(d.value);
					}
					return vis.xTranslate;
				})
				.attr("y" , function(d,i){
					
					if ( vis.scale(Math.sqrt(d.value)) >= vis.maxSide ){ vis.maxSide = vis.scale(Math.sqrt(d.value)); }
					
					
					if( vis.totalVisWidth2<vis.config.vars.mapDimensions[0] ){
						vis.totalVisWidth2 = Number(vis.totalVisWidth2 + vis.scale(Math.sqrt(d.value)) + vis.spacer + vis.scale(Math.sqrt(vis.previousSide)));
						//console.log("Country: " + d.country + " : " + i + "		vis.config.vars.mapDimensions[0]: " + vis.config.vars.mapDimensions[0] + "		vis.totalVisWidth2: " + vis.totalVisWidth2);
					
					}// end if ....
					else if( vis.totalVisWidth2>vis.config.vars.mapDimensions[0] ){
						vis.totalyOffset = vis.totalyOffset + vis.maxSide + vis.yOffSet;
						
						vis.maxSide = -999;
						vis.totalVisWidth2 = 0;
					}// end else ....
					
					return Number(vis.totalyOffset);
				})
				.attr("width" , function(d,i){ return vis.scale(Math.sqrt(d.value)); })
				.attr("height" , function(d,i){ return vis.scale(Math.sqrt(d.value)); })
				.on("mouseover", function(d,i){
					$(".rectangle").addClass("unselected").removeClass("selected");
					$(this).addClass("selected").removeClass("unselected");
					getFlag(d);
				})
				.on('mousemove', function(d) {
					vis.m = d3.mouse(this);
					vis.toolTip.style('left', Number(vis.m[0]-213) + 'px').style('top', Number(vis.m[1]-0) + 'px');
				})
				.on("mouseout", function(d,i){
					
					d3.selectAll(".trl-country").style("opacity" ,0.9).style("stroke", "#ccc").style("stroke-width", "0.0px");
					vis.toolTip.style('opacity', 0);
					
					$(".rectangle").removeClass("unselected").removeClass("selected");
				})
	});

	function type(d) {
	  d.value = +d.value;
	  return d;
	}
	
	return;
	
}// end function scaledSymbols()



// Function for showing information tooltip when user selects country name from typeahead
function getFlag(information) {
	
	
	d3.select('.trl-toolTip').remove();
	vis.toolTip = d3.select('.trl-chart')
								.append('div')
								.attr('class', 'trl-toolTip');
	
	var flagCode;
	var flagSpan;
	 
	if ( information.form == "country" ){
		flagCode = information['ISO 3166-1 2 Letter Code'].toLowerCase();
		flagSpan = '<span class="flag-icon flag-icon-' + flagCode + '"></span>';
	}
	else if ( information.form == "crypto" ){
		flagCode = information['ISO 3166-1 3 Letter Code'].toLowerCase();
		flagSpan = "<img src=icons/" + flagCode + ".png></img>";
	}
	else {
		flagCode = '';
	    flagSpan = '';
	}
	
	// build-up tool tip for country hover over
	var txt = '<div class="trl-header">';
	if( information.form != "item" ){  txt += '<div class="trl-flag">' + flagSpan + '</div>'; }
	txt += '<span class="trl-country">' + UnderscoreToSpace(information.country) + '</span></div>';
	txt += '<div class="trl-information">market capitalization value:</br> $' + numberWithCommas(information.value) + " ($" + (((Number(information.value))/1000000000000).toFixed(2)) + "bn)</span></div>";
	
	console.log(information);
	console.log(flagCode);
	console.log(txt);

	vis.toolTip.html(txt);
	vis.toolTip.style('opacity',0.99);
	
	var sel = d3.select('.trl-toolTip');
	sel.moveToFront();
	
	return;
	
}// end function showCountryCryptoInformation()