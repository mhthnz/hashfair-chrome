/**
 * Last summary btc payout.
 */
class LastSummaryBtcPayout
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
        var translate = this.app.getI18n();
		let scrypt = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSCRYPT);
        let sha = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSHA);
        let payout = 0;

		if (scrypt.length > 0) {
			payout += parseFloat(scrypt[0].getClearPayout());
        }
        if (sha.length > 0) {
			payout += parseFloat(sha[0].getClearPayout());
		}
        var container = $('ul.stat-list:first')[0];
        var sample = $(container).find('li:last')[0];
        var sample_html = $(sample).html();
        $(sample).after('<li>'+sample_html+'</li>');
        var target = $(container).find('li:last')[0];
        $(target).find('.p-xxs').css('background-color', '#f5b35c');
        $(target).find('h3').html(payout.toFixed(8) + ' BTC &nbsp; <span class="badge badge-warning">$' + (payout * this.app.btcPrice).toFixed(2) + '</span>');
        $(target).find('small').text(translate.t('UI', 'LastSummaryBtc'));
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
	}

}
