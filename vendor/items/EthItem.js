/**
 * Ethereum item.
 */
class EthItem extends Item
{
    /**
	 * Constructor of class.
     * @param {string} date 		Format: DD.MM.YYYY
     * @param {float} payout		Payout in eth
     */
    constructor(date, payout)
	{
        super();
		this.date = date;
		this.payout = payout;
	}

	/**
	 * To verify that the current class matches the received.
	 * @param {Item} item
	 * @return boolean
	 */
	equal(item)
	{
		return this.date === item.date && this.payout === item.payout;
	}

}