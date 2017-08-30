/**
 * Withdrawals collection for Item instances.
 */
class WithdrawalsCollection extends Collection
{
    getSpecifyItems(type) {
        let result = [];
        let items = this.getItems();
        for(var i = 0; i < items.length; i++) {
            if (items[i].type === type) {
                result.push(items[i]);
            }
        }
        return result;
    }
}
