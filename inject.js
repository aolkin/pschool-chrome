(function code(){
    var categories = {};
    var weights = {};
    var weighted  = false;
    var fracpercents = {};

    jQuery(".box-round:eq(3) table tr").each(function(index,el){
	if(jQuery(el).children("td:eq(0)").text() == "Category Based") {
	    weights[jQuery(el).children("td:eq(1)").text()] = Number(jQuery(el).children("td:eq(2)").text());
	    weighted = true;
	}
    });

    jQuery(".box-round:eq(0) table:eq(0) tr td:eq(3)").html(jQuery(".box-round:eq(0) table:eq(0) tr td:eq(3)").html()+" (<span id=\"percent-calc-chrome\"></span>%)");

    function calculate_percent() {
	var total = 0;
	var totalpossible = 0;
	var sum = 0;
	if (weighted) {
	    jQuery(".box-round:eq(1) table tbody tr").each(function(index, el) {
		categories[jQuery(el).children("td:eq(0)").text().split(" (")[0]] = Number(jQuery(el).children("td:eq(3)").text()) / Number(jQuery(el).children("td:eq(2)").text())
	    });
	    
	    for (i in categories) {
		total += weights[i]
	    }
	    for (i in categories) {
		fracpercents[i] = categories[i]*weights[i]/total;
		sum += fracpercents[i]
	    }
	} else {
	    jQuery(".box-round:eq(1) table tbody tr").each(function(index, el) {
		total += Number(jQuery(el).children("td:eq(3)").text());
		totalpossible += Number(jQuery(el).children("td:eq(2)").text())
	    });
	    sum = total/totalpossible;
	}
	jQuery("#percent-calc-chrome").text((sum*100).toFixed(2));
    }

    jQuery(".box-round:eq(1) tbody tr td").attr("contenteditable",true).keyup(calculate_percent);
    calculate_percent();
})();
