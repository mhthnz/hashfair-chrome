class ShaPools {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        app.log("Init ShaPools class.");
        this.app = app;
        this.dependency = dependency;
        this.hashrate = 0;
    }

    /**
     * Run module.
     */
    run() {
        var translate = this.app.getI18n();
        let pool = this;
        $.ajax(chrome.extension.getURL('modals/sha-pools.html')).done(function(modal){

            var hashrate_str = $('#sha-row').find('.fa-flash').closest('div').find('h1').html();
            if(hashrate_str) {
                var hashrate_num = parseFloat(hashrate_str);
                var hashrate_pow = 1;
                if(hashrate_str.indexOf("TH/s") > 0) {
                    hashrate_pow = 1000;
                }
                pool.hashrate = hashrate_num * hashrate_pow;
            }
            modal = translate.processText(modal);
            $.ajax('https://btc.com/stats/api/realtime/poolHashrate').done(function(data) {
                $('body').append(modal);
                var output = '';
                $.each(data.data, function (i, el) {
                    output += '<tr>' +
                        '<td><a href="'+ el.link +'" target="_blank">'+el.relayed_by+'</a></td>' +
                        '<td>'+ (el.real_hashrate ? (el.real_hashrate + ' PH/s') : '---') +'</td>' +
                        '<td>'+ pool.diff(el.diff_24h) +'</td>' +
                        '<td>'+ (el.lucky ? ((el.lucky * 100).toFixed(2) + '%') : '---') +'</td>' +
                        '<td>'+ pool.basic_point(parseFloat(el.hashrate)) +'</td>' +
                        '<td>'+ pool.scale(el.cur2max_percent) +'</td>' +
                        '</tr>';
                });
                $(document).find('#sha_pool_rows').html(output);
                $('#sha-row').find('.fa-cog').closest('a').after('<a data-toggle="modal" data-target="#shaModal"><i class="fa fa-pie-chart fa-lg" style="color: #f5b35c"></i></a>');
            });
        });
    }

    diff(val) {
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
            let text = (val * 100).toFixed(2);
            return '<div style="color:'+ color +'"><i class="fa '+ icon +'"></i> '+ text +'%</div>';
        }else{
            return '---'
        }
    }

    scale(val) {
        if(val){
            let percent = parseInt(val * 100);
            return '<div class="progress" style="margin: 0">' +
                '<div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="'+ percent +'" aria-valuemin="0" aria-valuemax="100" style="width: '+ percent +'%"></div>';
        }else{
            return '';
        }
    }

    basic_point(val) {
        if(val){
            return (this.hashrate / val ).toFixed(2);
        }else{
            return '---'
        }
    }

}
