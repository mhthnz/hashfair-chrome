class ShaChart {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        app.log("Init ShaChart class.");
        this.app = app;
        this.dependency = dependency;
    }

    /**
     * Run module.
     */
    run() {
        let data = this.makeChartData();
        if (data === false) {
            this.app.log("Not find sha payouts.");
            return;
        }
        $("#flot-profit-sha").empty();
        $.plot($("#flot-profit-sha"), data, this.makeChartOptions());
    }

    makeChartData() {
        let payouts = this.getPayouts();
        if (payouts.length == 0) {
            return false;
        }
        return [
            {
                label: "BTC per 1 TH/s",
                data: payouts,
                color: "#DBEAF9",
                bars: {
                    show: true,
                    align: "center",
                    barWidth: 24 * 60 * 60 * 600,
                    lineWidth: 0,
                    fillColor: "rgba(245, 179, 92, 0.78)"
                },
                highlightColor: "rgba(245, 179, 92, 0.6)"
            }
        ];
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
                    color: "#f5f5f5",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: "Arial",
                    axisLabelPadding: 3
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
        var sha = payouts.getSpecifyItems(PayoutsCollection.typeSHA);
        if (!this.dependency.hasOwnProperty('hashrate') || this.dependency.hashrate == 0) {
            this.app.log("Sha hashrate is not defined or equal zero.");
            return [];
        }
        var result = [];

        // Get last 7 sha payouts
        for (var i = 0; i < sha.length && i < 7; i++) {
            result.push([
                moment(sha[i].date, "DD.MM.YYYY").toDate().getTime(),
                (parseFloat(sha[i].getClearPayout()) / parseFloat(this.dependency.hashrate)).toFixed(8)
            ]);
        }
        return result;
    }

}
