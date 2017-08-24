/**
 * Dash balance.
 */
class DashBalance
{

	/**
	 * Constructor of module.
	 * @param  Application app     		Instance of Application class
	 * @param  object|null dependency   If isset - object, else - null
	 */
	constructor(app, dependency = null) 
	{
		app.log("Init DashBalance class.");
		this.app = app;
		this.dependency = dependency;
	}

    /**
	 * Run module.
     */
	run() 
	{
        let dash = $('h2.m-l-md.m-b-none:eq(2)');
		let dashPrice = this.parseDashPrice();
		if (dashPrice === false && dash.length == 0) {
			this.app.log("Can't parse dash price.");
			return;
		}
        let usd_balance = parseFloat($(dash).html()) * parseFloat(dashPrice);
        let text = $(dash).html() + ' <span class="badge badge-warning">$' + usd_balance.toFixed(2) + '</span>';
        $(dash).html(text);
        $(dash).closest('.ibox.float-e-margins').find('.ibox-title').find('h5').append(' <span>|</span> <span style="font-weight: bold;color:#f5b35c">1 DASH = $' + dashPrice + '</span>');

        // Last dash payout
        let last = $(dash).closest('ul').find("h3.m-l-md.m-b-none");
        if (last.length > 0) {
            let lastDash = parseFloat($(last).html());
            if (lastDash > 0) {
                let lastText = $(last).html() + ' <span class="badge badge-warning">$' + (lastDash * dashPrice).toFixed(2) + '</span>';
                $(last).html(lastText);
            }
        }
	}

    /**
	 * Parse dash price.
     * @returns {float|boolean}
     */
	parseDashPrice()
	{
		let remotePrice = this.getCryptonatorPrice();
		if (remotePrice !== false) {
			return remotePrice;
		}
		let element = $("#dash-row").find('.row:last').find('div.col-sm-6:last').find('.ibox-content').find('p:nth(0)');
		if (element.length == 0) {
			return false;
		}
		let content = $(element).html();

		let result = content.match(/([0-9]+\.[0-9]{8})\s*DASH\s*=\s*([0-9]+\.[0-9]{2})\s*USD/);
		if (result) {
			let quotient = 1.00000000 / parseFloat(result[1]);
			return (quotient * parseFloat(result[2])).toFixed(2);
		}
		return false;
	}

    /**
	 * Get cryptonator dash price.
     * @returns {float|boolean}
     */
	getCryptonatorPrice()
	{
		let result = 0;
		$.get({url: 'https://api.cryptonator.com/api/ticker/dash-usd', async: false, dataType: "json"}).done(function(json){
			if (json.hasOwnProperty("ticker") && json.ticker.hasOwnProperty('price')) {
				result = (parseFloat(json.ticker.price)).toFixed(2);
			}
		});
		if (result === 0) {
			return false;
		}
		return result;
	}
}
