class ScryptPools {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        app.log("Init ScryptPools class.");
        this.app = app;
        this.dependency = dependency;
        this.hashrate = 0;
    }

    /**
     * Run module.
     */
    run() {
        var translate = this.app.getI18n();
        let current = this;
        $.ajax(chrome.extension.getURL('modals/scrypt-pools.html')).done(function(modal){

            modal = translate.processText(modal);

            $.ajax('https://www.litecoinpool.org/pools').done(function(data) {
                $('body').append(modal);
                $('#scrypt-row').find('.fa-cog').closest('a').after('<a data-toggle="modal" data-target="#scryptModal"><i class="fa fa-pie-chart fa-lg" style="color: #f5b35c"></i></a>');

                // Pools table and blocks table
                var table = $(data).find('tr.minor-row').closest('table');
                var blocks = $(data).find('td.nowrap').closest('table');

                // Calculate start date and end date, get difference
                var startDate = moment($(blocks).find('tr').has("td.nowrap").first().html(), 'YYYY-MM-DD HH:mm');
                var endDate = moment($(blocks).find('tr').has("td.nowrap").last().html(), 'YYYY-MM-DD HH:mm');
                var totalHours = Math.ceil(moment.duration(startDate.diff(endDate)).asHours());

                // Create data object
                var pools = [];
                $.each($(table).find('tr').has('td > span'), function(i, element) {
                    var pool = $(element).find('td:eq(1)').text();
                    pools.push({
                        pool: pool,
                        hashrate: $(element).find('td.value').html(),
                        blocks: current.getBlocks(blocks, pool)
                    });
                });

                // Render table content
                var output = '';
                $.each(pools, function (i, el) {
                    output += '<tr>' +
                        '<td>'+el.pool+'</td>'+
                        '<td>'+ el.hashrate+'</td>' +
                        '<td>'+ el.blocks +'</td>' +
                        '</tr>';
                });

                $('#scrypt_pool_rows').html(output);

            });
        });
    }

    /**
     * Get number of block per hour by pool name.
     * @param  string pool
     * @return float
     */
    getBlocks(blocks, pool) {
        return parseInt($(blocks).find('td:contains("'+pool+'")').length);
    }

}
