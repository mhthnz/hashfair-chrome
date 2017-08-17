class ShaHashrate{

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
        let sha = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSHA);
        if (sha.length == 0) {
            this.app.log("Can't run ShaHashrate. Not found sha payouts.");
            return;
        }
        let payout = sha[0];
        let btc_block = $('#sha-row').find('h3.no-margins');
        $(btc_block).find('br').remove();
        let btcHashrate = (parseFloat(payout.getClearPayout()) / parseFloat(this.dependency.hashrate)).toFixed(8);
        $('<span style="font-weight:bold;">1 TH = ~ ' + btcHashrate + ' BTC <span class="badge badge-warning">$'+(btcHashrate * this.app.btcPrice).toFixed(2)+'</span></span>').insertBefore($(btc_block));

    }

}
