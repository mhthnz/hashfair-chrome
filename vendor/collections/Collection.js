/**
 * Collection for Item instances.
 */
class Collection 
{	
	/**
	 * Constructor of collection. Give array of fields.
	 */
	constructor()
	{
		/**
		 * Items of current collection.
		 * @type array Array of Item instances 
		 */
		this.items = [];

        /**
		 * Sorted already items by date?
         * @type {boolean}
         */
		this.sorted = true;
	}

	/**
	 * Add instance of Item in current collection.
	 * @param Item item
	 */
	addItem(item) 
	{
		if (item instanceof Item) {
			this.items.push(item);
			this.sorted = false;
		} else {
			console.log('Variable item is not a instance of Item class.');
		}
	}

	/**
	 * Add items from array of Item instances.
	 * @param Item[] items 
	 */
	addItems(items) 
	{
		this.sorted = false;
		for(var i = 0; i < items.length; i++) {
			if (items[i] instanceof Item) {
				this.items.push(items[i]);
			} else {
				console.log('Item #' + (i+1) + 'is not a instance of Item class.');
			}
		}
	}

	/**
	 * Remove item by Item instance.
	 * @param Item item
	 */
	removeItem(item)
	{
		if (item instanceof Item) {
			for(var i = 0; i < this.items.length; i++) {
				if (this.items[i].equal(item)) {
					this.items.slice(i, 1);
					break;
				}
			}
		} else {
			console.log('Variable item is not a instance of Item class.');
		}
	}

	/**
	 * Get items.
	 * @return {Item[]}
	 */
	getItems()
	{
		if (!this.sorted) {
			this.sortingByDate();
		}
		return this.items;
	}

    /**
	 * Get count items in collection.
	 * @return {int}
     */
	getCount()
	{
		return this.items.length;
	}

    /**
	 * Sorting items by date.
	 * Date format: DD.MM.YYYY
     */
	sortingByDate()
	{
		this.items.sort(function(a, b) {
			return moment(b.date, "DD.MM.YYYY").toDate() - moment(a.date, "DD.MM.YYYY").toDate();
		});
		this.sorted = true;
	}
}
