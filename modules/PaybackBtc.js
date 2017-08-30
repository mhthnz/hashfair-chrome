class PaybackBtc {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        this.app = app;
        this.dependency = dependency;
        this.runDate = new Date().getTime();
    }

    /**
     * Run module.
     */
    run() {
        let translate = this.app.getI18n();
        let purchases = this.app.getPurchases().getSpecifyItems(PurchaseItem.typeSHA).concat(this.app.getPurchases().getSpecifyItems(PurchaseItem.typeSCRYPT));
        let withdrawals = this.app.getWithdrawals().getSpecifyItems(WithdrawalItem.typeBTC);

        let balanceUsd = this.getBalanceUsd();
        // Purchases
        let totalPurchasedUsd = this.getTotalPurchasedUsd(purchases);
        let totalPurchasedUsdWithoutReinvest = this.getTotalPurchasedUsd(purchases, false);
        let totalPurchases = purchases.length;

        // Withdrawals
        let totalWithdrawals = withdrawals.length;
        let totalWithdrawalsBtc = this.getTotalWithdrawalsBtc(withdrawals);
        let totalWithdrawalsBtcWithComission = this.getTotalWithdrawalsBtc(withdrawals, 0.00060000);
        let totalWithdrawalsBtcInUsd = (totalWithdrawalsBtc * this.app.btcPrice).toFixed(2);
        let totalWithdrawalsBtcWithComissionInUsd = (totalWithdrawalsBtcWithComission * this.app.btcPrice).toFixed(2);


        // Payback
        let paybackPercent = (((parseFloat(totalWithdrawalsBtcInUsd) + parseFloat(balanceUsd)) / parseFloat(totalPurchasedUsd)) * 100).toFixed(2);
        let paybackPercentWithComission = (((parseFloat(totalWithdrawalsBtcWithComissionInUsd) + parseFloat(balanceUsd)) / parseFloat(totalPurchasedUsd)) * 100).toFixed(2);
        let paybackPercentWithoutReinvest = (((parseFloat(totalWithdrawalsBtcInUsd) + parseFloat(balanceUsd)) / parseFloat(totalPurchasedUsdWithoutReinvest)) * 100).toFixed(2);
        let paybackPercentWithComissionWithoutReinvest = (((parseFloat(totalWithdrawalsBtcWithComissionInUsd) + parseFloat(balanceUsd)) / parseFloat(totalPurchasedUsdWithoutReinvest)) * 100).toFixed(2);

        let daysBlock = '';
        if (paybackPercentWithComission < 100) {
            let lastPayoutBtc = this.getLastPayoutBtc();
            let paybackAmount1 = Math.ceil((totalPurchasedUsd - (totalPurchasedUsd * (paybackPercentWithComission / 100))) / (lastPayoutBtc * this.app.btcPrice));
            daysBlock = `<tr>
                            <td>{payback:payback_complete}:</td>
                            <td class="value">{payback:payback_complete_days:{days:${paybackAmount1}}}</td>
                        </tr>`;
        }

        let daysBlockWithoutReinvest = '';
        if (paybackPercentWithComissionWithoutReinvest < 100) {
            let lastPayoutBtc = this.getLastPayoutBtc();
            let paybackAmount1 = Math.ceil((totalPurchasedUsd - (totalPurchasedUsd * (paybackPercentWithComissionWithoutReinvest / 100))) / (lastPayoutBtc * this.app.btcPrice));
            daysBlockWithoutReinvest = `<tr>
                            <td>{payback:payback_complete}:</td>
                            <td class="value">{payback:payback_complete_days:{days:${paybackAmount1}}}</td>
                        </tr>`;
        }


        // Insert css to page
        this.insertCss(`
            table.btc-payback-stats th{
                color: #f5b35c;
            }
            table.btc-payback-stats{
                margin-bottom:10px;
                display: inline-block;
                margin-left:10px;
                margin-right:10px;
                vertical-align:top;
            }
            table.btc-payback-stats td{
                padding-right:5px;
                padding-left:5px;
            }
            
            table.btc-payback-stats td.value{
                font-weight:bold;
            }

        `);

        $("#flot-balance").closest("div.flot-chart").parent('div').append(translate.processText(`
            <div class="row">
                <div style="border:1px solid #f5b35c;padding:10px;border-radius:10px;margin-top:10px;min-height:80px;">
                    <div style="float:left;padding:0 5px;margin:-20px 0 0 30px;background:#f5b35c;border-radius:10px;color:white;font-weight: bold;">{payback:btc_payback}</div>
                    <div style="display:flex;flex-direction:row;justify-content: space-around;align-items:flex-start;">
                    <table class="btc-payback-stats">
                        <tr>
                            <th class="text-center" colspan="2">{payback:purchases}:</th>
                        </tr>
                        <tr>
                            <td>{payback:number_of_purchases}:</td>
                            <td class="value">${totalPurchases}</td>
                        </tr>
                        <tr>
                            <td>{payback:total_invested}:</td>
                            <td class="value">${totalPurchasedUsd}$</td>
                        </tr>
                        <tr>
                            <td>{payback:invested_without_reinvest}:</td>
                            <td class="value">${totalPurchasedUsdWithoutReinvest}$</td>
                        </tr>
                    </table>
                    
                    <table class="btc-payback-stats">
                        <tr>
                            <th class="text-center" colspan="2">{payback:withdrawals}:</th>
                        </tr>
                        <tr>
                            <td>{payback:number_of_withdrawals}:</td>
                            <td class="value">${totalWithdrawals}</td>
                        </tr>
                        <tr>
                            <td>{payback:total_out_amount}:</td>
                            <td class="value">${totalWithdrawalsBtc} BTC <span class="badge badge-warning">$${totalWithdrawalsBtcInUsd}</span></td>
                        </tr>
                        <tr>
                            <td>{payback:amount_with_comission}:</td>
                            <td class="value">${totalWithdrawalsBtcWithComission} BTC <span class="badge badge-warning">$${totalWithdrawalsBtcWithComissionInUsd}</span></td>
                        </tr>
                    </table>
                    
                    <table class="btc-payback-stats">
                        <tr>
                            <th class="text-center" colspan="2">{payback:payback}:</th>
                        </tr>
                        <tr>
                            <td>{payback:payback_percent}:</td>
                            <td class="value">${paybackPercent}%</td>
                        </tr>
                        <tr>
                            <td>{payback:payback_percent_with_comssion}:</td>
                            <td class="value">${paybackPercentWithComission}%</td>
                        </tr>
                        ${daysBlock}
                        <th class="text-center" colspan="2">{payback:payback_without_reinvest}:</th>
                        <tr>
                            <td>{payback:payback_percent}:</td>
                            <td class="value">${paybackPercentWithoutReinvest}%</td>
                        </tr>
                        <tr>
                            <td>{payback:payback_percent_with_comssion}:</td>
                            <td class="value">${paybackPercentWithComissionWithoutReinvest}%</td>
                        </tr>
                        ${daysBlockWithoutReinvest}
                    </table>
                    </div>
                </div>
            </div>
        `));
        this.app.log(this.constructor.name + " loaded in: " + (new Date().getTime() - this.runDate) + " ms.");
    }

    getTotalPurchasedUsd(purchases, reinvest = true) {
        let result = 0;
        for (var i = 0; i < purchases.length; i++) {
            if (!reinvest && purchases[i].method === PurchaseItem.methodBalance) {
                continue;
            }
            result = purchases[i].paid + result;
        }
        return result.toFixed(2);
    }

    getTotalWithdrawalsBtc(withdrawals, comission = false) {
        let result = 0;
        for (var i = 0; i < withdrawals.length; i++) {
            if (comission !== false && comission < withdrawals[i].amount) {
                result = (withdrawals[i].amount - comission) + result;
            } else {
                result = withdrawals[i].amount + result;
            }
        }
        return result.toFixed(8);
    }

    getLastPayoutBtc()
    {
        let scrypt = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSCRYPT);
        let sha = this.app.getPayouts().getSpecifyItems(PayoutsCollection.typeSHA);
        let payout = 0;

        if (scrypt.length > 0) {
            payout += parseFloat(scrypt[0].getClearPayout());
        }
        if (sha.length > 0) {
            payout += parseFloat(sha[0].getClearPayout());
        }
        return payout;
    }

    getTotalWithdrawalsUsd(withdrawals, comission = false) {
        let result = 0;
        for (var i = 0; i < withdrawals.length; i++) {
            let btc = 0;
            if (comission !== false && comission < withdrawals[i].amount) {
                btc = (withdrawals[i].amount - comission);
            } else {
                btc = withdrawals[i].amount;
            }
            let btcRate = this.app.btcPrice;
            result = btc * btcRate;
        }
        return result.toFixed(2);
    }

    getBalanceUsd()
    {
        let btc = $('h2.m-l-md.m-b-none:first');
        if (!$(btc).length) {
            this.app.log("Can't find balance block.");
            return 0;
        }
        return (parseFloat($(btc).html()) * parseFloat(this.app.btcPrice)).toFixed(2);
    }

    insertCss(css)
    {
        $(`<style type='text/css'>${css}</style>`).appendTo("head");
    }


}
