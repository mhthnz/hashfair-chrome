/**
 * Balance module.
 * Show clear balance and current hashflare btc price.
 */
class LastShaPayout
{

	/**
	 * Constructor of module.
	 * @param  Application app     		Instance of Application class
	 * @param  object|null dependency   If isset - object, else - null
	 */
	constructor(app, dependency = null) 
	{
		app.log("Init LastShaPayout class.");
		this.app = app;
		this.dependency = dependency;
	}

    /**
	 * Run module.
     */
	run() 
	{
		let payouts = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSHA);
		if (payouts.length > 0) {
			let payout = payouts[0].getClearPayout();
            var container = $('ul.stat-list:first')[0];
            $(container).find('li:eq(2)').find('span').css('background-color', '#f5b35c');
            $(container).find('li:eq(2)').find('h3').html(payout + ' BTC &nbsp;' + '<span class="badge badge-warning">$'+(payout * this.app.btcPrice).toFixed(2)+'</span>');
        }
	}

}
