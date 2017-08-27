/**
 * Balance module.
 * Show clear balance and current hashflare btc price.
 */
class Balance
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
        let btc = $('h2.m-l-md.m-b-none:first');
        if (!$(btc).length) {
        	this.app.log("Can't find balance block.");
        	return;
		}
        var usd_balance = parseFloat($(btc).html()) * parseFloat(this.app.btcPrice);
        var text = $(btc).html() + ' <span class="badge badge-warning">$' + usd_balance.toFixed(2) + '</span>';
        $(btc).html(text);
        $('.ibox-title:first').find('h5').append(' <font color="black">|</font> <span id="price_disclaimer"></span>');
        $('#price_disclaimer').css('color', '#f5b35c').css('font-weight', 'bold').text('1 BTC = $'+this.app.btcPrice);
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
	}

}
