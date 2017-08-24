/**
 * Payouts collection for Item instances.
 */
class PayoutsCollection extends Collection
{
    /**
     * Constructor of collection.
     */
    constructor()
    {
        super();
    }

    /**
     * Sha type of payout item.
     * @returns {string}
     */
    static get typeSHA()
    {
        return 'SHA';
    }

    /**
     * Scrypt type of payout item.
     * @returns {string}
     */
    static get typeSCRYPT()
    {
        return 'SCRYPT';
    }

    /**
     * Include SHA and SCRYPT currencies.
     * @returns {string}
     */
    static get typeBTC()
    {
        return 'BTC';
    }


    /**
     * Ethereum type of items.
     * @returns {string}
     */
    static get typeETH()
    {
        return 'BTC';
    }

    /**
     * Dash type of items.
     * @returns {string}
     */
    static get typeDASH()
    {
        return 'DASH';
    }

    /**
     * Get items by type.
     * @param {string} type
     */
    getSpecifyItems(type)
    {
        var items = this.getItems();
        var result = [];
        for(var i = 0; i < items.length; i++) {
            switch(type) {
                case PayoutsCollection.typeBTC: {
                    if (items[i] instanceof BtcPayoutItem) {
                        result.push(items[i]);
                    }
                    break;
                }
                case PayoutsCollection.typeSCRYPT: {
                    if (items[i] instanceof BtcPayoutItem && items[i].type === BtcPayoutItem.typeScrypt) {
                        result.push(items[i]);
                    }
                    break;
                }
                case PayoutsCollection.typeSHA: {
                    if (items[i] instanceof BtcPayoutItem && items[i].type === BtcPayoutItem.typeSha){
                        result.push(items[i]);
                    }
                    break;
                }
                case PayoutsCollection.typeETH: {
                    if (items[i] instanceof EthItem) {
                        result.push(items[i]);
                    }
                    break;
                }
                case PayoutsCollection.typeDASH: {
                    if (items[i] instanceof DashItem) {
                        result.push(items[i]);
                    }
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Get payouts group by date.
     * @returns {{}}
     */
    groupByDate(type = null)
    {
        var items = type === null ? this.getItems() : this.getSpecifyItems(type);
        var result = {};

        for(var i = 0; i < items.length; i++) {
            let date = items[i].date;
            if (!result.hasOwnProperty(date)) {
                result[date] = [];
            }
            result[date].push(items[i]);
        }
        return result;
    }

}
