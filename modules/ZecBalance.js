/**
 * Zec balance.
 */
class ZecBalance
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
		// Zec balance and Zec price
        let zec = $('h2.m-l-md.m-b-none:eq(2)');
		let zecPrice = this.parseZecPrice();
		if (zecPrice === false && zec.length == 0) {
			this.app.log("Can't parse zec price.");
			return;
		}
        let usd_balance = parseFloat($(zec).html()) * parseFloat(zecPrice);
        let text = $(zec).html() + ' <span class="badge badge-warning">$' + usd_balance.toFixed(2) + '</span>';
        $(zec).html(text);
        $(zec).closest('.ibox.float-e-margins').find('.ibox-title').find('h5').append(' <span>|</span> <span style="font-weight: bold;color:#f5b35c">1 ZEC = $' + zecPrice + '</span>');

        // Last zec payout
        let last = $(zec).closest('ul').find("h3.m-l-md.m-b-none");
        if (last.length > 0) {
        	let lastZec = parseFloat($(last).html());
        	if (lastZec > 0) {
        		let lastText = $(last).html() + ' <span class="badge badge-warning">$' + (lastZec * zecPrice).toFixed(2) + '</span>';
        		$(last).html(lastText);
			}
		}
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
	}

    /**
	 * Parse dash price.
     * @returns {float|boolean}
     */
	parseZecPrice()
	{
		let remotePrice = this.getCryptonatorPrice();
		if (remotePrice !== false) {
			return remotePrice;
		}
		let element = $("#zcash-row").find('.row:last').find('div.col-sm-6:last').find('.ibox-content').find('p:nth(0)');
		if (element.length == 0) {
			return false;
		}
		let content = $(element).html();

		let result = content.match(/([0-9]+\.[0-9]{8})\s*ZEC\s*=\s*([0-9]+\.[0-9]{2})\s*USD/);
		if (result) {
			let quotient = 1.00000000 / parseFloat(result[1]);
			return (quotient * parseFloat(result[2])).toFixed(2);
		}
		return false;
	}

    /**
	 * Get cryptonator zec price.
     * @returns {float|boolean}
     */
	getCryptonatorPrice()
	{
		let result = 0;
		$.get({url: 'https://api.cryptonator.com/api/ticker/zec-usd', async: false, dataType: "json"}).done(function(json){
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
