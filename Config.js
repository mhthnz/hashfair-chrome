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
    initialized: false
};

// List of modules which you want to load
var applicationModules = [
    {
        module: 'BalanceChart',
        description: "Show clear balance chart.",
    },
    {
        module: 'Balance',
        description: "Show clear balance and bitcoin price.",
    },
    {
        module: 'Donate',
        description: "",
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
                description: 'Show clear SHA chart revenue per 1 TH/s.',
                dependency: {hashrate: btc_total_hashrate}
            });
            applicationModules.push({
                module: 'ShaForecast',
                description: 'Show clear SHA revenue forecast.'
            });
            applicationModules.push({
                module: 'ShaHashrate',
                description: 'Show clear SHA hashrate for now.',
                dependency: {hashrate: btc_total_hashrate}
            });
            applicationModules.push({
                module: 'LastShaPayout',
                description: 'Show clear last sha payout'
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
                description: 'Show clear SCRYPT chart revenue per 1 MH/s.',
                dependency: {hashrate: scrypt_total_hashrate}
            });
            applicationModules.push({
                module: 'ScryptForecast',
                description: 'Show clear SCRYPT revenue forecast.'
            });
            applicationModules.push({
                module: 'ScryptHashrate',
                description: 'Show clear SCRYPT hashrate for now.',
                dependency: {hashrate: scrypt_total_hashrate}
            });
            applicationModules.push({
                module: 'LastScryptPayout',
                description: 'Show clear last scrypt payout'
            });
        }
    }

    // If we have either sha or scrypt contract
    if (scrypt_total_hashrate > 0 || btc_total_hashrate > 0) {
        applicationModules.push({
            module: 'LastSummaryBtcPayout',
            description: 'Show clear last scrypt payout'
        });
    }

    // Apply modules
    if (applicationModules.length > 0) {
        applicationConfig.modules = applicationModules;
    }

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
    $(document).ready(function(){
        (new Application(applicationConfig)).run();
    });
});




