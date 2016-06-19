const weights = {};
let weighted  = false;
const termRegex = /Assignment Scores \(([A-Za-z0-9]+)\)/;
const termName = termRegex.exec($('.box-round').eq(2).children('h2').text())[1];
const percentId = 'percent-calc-chrome'

// get weights from "Special Weighting"
$('.box-round').eq(3).find('table tbody').each((index, elem) => {
  const tr = $(elem).children('tr');
  if (tr.eq(0).children('th').eq(0).text().split(' ')[1] === termName) {
    tr.slice(1).each((index, elem) => {
      const td = $(elem).children('td');
      if (td.eq(0).text() === 'Category Based') {
        weights[td.eq(1).text()] = Number(td.eq(2).text());
        weighted = true;
      }
    });
  }
});

// add span for percentage
$('.box-round').eq(0).children('table').eq(0).find('tr td').eq(3).append(' (<span id="' + percentId + '"></span>%)');

function calculatePercent () {
  let sum = 0;

  if (weighted) {
    let totalWeights = 0;
    const categories = {};
    const fracPercents = {};

    $('.box-round').eq(1).find('table tbody tr').each((index, elem) => {
      const td = $(elem).children('td');
      categories[td.eq(0).text().split(' (')[0]] = Number(td.eq(3).text()) / Number(td.eq(2).text());
    });

    for (i in categories) {
      if (i in weights) {
        totalWeights += weights[i];
      } else {
        // on the off-chance a teacher creates a category but doesn't give it a weight
        weights[i] = 0;
      }
    }

    for (i in categories) {
      fracPercents[i] = categories[i] * weights[i] / totalWeights;
      sum += fracPercents[i];
    }
  } else {
    let totalPts = 0;
    let totalPossible = 0;

    $('.box-round').eq(1).find('table tbody tr').each((index, elem) => {
      const td = $(elem).children('td');
      totalPts += Number(td.eq(3).text());
      totalPossible += Number(td.eq(2).text());
    });
    sum = totalPts / totalPossible;
  }

  $('#percent-calc-chrome').text((sum * 100).toFixed(2));
}

// make points fields editable and add calculatePercent for keyup event
const ptsIndexes = [];
$('.box-round').eq(1).find('thead tr th').each((index, elem) => {
  if (elem.innerHTML === 'Points Possible' || elem.innerHTML === 'Points Earned') {
    ptsIndexes.push(index);
  }
});
$('.box-round').eq(1).find('tbody tr').each((index, elem) => {
  $(elem).children('td').each((index, elem) => {
    if (ptsIndexes.includes(index)) {
      $(elem).attr('contenteditable', true)
             .keyup(calculatePercent);
    }
  });
});

calculatePercent();
