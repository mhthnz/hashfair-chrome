class BalanceChart {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        app.log("Init BalanceChart class.");
        this.app = app;
        this.dependency = dependency;
    }

    /**
     * Run module.
     */
    run() {
        let data = this.makeChartData();
        if (data === false) {
            this.app.log("Sha or Scrypt payouts not found.");
            return;
        }
        $("#flot-balance").empty();
        $.plot($("#flot-balance"), data, this.makeChartOptions());
    }

    makeChartData() {
        var payouts = this.getPayouts();

        if (payouts.length === 0) {
            return false;
        }

        var chartData = [
            {
                label: "BTC payout&nbsp;",
                data: payouts,
                color: "#f5b35c",
                bars: {
                    show: true,
                    align: "center",
                    barWidth: 24 * 60 * 60 * 600,
                    lineWidth: 0,
                    fill: 1.0,
                    fillColor: "rgba(245, 179, 92, 0.78)"
                },
                yaxis: 1,
                highlightColor: "rgba(245, 179, 92, 0.6)"
            }
        ];

        $.each($('script'), function (index, element) {
            var result = $(element).html().match(/var\s*balances\s*=\s*([^;]+);/);
            if (result) {
                chartData.push({
                    label: "BTC balance",
                    data: eval(result[1]),
                    yaxis: 2,
                    color: "#5A93c4",
                    lines: {
                        lineWidth: 2,
                        show: true,
                        fill: false,
                        fillColor: {
                            colors: [{
                                opacity: 0.2
                            }, {
                                opacity: 0
                            }]
                        }
                    },
                    splines: {
                        show: false,
                        tension: 0.6,
                        lineWidth: 1,
                        fill: 0.1
                    }
                });
                return false;
            }
        });
        return chartData;
    }

    makeChartOptions() {
        return {
            xaxis: {
                mode: "time",
                tickSize: [1, "day"],
                tickLength: 0,
                axisLabel: "Date",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Arial",
                axisLabelPadding: 10,
                color: "#d5d5d5",
                timeformat: "%d.%m"
            },
            yaxes: [
                {
                    position: "left",
                    //max: 1070,
                    color: "#f5f5f5",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: "Arial",
                    axisLabelPadding: 3
                },
                {
                    position: "right",
                    color: "#f5f5f5",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: "Arial",
                    axisLabelPadding: 67
                },
                {
                    position: "left",
                    color: "#f5b35c",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: "Arial",
                    axisLabelPadding: 67
                },
                {
                    position: "right",
                    color: "#f5b35c",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: "Arial",
                    axisLabelPadding: 67
                }
            ],
            legend: false,
            grid: {
                hoverable: true,
                borderWidth: 0
            },
            tooltip: true,
            tooltipOpts: {
                content: tooltipper,
                xDateFormat: "%d.%m.%y"
            }
        };
    }

    getPayouts() {
        var payouts = this.app.getPayouts();
        var btc = payouts.getSpecifyItems(PayoutsCollection.typeBTC);
        var days = [];

        // Btc amount group by date
        for (var i = 0; i < btc.length; i++) {
            var added = false;
            for (var j = 0; j < days.length; j++) {
                if (days[j].date === btc[i].date) {
                    days[j].amount = parseFloat(days[j].amount) + parseFloat(btc[i].getClearPayout());
                    added = true;
                    break;
                }
            }
            if (!added) {
                days.push({date: btc[i].date, amount: parseFloat(btc[i].getClearPayout())});
            }
        }

        // Make array for chart
        var result = [];
        for (var i = 0; i < days.length; i++) {
            let date = (moment(days[i].date, "DD.MM.YYYY").toDate().getTime());
            result.push([date, parseFloat(days[i].amount).toFixed(8)]);
        }

        // Cut array
        if (result.length > 14) {
            result.splice(14, result.length - 1);
        }

        return result;

    }

}
