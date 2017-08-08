$(document).ready(function () {

	var chart = $("#flot-balance:first");
	$(chart).after('<div class="flot-chart-content" id="chart" style="height:280px"></div>');
	$(chart).hide();

	/**
	 * Calculate avg statistic for scrypt.
	 * @param  string page History page
	 * @return object
	 */
	function avgScrypt(page)
	{
		var rows = $(page).find('td:contains("Scrypt maintenance (BTC)"):first').closest('tbody').find('tr');
		
		/**
		 * Days range for avg.
		 * @type Integer
		 */
		var avgDays = 14;

		/**
		 * Number of calculated days.
		 * @type Integer
		 */
		var currentDays = 0;

		/**
		 * Amount clear payout.
		 * @type Float
		 */
		var amount_btc = 0.0;

		/**
		 * Last scrypt clear payout.
		 * @type Float
		 */
		var lastClearPayout = 0.0;

		/**
		 * Find scrypt payout and maintenance by date.
		 * @param  int    i  Index
		 * @param  string el Html node
		 * @return Object {avg:float}
		 */
		$.each(rows, function (i, el) {
			if (currentDays >= avgDays) {
				return;
			}

			// Parse title
			var title = $($(el).find('td:nth-child(1)')[0]).html()
			if (title !== 'Scrypt payout (BTC)') {
				return;
			}

			// Parse date and parse maintenance for this date.
			var date = $($(el).find('td:nth-child(2)')[0]).html();
			var maintenance = findMaintenanceByDate(date.replace(/([^\s]+)/, '$1'), rows);
			if (maintenance === false) {
				return;
			}

			// Calculate clear payout 
			var amount_el = $(el).find('td:nth-child(3)')[0];
			var dirtyPrice = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
			amount_btc += (dirtyPrice - maintenance);

			// Last scrypt clear payout
			if (currentDays === 0) {
				lastClearPayout = (dirtyPrice - maintenance).toFixed(8);
			}

			currentDays++;
		});

		// Return result
		if (currentDays === 0) {
			return {avg: 0, lastScrypt: lastClearPayout};
		}
		return {
			avg: (amount_btc / currentDays).toFixed(8),
			lastScrypt: lastClearPayout
		};
	}

	/**
	 * Find maintenance by date.
	 * @param  string date 
	 * @param  string rows 
	 * @return float|false
	 */
	function findMaintenanceByDate(date, rows)
	{
		var tds = $(rows).find('td:contains("'+date+'")');
		if (tds.length === 0) {
			return false;
		}
		var maintenance = 0.0;
		$.each(tds, function(i, el) {
			if ($(el).parent('tr').find('td:contains("Scrypt maintenance (BTC)")').length === 0) {
				return;
			} else {
				var amount_el = $(el).parent('tr').find('td:nth-child(3)')[0];
				maintenance = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
				return false;
			}
		});
		if (maintenance > 0) {
			return maintenance;
		}
		return false;
	}

	/**
	 * Clear last bitcoin payout.
	 * @param  string page
	 * @return float
	 */
	function lastBtc(page)
	{
		var rows = $(page).find('td:contains("SHA-256 payout (BTC)"):first').closest('tbody').find('tr');

		/**
		 * Last btc clear payout.
		 * @type float
		 */
		var lastBtcPayout = 0.0;

		/**
		 * Days range for avg.
		 * @type Integer
		 */
		var avgDays = 14;

		/**
		 * Number of calculated days.
		 * @type Integer
		 */
		var currentDays = 0;

		/**
		 * Amount clear payout.
		 * @type Float
		 */
		var amount_btc = 0.0;

		/**
		 * Find sha payout and maintenance by date.
		 * @param  int    i  Index
		 * @param  string el Html node
		 * @return Object {avg:float}
		 */
		$.each(rows, function (i, el) {

			if (currentDays >= avgDays) {
				return;
			}

			// Parse title
			var title = $($(el).find('td:nth-child(1)')[0]).html()
			if (title !== 'SHA-256 payout (BTC)') {
				return;
			}

			// Parse date and parse maintenance for this date.
			var date = $($(el).find('td:nth-child(2)')[0]).html();
			var maintenance = findBtcMaintenanceByDate(date.replace(/([^\s]+)/, '$1'), rows);
			if (maintenance === false) {
				return;
			}

			// Calculate clear payout 
			var amount_el = $(el).find('td:nth-child(3)')[0];
			var dirtyPrice = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
			amount_btc += (dirtyPrice - maintenance);
			
			// Last btc clear payout
			if (currentDays === 0) {
				lastBtcPayout = (dirtyPrice - maintenance).toFixed(8);
			}
			console.log(date, dirtyPrice, maintenance, "Clear btc" + (dirtyPrice - maintenance).toFixed(8), "$" + ((dirtyPrice - maintenance) * btc_price).toFixed(2) ); 
			currentDays++;
		});

		// Return result
		if (currentDays === 0) {
			return {avg: 0, lastBtc: lastBtcPayout};
		}
		return {
			avg: (amount_btc / currentDays).toFixed(8),
			lastBtc: lastBtcPayout
		};
	}

	/**
	 * Find btc maintenance by date.
	 * @param  string date 
	 * @param  string rows 
	 * @return float|false
	 */
	function findBtcMaintenanceByDate(date, rows)
	{
		var tds = $(rows).find('td:contains("'+date+'")');
		if (tds.length === 0) {
			return false;
		}
		var maintenance = 0.0;
		$.each(tds, function(i, el) {
			if ($(el).parent('tr').find('td:contains("SHA-256 maintenance (BTC)")').length === 0) {
				return;
			} else {
				var amount_el = $(el).parent('tr').find('td:nth-child(3)')[0];
				maintenance = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
				return false;
			}
		});
		if (maintenance > 0) {
			return maintenance;
		}
		return false;
	}

	function get_sign(title){
		switch (title){
			case 'Scrypt maintenance (BTC)':
			case 'SHA-256 maintenance (BTC)':
				return -1;
				break;
			case 'Scrypt payout (BTC)':
			case 'SHA-256 payout (BTC)':
				return 1;
				break;
			default: return null;
		}
	}


	var btc_price = parseFloat($('#btcprice').val());

	// Dev option to make fix bitcoint price
	$.ajax({url:chrome.extension.getURL('dev/btc_price.html'), async:false}).done(function(page){
		if (page !== '') {
			btc_price = parseFloat(page);
		}
	});

	$.ajax('https://hashflare.io/panel/history').done(function(data){

		// Dev option to make fix history page
		$.ajax({url:chrome.extension.getURL('dev/history.html'), async:false}).done(function(page){
			if (page !== '') {
				data = page;
			}
		});

		var tbody = $(data).find('td:contains("SHA-256 maintenance (BTC)"):first').closest('tbody');
		var rows = $(tbody).find('tr');
		var gdata = [];
		var date = '';
		var index = null;
		$.each(rows, function (i, el) {
			title = $($(el).find('td:nth-child(1)')[0]).html();
			time = $($(el).find('td:nth-child(2)')[0]).data('order');
			day = format_time(time);
			end_day = moment().day(-15).format("YYYY-MM-DD");
			timex = parseInt(time*1000);
			amount_el = $(el).find('td:nth-child(3)')[0];
			amount = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
			balance = $($(el).find('td:nth-child(4)')[0]).html();

			if(day == end_day){
			    return false;
            }

			var sign = get_sign(title);
			if(sign){
				if(date != day){
					date = day;
					gdata.push({
						'date': day,
						'timestamp' : new Date(day).getTime(),
						'amount': (amount*sign),
						'balance': parseFloat(balance),
						'balance_usd': (parseFloat(balance) * btc_price),
						'payout': parseFloat(sign > 0 ? amount : 0)
					});
				}else{
					last = gdata.length - 1;
					gdata[last].amount += (amount*sign);
					gdata[last].amount_usd = gdata[last].amount * btc_price;
					gdata[last].payout += parseFloat(sign > 0 ? amount : 0);
					gdata[last].charge = gdata[last].payout - gdata[last].amount;
				}
			}
		});

		//console.log(gdata);
		//console.log(gdata.length);
		redraw(gdata.slice(0, 14), avgScrypt(data), lastBtc(data));
	});
});

function forecast(amount, title) {
	var btc_price = parseFloat($('#btcprice').val());
	
	// Dev option to make fix bitcoint price
	$.ajax({url:chrome.extension.getURL('dev/btc_price.html'), async:false}).done(function(page){
		if (page !== '') {
			btc_price = parseFloat(page);
		}
	});

	amount = parseFloat(amount);
	return amount.toFixed(8) + ' BTC = ' + (amount*btc_price).toFixed(2) + ' USD <span class="pull-right badge badge-warning">'+title+'</span>';

}

function redraw(gdata, scrypt, btc){
	var amount = [];
	var amount_usd = [];
	var balance = [];
	var balance_usd = [];
	var payout = [];
	var payout_usd = [];
	var percent = [];

	var amount_avg = 0;
	var amount_usd_avg = 0;
	$.each(gdata, function (i, e) {
		amount.push([ e.timestamp, e.amount ]);
		amount_usd.push([ e.timestamp, parseFloat((e.amount_usd).toFixed(2)) ]);
		balance_usd.push([ e.timestamp, parseFloat(e.balance_usd.toFixed(2))]);
		balance.push([ e.timestamp, e.balance ]);
		payout.push([ e.timestamp, e.payout ]);
		percent.push([ e.timestamp, parseInt(e.amount * 100 / e.payout) ]);
		amount_avg += e.amount;
		amount_usd_avg += e.amount_usd;
	});

	if(gdata.length){
		amount_avg = amount_avg / gdata.length;
		amount_usd_avg = amount_usd_avg / gdata.length;
		$('#daily_average').html(amount_avg.toFixed(8) + ' BTC &nbsp;');
		$('#daily_average').append('<span class="badge badge-warning">$'+amount_usd_avg.toFixed(2)+'</span>');

		var last_amount = gdata[0].amount;
		var last_amount_usd = last_amount * btc_price;

		$('#last_amount').html(last_amount.toFixed(8) + ' BTC &nbsp;');
		$('#last_amount').append('<span class="badge badge-warning">$'+last_amount_usd.toFixed(2)+'</span>');
	}

	// Btc avg
	if (btc.avg !== 0) {
		forecasts = $('#sha-row').find('.row:last').find('div.col-sm-6:last').find('.ibox-content');
		forecasts = forecasts[0];
		$(forecasts).find('p:nth(0)').html(forecast(btc.avg, '1d'));
		$(forecasts).find('p:nth(1)').html(forecast((btc.avg*7), '1w'));
		$(forecasts).find('p:nth(2)').html(forecast((btc.avg*30), '1m'));
		$(forecasts).find('p:nth(3)').html(forecast((btc.avg*30*6), '6m'));
		$(forecasts).find('p:nth(4)').html(forecast((btc.avg*30*12), '1y'));

		// Last btc payout
		var container = $('ul.stat-list:first')[0];
		$(container).find('li:eq(2)').find('span').css('background-color', '#f5b35c');
		$(container).find('li:eq(2)').find('h3').html(btc.lastBtc + ' BTC &nbsp;' + '<span class="badge badge-warning">$'+(btc.lastBtc * btc_price).toFixed(2)+'</span>');
	}

	// Scrypt avg
	if (scrypt.avg !== 0) {
		forecasts = $('#scrypt-row').find('.row:last').find('div.col-sm-6:last').find('.ibox-content');
		forecasts = forecasts[0];
		$(forecasts).find('p:nth(0)').html(forecast(scrypt.avg, '1d'));
		$(forecasts).find('p:nth(1)').html(forecast((scrypt.avg*7), '1w'));
		$(forecasts).find('p:nth(2)').html(forecast((scrypt.avg*30), '1m'));
		$(forecasts).find('p:nth(3)').html(forecast((scrypt.avg*30*6), '6m'));
		$(forecasts).find('p:nth(4)').html(forecast((scrypt.avg*30*12), '1y'));

		// Last scrypt payout
		var container = $('ul.stat-list:first')[0];
		$(container).find('li:eq(3)').find('span').css('background-color', '#f5b35c');
		$(container).find('li:eq(3)').find('h3').html(scrypt.lastScrypt + ' BTC &nbsp;' + '<span class="badge badge-warning">$'+(scrypt.lastScrypt * btc_price).toFixed(2)+'</span>');
	}

	balanceoptions = {
		xaxis: {
			mode: "time",
			tickSize: [1, "day"],
			tickLength: 0,
			axisLabel: "Date",
			axisLabelUseCanvas: true,
			axisLabelFontSizePixels: 12,
			axisLabelFontFamily: "Arial",
			axisLabelPadding: 10,
			color: "#d5d5d5",
			timeformat: "%d.%m"
		},
		yaxes: [
			{
				position: "left",
				//max: 1070,
				color: "#f5f5f5",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: "Arial",
				axisLabelPadding: 3
			},
			{
				position: "right",
				color: "#f5f5f5",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: "Arial",
				axisLabelPadding: 67
			},
			{
				position: "left",
				color: "#f5b35c",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: "Arial",
				axisLabelPadding: 67
			},
			{
				position: "right",
				color: "#f5b35c",
				axisLabelUseCanvas: true,
				axisLabelFontSizePixels: 12,
				axisLabelFontFamily: "Arial",
				axisLabelPadding: 67
			}
		],
		legend: false,
		grid: {
			hoverable: true,
			borderWidth: 0
		},
		tooltip: true,
		tooltipOpts: {
			content: tooltipper,
			xDateFormat: "%d.%m.%y"
		}
	};


	balancedata = [
		{
			label: "BTC payout&nbsp;",
			data: payout,
			color: "#84defb",
			bars: {
				show: true,
				align: "center",
				barWidth: 24 * 60 * 60 * 600,
				lineWidth: 0,
				fill: 1.0,
				fillColor: "rgba(199,237,252,0.3)"
			},
			yaxis: 1,
			highlightColor: "rgba(199,237,252,0.2)"
		},
		{
			label: "BTC paid ",
			data: amount,
			color: "#FF6600",
			bars: {
				show: true,
				align: "center",
				barWidth: 24 * 60 * 60 * 600,
				lineWidth: 0,
				fill: 1.0,
				fillColor: "rgba(245,179,92,1)"
			},
			yaxis: 1,
			highlightColor: "rgba(199,237,252,0.2)"
		},
		{
			label: "BTC balance",
			data: balance,
			yaxis: 2,
			color: "#5A93c4",
			lines: {
				lineWidth: 2,
				show: true,
				fill: false,
				fillColor: {
					colors: [{
						opacity: 0.2
					}, {
						opacity: 0
					}]
				}
			},
			splines: {
				show: false,
				tension: 0.6,
				lineWidth: 1,
				fill: 0.1
			}
		},
		{
			label: "USD payout",
			data: amount_usd,
			yaxis: 3,
			color: "#f5b35c",
			lines: {
				lineWidth: 3,
				show: true,
				fill: false,
				fillColor: {
					colors: [{
						opacity: 1
					}, {
						opacity: 0
					}]
				}
			}
		},
		{
			label: "% left",
			data: percent,
			yaxis: 4,
			color: "#f5b35c",
			lines: {
				lineWidth: 1,
				show: true,
				fill: false,
				fillColor: {
					colors: [{
						opacity: 0.1
					}, {
						opacity: 0
					}]
				}
			}
		}
	];
	$.plot($("#chart"), balancedata, balanceoptions);
}
