(function code(){
    var categories = {};
    var weights = {};
    var weighted  = false;
    var fracpercents = {};

    var termRegex = /Assignment Scores \(([A-Za-z0-9]+)\)/
    var termName = termRegex.exec(jQuery(".box-round:eq(2) h2").text())[1];

    jQuery(".box-round:eq(3) table tbody").each(function (index, el) {
      if (jQuery(el).children("tr:eq(0)").children("th:eq(0)").text().split(" ")[1] === termName) {
        jQuery(el).children("tr").each(function (index, el) {
          if (jQuery(el).children("td:eq(0)").text() === "Category Based") {
            weights[jQuery(el).children("td:eq(1)").text()] = Number(jQuery(el).children("td:eq(2)").text());
            weighted = true;
          }
        });
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
