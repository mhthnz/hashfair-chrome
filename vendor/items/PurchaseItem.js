class PurchaseItem extends Item
{
	constructor(date, type, quantity, paid, method) {
		super();
		this.date = date;
		this.type = type;
		this.quantity = quantity;
		this.paid = paid;
		this.method = method;
	}

	static get typeSHA() {
		return 'SHA';
	}

	static get typeSCRYPT() {
		return 'SCRYPT';
	}

	static get typeETH() {
		return 'ETH';
	}

	static get typeDASH() {
		return 'DASH';
	}

	static get methodPaysystems () {
		return 'PAYSYSTEMS';
	}

	static get methodBalance() {
		return 'BALANCE';
	}
}
