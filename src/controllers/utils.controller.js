const utilsCtrl = {};

// Max limit of elements for getting items by ids is 20
// (needed for getting bigger pictures).
const MAX_LIMIT = 20;


/**
 * Calculate limit of the getItems request.
 * @param {int} limit Limit of elements.
 */
utilsCtrl.calculateLimit = (limit = MAX_LIMIT) => {
    let currentLimit = limit && parseInt(limit);

    if (currentLimit > 0) {
        currentLimit = currentLimit > MAX_LIMIT ? MAX_LIMIT : currentLimit;
    } else {
        currentLimit = MAX_LIMIT;
    }

    return `&limit=${currentLimit}`;
}

/**
 * Calculate decimals according the amount
 * @param {int} amount Amount (price) of the item.
 */
utilsCtrl.calculateDecimals = (amount = 0) => {
    let rest = amount.toString().split('.')[1];

    if (!rest) {
        rest = 0;
    } else {
        if (rest < 10) {
            rest = parseInt(rest + '0');
        }
    }

    return parseInt(rest);
}

module.exports = utilsCtrl;
