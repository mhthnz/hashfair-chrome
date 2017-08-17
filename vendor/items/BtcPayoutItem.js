/**
 * Item class for SHA and SCRYPT payouts.
 */
class BtcPayoutItem extends Item
{
    /**
	 * Constructor of class.
     * @param {string} date 		Format: DD.MM.YYYY
     * @param {float} payout		Payout in btc
     * @param {float} maintenance	Maintenance in btc
     */
    constructor(date, payout, maintenance, type)
	{
		super();
		this.date = date;
		this.payout = payout;
		this.maintenance = maintenance;
		if (type !== BtcPayoutItem.typeScrypt && type !== BtcPayoutItem.typeSha) {
			console.log("Error type:", type);
		}
		this.type = type;
	}

	/**
	 * To verify that the current class matches the received.
	 * @param {Item} item
	 * @return boolean
	 */
	equal(item)
	{
		return this.date === item.date && this.payout === item.payout && this.maintenance === item.maintenance;
	}

    /**
	 * Get clear payout in btc.
     * @return {float}
     */
	getClearPayout()
	{
		return (this.payout - this.maintenance).toFixed(8);
	}

    /**
	 * Scrypt type.
     * @return {string}
     */
	static get typeScrypt()
	{
		return 'SCRYPT';
	}

    /**
	 * Sha type.
     * @return {string}
     */
    static get typeSha()
    {
        return 'SHA';
    }
}