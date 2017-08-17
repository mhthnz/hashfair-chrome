class ScryptHashrate {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        app.log("Init ShaHashrate class.");
        this.app = app;
        this.dependency = dependency;
    }

    /**
     * Run module.
     */
    run() {
        let scrypt = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSCRYPT);
        if (scrypt.length == 0) {
            this.app.log("Can't run ScryptHashrate. Not found scrypt payouts.");
            return;
        }
        let payout = scrypt[0];
        let scrypt_block = $('#scrypt-row').find('h3.no-margins');
        $(scrypt_block).find('br').remove();
        let scryptHashrate = (parseFloat(payout.getClearPayout()) / parseFloat(this.dependency.hashrate)).toFixed(8);
        $('<span style="font-weight:bold;">1 MH = ~ ' + scryptHashrate + ' BTC <span class="badge badge-warning">$'+(scryptHashrate * this.app.btcPrice).toFixed(2)+'</span></span>').insertBefore($(scrypt_block));

    }

}
