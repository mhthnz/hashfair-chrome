class ScryptForecast {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        this.app = app;
        this.dependency = dependency;

        this.runDate = new Date().getTime();

        /**
         * Days for forecast
         * @type {number}
         */
        this.avgDays = 3;

        if (typeof OPTIONS != 'undefined' && OPTIONS.hasOwnProperty('revenueScryptForecast')) {
            this.avgDays = OPTIONS.revenueScryptForecast;
        }
    }

    /**
     * Run module.
     */
    run() {
        var payouts = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSCRYPT);
        if (payouts.length == 0) {
            this.app.log("Not found scrypt payouts.");
            return;
        }
        var summ = 0.0;
        var days = 0;
        for (var i = 0; i < payouts.length && i < this.avgDays; i++) {
            summ += parseFloat(payouts[i].getClearPayout());
            days++;
        }
        let result = (summ / days).toFixed(8);

        // Fill forecast
        var forecasts = $('#scrypt-row').find('.row:last').find('div.col-sm-6:last').find('.ibox-content');
        forecasts = forecasts[0];
        $(forecasts).find('p:nth(0)').html(this.forecast(result, '1d'));
        $(forecasts).find('p:nth(1)').html(this.forecast((result*7), '1w'));
        $(forecasts).find('p:nth(2)').html(this.forecast((result*30), '1m'));
        $(forecasts).find('p:nth(3)').html(this.forecast((result*30*6), '6m'));
        $(forecasts).find('p:nth(4)').html(this.forecast((result*30*12), '1y'));
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
    }

    /**
     * Calculate forecast.
     * @param {float} amount
     * @param {strnig} day
     */
    forecast(amount, day)
    {
        amount = parseFloat(amount);
        return amount.toFixed(8) + ' BTC = ' + (amount * this.app.btcPrice).toFixed(2) + ' USD <span class="pull-right badge badge-warning">'+day+'</span>';
    }

}
