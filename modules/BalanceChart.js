class BalanceChart {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        this.app = app;
        this.dependency = dependency;
        this.payoutsItems = null;
        this.runDate = new Date().getTime();
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
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
    }

    makeChartData() {
        let payouts = this.getPayouts();
        if (payouts.length === 0) {
            return false;
        }

        let language = this.app.getI18n();

        var chartData = [
            {
                label: "BTC "+language.t("charts", "payout")+"&nbsp;",
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

        let usdPayouts = this.payoutsToUsd(payouts);
        if (usdPayouts.length > 0) {
            chartData.push({
                label: "USD "+language.t("charts", "payout"),
                data: usdPayouts,
                yaxis: 3,
                color: "#f5b35c",
                lines: {
                    lineWidth: 3,
                    show: true,
                    fill: false,
                    fillColor: {
                        colors: [{
                            opacity: 1
                        }, {
                            opacity: 0
                        }]
                    }
                }
            })
        }

        let leftPayouts = this.getLeft();
        if (leftPayouts.length > 0) {
            chartData.push({
                label: "% " +language.t("charts", "maintenance"),
                data: leftPayouts,
                yaxis: 4,
                color: "#f5b35c",
                lines: {
                    lineWidth: 1,
                    show: true,
                    fill: false,
                    fillColor: {
                        colors: [{
                            opacity: 0.1
                        }, {
                            opacity: 0
                        }]
                    }
                }
            });
        }

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

    payoutsToUsd(payouts) {
        var newArr = JSON.parse(JSON.stringify(payouts));
        for (var index = 0; index < newArr.length; index++) {
            newArr[index][1] = (parseFloat(newArr[index][1]) * this.app.btcPrice).toFixed(2);
        }
        return newArr;
    }

    getLeft()
    {
        let payouts = this.getPayoutsItems();

        // Make array for chart
        var result = [];
        for (let prop in payouts) {

            let date = (moment(prop, "DD.MM.YYYY").toDate().getTime());
            let price = 0;
            let maintenance = 0;
            for (var i = 0; i < payouts[prop].length; i++) {
                price = price + parseFloat(payouts[prop][i].payout);
                maintenance = maintenance + parseFloat(payouts[prop][i].maintenance);
            }
            result.push([date, parseFloat((maintenance / price) * 100).toFixed(2)]);

            // Cut array
            if (result.length > 14) {
                result.splice(14, result.length - 14);
            }
        }
        return result;
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
        let payouts = this.getPayoutsItems();

        // Make array for chart
        var result = [];
        for (let prop in payouts) {

            let date = (moment(prop, "DD.MM.YYYY").toDate().getTime());
            let price = 0;
            for (var i = 0; i < payouts[prop].length; i++) {
                price = price + parseFloat(payouts[prop][i].getClearPayout());
            }
            result.push([date, parseFloat(price).toFixed(8)]);

            // Cut array
            if (result.length > 14) {
                result.splice(14, result.length - 14);
            }
        }
        return result;
    }

    getPayoutsItems()
    {
        if (this.payoutsItems === null) {
            this.payoutsItems = this.app.getPayouts().groupByDate(PayoutsCollection.typeBTC);
        }
        return this.payoutsItems;
    }

}
