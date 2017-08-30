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
    async loadModule(module)
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
     * Initialize withdrawals collection.
     */
    initWithdrawals()
    {
        let time = new Date().getTime();
        var table = $(this.historyPage).find('table').eq(2);
        let app = this;

        // Each all rows
        $(table).find("tr").each(function(i, v){

            let row = [];
            let valid = true;

            // Each all cols
            $(this).children('td').each(function(j, vv){
                let text = '';
                // If date
                if (j === 1) {
                    text = $(this).text();
                    text = text.substr(0, 8);
                } else if (j === 3) {
                    text = $(this).html();
                    if (text.indexOf('text-success') + 1 == 0) {
                        valid = false;
                    }
                } else {
                    text = $(this).text();
                }
                row[j] = text;
            });

            // Add item to collection
            if (row.length > 0 && valid) {
                let type = app.getWithdrawalType(row[2]);
                let amount =  parseFloat(row[2]);
                let date = row[1];
                app.withdrawals.addItem(new WithdrawalItem(date, type, amount));
            }
        });
        this.log("Withdrawals init in " + (new Date().getTime() - time) + " ms.");
        this.withdrawalsInit = 1;
    }

    getWithdrawalType(text)
    {
        if (text.indexOf('BTC') + 1 > 0) {
            return WithdrawalItem.typeBTC;
        } else if (text.indexOf('DASH') + 1 > 0) {
            return WithdrawalItem.typeDASH;
        } else if (text.indexOf('ETH') + 1 > 0) {
            return WithdrawalItem.typeETH;
        }
    }

    /**
     * Initialize purchases collection.
     */
    initPurchases()
    {
        let time = new Date().getTime();
        var table = $(this.historyPage).find('table').eq(1);
        let app = this;

        // Each all rows
        $(table).find("tr").each(function(i, v){

            let row = [];
            let valid = true;

            // Each all cols
            $(this).children('td').each(function(j, vv){
                let text = '';
                // If date
                if (j === 5) {
                    text = $(this).text();
                    text = text.substr(0, 8);
                } else if (j === 6) {
                    text = $(this).html();
                    if (text.indexOf('text-success') + 1 == 0) {
                        valid = false;
                    }
                } else {
                    text = $(this).text();
                }
                row[j] = text;
            });

            // Add item to collection
            if (row.length > 0 && valid) {
                let type = app.getPurchaseType(row[1]);
                let quantity = parseFloat(row[2]);
                let paid =  parseFloat(row[3].replace(',', ''));
                let method = (row[4].indexOf('balance transfer') + 1) ? PurchaseItem.methodBalance: PurchaseItem.methodPaysystems;
                let date = row[5];
                app.purchases.addItem(new PurchaseItem(date, type, quantity, paid, method));
            }
        });
        this.log("Purchases init in " + (new Date().getTime() - time) + " ms.");
        this.purchasesInit = 1;
    }

    getPurchaseType(text)
    {
        if (text.indexOf('X11') + 1 > 0) {
            return PurchaseItem.typeDASH;
        } else if (text.indexOf('SHA-256') + 1 > 0) {
            return PurchaseItem.typeSHA;
        } else if (text.indexOf('Scrypt') + 1 > 0) {
            return PurchaseItem.typeSCRYPT;
        } else if (text.indexOf('ETHASH') + 1 > 0) {
            return PurchaseItem.typeETH;
        }
        this.log("Unknown type: " + text);
    }

    /**
     * Initialize payouts collection.
     */
    initPayouts()
    {
        let time = new Date().getTime();

        // Get table
        var table = $(this.historyPage).find('table').last();

        var data = {};

        $(table).find("tr").each(function(i, v){
            let row = [];
            $(this).children('td').each(function(j, vv){
                let text = '';
                // If date
                if (j === 1) {
                    text = $(this).text();
                    text = text.substr(0, 8);
                } else {
                    text = $(this).text();
                }
                row[j] = text;
            });
            if (row.length > 0) {
                let date = row[1];
                if (!data.hasOwnProperty(date)) {
                    data[date] = [];
                }
                data[date].push(row);
            }
        });


        var app = this;

        // Fill payouts items
        for(var prop in data) {

            let date = prop;

            for (var i = 0; i < data[date].length; i++) {

                let row = data[date][i];

                // Get name of tr
                var title = row[0];
                if (title !== "Scrypt payout (BTC)" && title !== "SHA-256 payout (BTC)" && title !== "X11 payout (DASH)" && title !== "ETHASH payout (ETH)") {
                    continue;
                }

                // Add item to collection
                var scrypt = false;
                switch(title) {

                    // Btc
                    case 'Scrypt payout (BTC)':
                        scrypt = true;
                    case 'SHA-256 payout (BTC)': {

                        // Calculate maintenance
                        let main = new Date().getTime();
                        var maintenance = app.getMaintenance(data[date], scrypt === false ? "SHA-256 maintenance (BTC)" : "Scrypt maintenance (BTC)");
                        if (maintenance === false) {
                            return;
                        }
                        var price = row[2];
                        app.payouts.addItem(new BtcPayoutItem(date, parseFloat(price), parseFloat(maintenance), scrypt === false ? BtcPayoutItem.typeSha : BtcPayoutItem.typeScrypt));
                        break;
                    }

                    // Dash
                    case 'X11 payout (DASH)': {
                        var price = row[6];
                        app.payouts.addItem(new DashItem(date, parseFloat(price)));
                        break;
                    }

                    // Ethereum
                    case 'ETHASH payout (ETH)': {
                        var price = row[4];
                        app.payouts.addItem(new EthItem(date, parseFloat(price)));
                    }
                }
            }

        };
        this.log("Payouts init in " + (new Date().getTime() - time) + " ms.");
        this.payoutsInit = true;
    }

    /**
     * Get maintenance from scrypt and sha.
     * @param {string} date Format: DD.MM.YYYY
     * @param {[]} rows
     * @param {string}text
     * @returns {float|boolean}
     */
    getMaintenance(rows, text)
    {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].includes(text)) {
                return rows[i][2];
            }
        }
        return false;
    }
}