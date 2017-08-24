/**
 * Application class.
 * Need for loading modules and save common module data (history page, btc price, etc...)
 *
 * @property {string}	historyPage 	Content of history page
 * @property {int} 	btcPrice 	Current btc price
 * @property {array}  modules 	Array of modules.
 */
class Application 
{

	/**
	 * Constructor of application class.
	 * Init class properties.
	 * @param  {[]} config Array of config contains:
	 *  
	 * config.modules = ([
	 *        {module: 'chart', dependency: Object},
	 *        {module: 'balance'},
	 *         ... etc
	 * ])
	 * config.btcPrice = 1231
	 * config.historyPage = Html code
	 * config.language = 'eng'
     *
	 */
    constructor(config = {}) 
    {
        /**
         * Internationalization class.
         * @type {I18n}
         */
        this.i18n = null;

        /**
         * Content of history page.
         * @type {string}
         */
        this.historyPage = '';
 
        /**
         * Current btc price.
         * @type {int}
         */
        this.btcPrice = 0;
 
        /**
         * Modules for loading.
         * @type {[]} of object
        */
        this.modules = [];
 
        /**
         * Collection of ContractItem.
         * @type {ContractsCollection}
         */
        this.contracts = new ContractsCollection();

        /**
         * Was initialized contracts?
         * @type {boolean}
         */
        this.contractsInit = false;

        /**
         * Collection of PurchaseItem.
         * @type {PurchasesCollection}
         */
        this.purchases = new PurchasesCollection();

        /**
         * Was initialized purchases?
         * @type {boolean}
         */
        this.purchasesInit = false;

        /**
         * Collection of WithdrawalItem.
         * @type {WithdrawalsCollection}
         */
        this.withdrawals = new WithdrawalsCollection();

        /**
         * Was initialized withdrawals?
         * @type {boolean}
         */
        this.withdrawalsInit = false;

        /**
         * Collection of BtcPayoutItem and PayoutItem.
         * @type {PayoutsCollection}
         */
        this.payouts = new PayoutsCollection();

        /**
         * Was initialized payouts?
         * @type {boolean}
         */
        this.payoutsInit = false;

        /**
         * View debug data in console.
         * @type boolean
         */
        this.verbose = false;

        // Fill properties
        if (config.hasOwnProperty('historyPage') && config.historyPage != '') {
            this.historyPage = config.historyPage;
        }
        if (config.hasOwnProperty('btcPrice') && config.btcPrice > 0) {
            this.btcPrice = config.btcPrice;
        }
        if (config.hasOwnProperty('modules') && Array.isArray(config.modules)) {
            this.modules = config.modules;
        }
        if ((config.hasOwnProperty('verbose') && config.verbose == 1) || window.location.search.match(new RegExp('verbose=1'))) {
            this.verbose = true;
        }
        if (config.hasOwnProperty('language')) {
            this.i18n = new I18n(config.language);
        } else {
            this.i18n = new I18n();
        }
        this.log("Init Application class.");
    }
    
    /**
     * If verbose = true - print debug data in console.
     * @param  string text Debug text
     */
    log(text) 
    {
        if (this.verbose) {
            console.log(text);
        }
    }

    /**
     * Return internationalization class.
     * @returns {I18n}
     */
    getI18n()
    {
        return this.i18n;
    }

    /**
     * Lazyload getter for contracts
     * @return ContractsCollection
     */
    getContracts() 
    {
        if (!this.contractsInit) {
            this.initContracts();
        }
        return this.contracts;
    }
 
    /**
     * Lazyload getter for purchases.
     * @return instance of Contract collection
     */
    getPurchases() 
    {
        if (!this.purchasesInit) {
            this.initPurchases();
        }
        return this.purchases;
    }
 
    /**
     * Lazyload getter for withdrawals.
     * @return instance of Contract collection
     */
    getWithdrawals() 
    {
        if (!this.withdrawalsInit) {
            this.initWithdrawals();
        }
        return this.withdrawals;
    }

    /**
     * Lazyload getter for payouts.
     * @return instance of Payout collection
     */
    getPayouts()
    {
        if (!this.payoutsInit) {
            this.initPayouts();
        }
        return this.payouts;
    }
 
    /**
     * Check class properties and run modules.
     */
    run() 
    {
        if (this.historyPage == '') {
            this.log("Can't run application. History page not found.");
            return;
        }
        if (this.btcPrice == 0) {
            this.log("Can't run application. Btc price is not defined.");
            return;
        }
        if (!Array.isArray(this.modules)) {
            this.log("Can't run application. Expect array of object.");
            return;
        }
        if (this.i18n == null) {
            this.log("Can't run application. Language not found.");
        }

        // Load modules
        for (var i = 0; i < this.modules.length; i++) {
            let module = this.modules[i];
            if (!module.hasOwnProperty('module')) {
                this.log("Can't find module property on " + (i+1) + " object. Skipping.");
                continue;
            }
            this.loadModule(module);
        }
    }
 
    /**
     * Load module from `modules` folder. Dependency is optional.
     * @param  object module {module: 'moduleName', dependency: Object}
     */
    loadModule(module) 
    {
        this.log("Loading module: " + module.module);
        var file = chrome.extension.getURL('modules/' + module.module + '.js');
        var app = this;
        var dependency =  module.hasOwnProperty('dependency') ? module.dependency : null;
        $.ajax({url:file}).done(function(script) {
            eval(
                script + "\r\n\
                (new " + module.module + "(app, dependency)).run();\r\n\
            ");
        });
    }

    /**
     * Initialize payouts collection.
     */
    initPayouts()
    {
        // Get table
        var rows = $(this.historyPage).find('th:contains("(ZEC)"):first').closest('table').find('tbody').find('tr');
        if ($(rows).length == 0) {
            this.payoutsInit = true;
            return;
        }

        var app = this;

        // Fill payouts items
        $.each(rows, function(index, element) {

            // Get name of tr
            var title = $($(element).find("td:nth-child(1)")[0]).html();
            if (title !== "Scrypt payout (BTC)" && title !== "SHA-256 payout (BTC)" && title !== "X11 payout (DASH)" && title !== "ETHASH payout (ETH)") {
                return;
            }

            // Parse date.
            var date = $($(element).find('td:nth-child(2)')[0]).html();
            date = date.replace(/([^\s]+)\s*[^\s]*/, '$1');

            // Add item to collection
            var scrypt = false;
            switch(title) {

                // Btc
                case 'Scrypt payout (BTC)':
                    scrypt = true;
                case 'SHA-256 payout (BTC)': {

                    // Calculate maintenance
                    var maintenance = app.getMaintenance(date, rows, scrypt === false ? "SHA-256 maintenance (BTC)" : "Scrypt maintenance (BTC)");
                    if (maintenance === false) {
                        return;
                    }
                    var amount_el = $(element).find('td:nth-child(3)')[0];
                    var dirtyPrice = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
                    app.payouts.addItem(new BtcPayoutItem(date, parseFloat(dirtyPrice), parseFloat(maintenance), scrypt === false ? BtcPayoutItem.typeSha : BtcPayoutItem.typeScrypt));
                    break;
                }

                // Dash
                case 'X11 payout (DASH)': {
                    var amount_el = $(element).find('td:nth-child(7)')[0];
                    var price = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
                    app.payouts.addItem(new DashItem(date, parseFloat(price)));
                    break;
                }

                // Ethereum
                case 'ETHASH payout (ETH)': {
                    var amount_el = $(element).find('td:nth-child(5)')[0];
                    var price = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
                    app.payouts.addItem(new EthItem(date, parseFloat(price)));
                }
            }
        });
        this.payoutsInit = true;
    }

    /**
     * Get maintenance from scrypt and sha.
     * @param {string} date Format: DD.MM.YYYY
     * @param {[]} rows
     * @param {string}text
     * @returns {float|boolean}
     */
    getMaintenance(date, rows, text)
    {
        var tds = $(rows).find('td:contains("'+date+'")');
        if (tds.length === 0) {
            return false;
        }
        var maintenance = 0.0;
        $.each(tds, function(i, el) {
            if ($(el).parent('tr').find('td:contains("' + text + '")').length === 0) {
                return;
            } else {
                var amount_el = $(el).parent('tr').find('td:nth-child(3)')[0];
                maintenance = $(amount_el).find('span').length ? $($(amount_el).find('span')[0]).html() : $(amount_el).html();
                return false;
            }
        });
        if (maintenance > 0) {
            return maintenance;
        }
        return false;
    }
}