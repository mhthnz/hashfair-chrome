/**
 * Last avg sha and scrypt payout.
 */
class LastAvgBtc
{

	/**
	 * Constructor of module.
	 * @param  Application app     		Instance of Application class
	 * @param  object|null dependency   If isset - object, else - null
	 */
	constructor(app, dependency = null) 
	{
		this.app = app;
		this.dependency = dependency;
        this.runDate = new Date().getTime();
	}

    /**
	 * Run module.
     */
	run() 
	{
		let result = this.makeStat(14);
		if (result === false) {
			return;
		}
        var translate = this.app.getI18n();
        var container = $('ul.stat-list:first')[0];
        var sample = $(container).find('li:last')[0];
        var sample_html = $(sample).html();
        $(sample).after('<li>'+sample_html+'</li>');
        var target = $(container).find('li:last')[0];
        $(target).find('.p-xxs').css('background-color', '#f5b35c');
        $(target).find('h3').html(parseFloat(result).toFixed(8) + ' BTC &nbsp; <span class="badge badge-warning">$' + (parseFloat(result) * this.app.btcPrice).toFixed(2) + '</span>');
        $(target).find('small').text(translate.t('UI', 'DailyAverage', {days: 14}));
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
	}

	makeStat(days)
	{
		let payouts = this.app.getPayouts().groupByDate(PayoutsCollection.typeBTC);
		var daysUsed = 0;
		var amount = 0;

		for (var date in payouts) {
			if (daysUsed == days) {
				break;
			}
			for (var item in payouts[date]) {
				amount = parseFloat(amount) + parseFloat(payouts[date][item].getClearPayout());
			}
			daysUsed++;
		}
		if (daysUsed === 0 || amount === 0) {
			return false;
		}
		return (amount / daysUsed).toFixed(8);
	}

}
