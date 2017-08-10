/**
 * Application class.
 * @param array modules Array of modules objects for loading. Dependencies is optional.
 *
 * config.modules = ([
 *        {module: 'chart', dependencies: Object},
 *        {module: 'balance'},
 *         ... etc
 * ])
 *
 * config.btcPrice = 1231
 *
 * config.historyPage = Html code
 *
 *
*/
function application(config) {

	/**
	 * Content of history page.
	 * @type string
	 */
	this.historyPage = "";

	/**
	 * Current btc price.
	 * @type integer
	 */
	this.btcPrice = 0;

	/**
	 * Modules for loading.
	 * @type array of object
	*/
	this.modules = [];

	/**
	 * Array of contract objects.
	 * If not initialized - null.
	 * @type array|null
	 */
	this.contracts = null;

	/**
	 * Array of purchase objects.
	 * If not initialized - null.
	 * @type array|null
	 */
	this.purchases = null;

	/**
	 * Array of withdrawal objects.
	 * If not initialized - null.
	 * @type array|null
	 */
	this.withdrawals = null;

	/**
	 * Construct of class.
	 */
	function() {
		if (config.historyPage != "") {
			this.historyPage = config.historyPage;
		}
		if (config.btcPrice > 0) {
			this.btcPrice = config.btcPrice;
		}
		if (Array.isArray(config.modules)) {
			this.modules = config.modules;
		}
	}

	/**
	 * Getter for contracts
	 * @return instance of Contract collection
	 */
	this.getContracts = function() {
		return this.contracts;
	}

	/**
	 * Getter for purchases.
	 * @return instance of Contract collection
	 */
	this.getPurchases = function() {
		return this.purchases;
	}

	/**
	 * Getter for withdrawals.
	 * @return instance of Contract collection
	 */
	this.getWithdrawals = function() {
		return this.withdrawals;
	}

	/**
	 * Check class properties and run modules.
	 */
	this.run = function() {
		if (this.historyPage == "") {
			console.log("Can't run application. History page not found.");
			return;
		}
		if (this.btcPrice == 0) {
			console.log("Can't run application. Btc price is not defined.");
			return;
		}
		if (!Array.isArray(this.modules)) {
			console.log("Can't run application. Expect array of object.");
		}
		// Load modules
		for (var i = 0; i < this.modules; i++) {
			var module = this.modules[i];
			if (!module.hasOwnPropery('module')) {
				console.log("Can't find module propery on " + (i+1) + " object. Skipping.");
				continue;
			}
			this.loadModule(module);
		}
	}

	/**
	 * Load module from `modules` folder. Dependencies is optional.
	 * @param  object module {module: 'moduleName', dependencies: Object}
	 */
	this.loadModule = function(module) {
		var file = chrome.extension.getURL('modules/' + module.module);
		this.loadJS(file);
	}
	/**
	 * Load js file to page.
	 * @param  string filename
	 */
	this.loadJS = function(filename) {
		var jsElm = document.createElement("script");
		jsElm.type = "application/javascript";
		jsElm.src = file;
		document.body.appendChild(jsElm);
	}
}