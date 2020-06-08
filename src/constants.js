const constants = {

    GET_CATEGORIES_URL: 'https://api.mercadolibre.com/categories/',
    GET_ITEMS_URL: 'https://api.mercadolibre.com/sites/MLA/search?q=',
    GET_ITEM_URL: 'https://api.mercadolibre.com/items/',
    GET_PICTURES_URL: 'https://api.mercadolibre.com/items?ids=',
    getDescriptionUrl: (id) => `https://api.mercadolibre.com/items/${id}/description`,
    UNKNOWN_ERROR_CODE:  'unknown_error',
    UNKNOWN_ERROR_MESSAGE:  'Unknown error.',
    WRONG_PARAMS_CODE:  'wrong_params',
    WRONG_PARAMS_MESSAGE:  'Wrong params.',
};

module.exports = constants;