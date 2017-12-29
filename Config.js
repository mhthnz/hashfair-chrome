/**
 * Config for application class.
 *
 * Contain modules for load:
 * applicationConfig.modules = [{module}, {module}];
 *
 * Contain current btc price by hashflare:
 * applicationConfig.btcPrice = 3213;
 *
 * Contain /panel/history page source:
 * applicationConfig.history = '';
 *
 * @type {{}}
 */
var applicationConfig = {
};

// List of modules which you want to load
var applicationModules = [
    {
        module: 'BalanceChart'
    },
    {
        module: 'Balance'
    },
    {
        module: 'ShaPools'
    },
    {
        module: 'ScryptPools'
    }
];

// Get history page
$.ajax('https://hashflare.io/panel/history').done(function (content) {

    // Parse sha hashrate
    let btc_block = $('#sha-row').find('h3.no-margins');
    let btc_total_hashrate = 0;
    if ($(btc_block).length) {
        btc_total_hashrate = parseFloat($(btc_block).parent('div').find('h1').html());

        // Add dependent modules from sha hashrate
        if (btc_total_hashrate > 0) {
            applicationModules.push({
                module: 'ShaChart',
                dependency: {hashrate: btc_total_hashrate}
            });
            applicationModules.push({
                module: 'ShaForecast'
            });
            applicationModules.push({
                module: 'ShaHashrate',
                dependency: {hashrate: btc_total_hashrate}
            });
            applicationModules.push({
                module: 'LastShaPayout'
            });
        }
    }

    // Parse scrypt hashrate
    let scrypt_block = $('#scrypt-row').find('h3.no-margins');
    let scrypt_total_hashrate = 0;
    if ($(scrypt_block).length) {
        scrypt_total_hashrate = parseFloat($(scrypt_block).parent('div').find('h1').html());

        // Add dependent modules from sha hashrate
        if (scrypt_total_hashrate > 0) {
            applicationModules.push({
                module: 'ScryptChart',
                dependency: {hashrate: scrypt_total_hashrate}
            });
            applicationModules.push({
                module: 'ScryptForecast'
            });
            applicationModules.push({
                module: 'ScryptHashrate',
                dependency: {hashrate: scrypt_total_hashrate}
            });
            applicationModules.push({
                module: 'LastScryptPayout'
            });
        }
    }

    // Parse dash hashrate
    let dash_block = $('#dash-row').find('h3.no-margins');
    let dash_total_hashrate = 0;
    if ($(dash_block).length) {
        dash_total_hashrate = parseFloat($(dash_block).parent('div').find('h1').html());

        // Add dependent modules from dash hashrate
        if (dash_total_hashrate > 0) {
            applicationModules.push({
                module: 'DashBalance'
            });
        }
    }

    // Parse eth hashrate
    let eth_block = $('#ether-row').find('h3.no-margins');
    let eth_total_hashrate = 0;
    if ($(eth_block).length) {
        eth_total_hashrate = parseFloat($(eth_block).parent('div').find('h1').html());

        // Add dependent modules from eth hashrate
        if (eth_total_hashrate > 0) {
            applicationModules.push({
                module: 'EthBalance'
            });
        }
    }

    // Parse zec hashrate
    let zec_block = $('#zcash-row').find('h3.no-margins');
    let zec_total_hashrate = 0;
    if ($(zec_block).length) {
        zec_total_hashrate = parseFloat($(zec_block).parent('div').find('h1').html());

        // Add dependent modules from eth hashrate
        if (zec_total_hashrate > 0) {
            applicationModules.push({
                module: 'ZecBalance'
            });
        }
    }

    // If we have either sha or scrypt contract
    if (scrypt_total_hashrate > 0 || btc_total_hashrate > 0) {
        applicationModules.push({
            module: 'LastSummaryBtcPayout'
        });
        applicationModules.push({
            module: 'LastAvgBtc'
        });
        /*
        $.ajax({url: 'https://www.coingecko.com/en/chart/bitcoin/usd.json', async: false}).done(function(data) {
            let dates = {};
            for(var i = 0; i < data.stats.length; i++) {
                if (data.stats[i][0] < 1388534400000) {
                    continue;
                }
                dates[moment(data.stats[i][0]).format('DD.MM.YY')] = data.stats[i][1];
            }

        });
        */
        applicationModules.push({
            module: 'PaybackBtc'
        });
    }


    if (typeof OPTIONS != 'undefined') {

        // Filter modules by options
        if (OPTIONS.hasOwnProperty('modules') && Array.isArray(OPTIONS.modules) && OPTIONS.modules.length > 0) {
            applicationModules = applicationModules.filter(function(element) {
                return OPTIONS.modules.includes(element.module);
            });
        }

        // Language
        if (OPTIONS.hasOwnProperty('languageStrategy')) {
            if (OPTIONS.languageStrategy === Options.autodetect) {
                let elem = $(document).find("li>a:contains('English'):first").closest("ul").find(".active").find("a");
                if (elem.length > 0) {
                    applicationConfig.language = $(elem).attr("href").replace(/\?lang=([a-z]{3})/, '$1');
                }
            } else {
                applicationConfig.language = OPTIONS.languageStrategy;
            }
        }
    }

    // Apply modules
    if (applicationModules.length > 0) {
        applicationConfig.modules = applicationModules;
    }
    applicationConfig.modules.push({
        module: 'Donate'
    });
    // Parse btc price
    let btcPrice = parseFloat($('#btcprice').val());

    // Apply btc price
    if (btcPrice > 0) {
        applicationConfig.btcPrice = btcPrice;
    }

    // Apply history page
    if ($(content).find(".ibox-content").length > 0) {
        applicationConfig.historyPage = content;
    }

    // Run application
    (new Application(applicationConfig)).run();

});




