class WithdrawalItem extends Item
{
	constructor(date, type, amount) {
		super();
		this.date = date;
		this.type = type;
		this.amount = amount;
	}

	static get typeBTC() {
		return 'BTC';
	}

	static get typeETH() {
		return 'ETHASH';
	}

	static get typeDASH() {
		return 'DASH';
	}

}
