/**
 * Eth balance.
 */
class EthBalance
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
		// Eth balance and dash price
        let eth = $('h2.m-l-md.m-b-none:eq(1)');
		let ethPrice = this.parseEthPrice();
		if (ethPrice === false && eth.length == 0) {
			this.app.log("Can't parse eth price.");
			return;
		}
        let usd_balance = parseFloat($(eth).html()) * parseFloat(ethPrice);
        let text = $(eth).html() + ' <span class="badge badge-warning">$' + usd_balance.toFixed(2) + '</span>';
        $(eth).html(text);
        $(eth).closest('.ibox.float-e-margins').find('.ibox-title').find('h5').append(' <span>|</span> <span style="font-weight: bold;color:#f5b35c">1 ETH = $' + ethPrice + '</span>');

        // Last dash payout
        let last = $(eth).closest('ul').find("h3.m-l-md.m-b-none");
        if (last.length > 0) {
        	let lastEth = parseFloat($(last).html());
        	if (lastEth > 0) {
        		let lastText = $(last).html() + ' <span class="badge badge-warning">$' + (lastEth * ethPrice).toFixed(2) + '</span>';
        		$(last).html(lastText);
			}
		}
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
	}

    /**
	 * Parse dash price.
     * @returns {float|boolean}
     */
	parseEthPrice()
	{
		let remotePrice = this.getCryptonatorPrice();
		if (remotePrice !== false) {
			return remotePrice;
		}
		let element = $("#ether-row").find('.row:last').find('div.col-sm-6:last').find('.ibox-content').find('p:nth(0)');
		if (element.length == 0) {
			return false;
		}
		let content = $(element).html();

		let result = content.match(/([0-9]+\.[0-9]{8})\s*ETH\s*=\s*([0-9]+\.[0-9]{2})\s*USD/);
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
		$.get({url: 'https://api.cryptonator.com/api/ticker/eth-usd', async: false, dataType: "json"}).done(function(json){
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
