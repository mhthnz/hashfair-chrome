$(document).ready(function () {
    $('#sha-row').find('.fa-cog').closest('a').after('<a data-toggle="modal" data-target="#chartModal"><i class="fa fa-pie-chart fa-lg" style="color: #f5b35c"></i></a>');
    $('body').append(
        '<div class="modal fade" id="chartModal" tabindex="-1" role="dialog" aria-labelledby="chartModalLabel" aria-hidden="true" data-replace="true">\
            <div class="modal-dialog modal-lg">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\
                        <h4 class="modal-title">Mining Pools Hashrate</h4>\
                    </div>\
                    <div class="modal-body">\
                    <div class="row">\
                        <div class="col-md-12" id="pools_chart">\
                            <table class="table">\
                                <thead>\
                                <tr>\
                                    <th width="100">Pool</th>\
                                    <th width="100">Hashrate</th>\
                                    <th width="100"></th>\
                                    <th width="100">Lucky</th>\
                                    <th width="120">Your Share, ‱</th>\
                                    <th>Distribution</th>\
                                </tr>\
                                </thead>\
                                <tbody id="pool_rows"></tbody>\
                                \
                            </table>\
                        </div>\
                    </div>\
                    </div>\
                    \
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    </div>\
                </div>\
            </div>\
        </div>');


    var hashrate_str = $('#sha-row').find('.fa-flash').closest('div').find('h1').html();
    if(hashrate_str){
        var hashrate_num = parseFloat(hashrate_str);
        var hashrate_pow = 1;
        if(hashrate_str.indexOf("TH/s") > 0){
            hashrate_pow = 1000;
        }
        var hashrate = hashrate_num * hashrate_pow;
    }

    function basic_point(val) {
        if(val){
            return (hashrate / val ).toFixed(2);
        }else{
            return '---'
        }
    }

    function diff(val) {
        var icon = '';
        var color = '';
        if(val){
            if(val > 0){
                icon = 'fa-arrow-up';
                color = 'green'
            }else{
                icon = 'fa-arrow-down';
                color = 'red';
            }
            text = (val * 100).toFixed(2);
            return '<div style="color:'+ color +'"><i class="fa '+ icon +'"></i> '+ text +'%</div>';
        }else{
            return '---'
        }
    }

    function scale(val) {
        if(val){
            percent = parseInt(val * 100);
            return '<div class="progress" style="margin: 0">' +
                '<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="'+ percent +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ percent +'%"></div>';
        }else{
            return '';
        }
    }

    $.ajax('https://btc.com/stats/api/realtime/poolHashrate').done(function(data){
       var output = '';
       $.each(data.data, function (i, el) {
           output += '<tr>' +
               '<td><a href="'+ el.link +'" target="_blank">'+el.relayed_by+'</a></td>' +
               '<td>'+ (el.real_hashrate ? (el.real_hashrate + ' PH/s') : '---') +'</td>' +
               '<td>'+ diff(el.diff_24h) +'</td>' +
               '<td>'+ (el.lucky ? ((el.lucky * 100).toFixed(2) + '%') : '---') +'</td>' +
               '<td>'+ basic_point(parseFloat(el.hashrate)) +'</td>' +
               '<td>'+ scale(el.cur2max_percent) +'</td>' +
               '</tr>';
       });
       $('#pool_rows').html(output);
    });

    // Litecoin pools
    $.ajax('https://www.litecoinpool.org/pools').done(function(data) {

        $('#scrypt-row').find('.fa-cog').closest('a').after('<a data-toggle="modal" data-target="#chartScryptModal"><i class="fa fa-pie-chart fa-lg" style="color: #f5b35c"></i></a>');

        $('body').append(
        '<div class="modal fade" id="chartScryptModal" tabindex="-1" role="dialog" aria-labelledby="chartModalLabel" aria-hidden="true" data-replace="true">\
            <div class="modal-dialog modal-lg">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\
                        <h4 class="modal-title">Scrypt Pools Hashrate</h4>\
                    </div>\
                    <div class="modal-body">\
                    <div class="row">\
                        <div class="col-md-12" id="pools_chart">\
                            <table class="table">\
                                <thead>\
                                <tr>\
                                    <th width="100">Pool</th>\
                                    <th width="100">Hashrate</th>\
                                    <th width="100">Blocks per hour</th>\
                                </tr>\
                                </thead>\
                                <tbody id="scrypt_pool_rows"></tbody>\
                                \
                            </table>\
                        </div>\
                    </div>\
                    </div>\
                    \
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                    </div>\
                </div>\
            </div>\
        </div>');

        // Pools table and blocks table
        var table = $(data).find('tr.minor-row').closest('table');
        var blocks = $(data).find('td.nowrap').closest('table');

        // Calculate start date and end date, get difference
        var startDate = moment($(blocks).find('tr').has("td.nowrap").first().html(), 'YYYY-MM-DD HH:mm');
        var endDate = moment($(blocks).find('tr').has("td.nowrap").last().html(), 'YYYY-MM-DD HH:mm');
        var totalHours = Math.ceil(moment.duration(startDate.diff(endDate)).asHours());
        
        /**
         * Get number of block per hour by pool name.
         * @param  string pool 
         * @return float
         */
        function getBlocks(pool)
        {
            return parseInt($(blocks).find('td:contains("'+pool+'")').length);
        }

        // Create data object
        var pools = [];
        $.each($(table).find('tr').has('td > span'), function(i, element) {
            var pool = $(element).find('td:eq(1)').text();
            pools.push({
                pool: pool,
                hashrate: $(element).find('td.value').html(),
                blocks: getBlocks(pool)
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