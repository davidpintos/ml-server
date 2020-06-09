const axios = require('axios');

const { calculateDecimals, calculateLimit } = require('./utils.controller');

const {
    GET_CATEGORIES_URL,
    GET_ITEM_URL,
    GET_ITEMS_URL,
    GET_PICTURES_URL,
    getDescriptionUrl,
    UNKNOWN_ERROR_CODE,
    UNKNOWN_ERROR_MESSAGE,
    WRONG_PARAMS_CODE,
    WRONG_PARAMS_MESSAGE,
} = require('../constants');

const itemsCtrl = {};

itemsCtrl.getItems = async (req, res) => {

    if (req.query.q && req.query.q.trim() !== '' ) {
        const limitString = calculateLimit(req.query.limit);

        let response;

        try {
            const {
                data: {
                    results,
                },
            } = await axios.get(`${GET_ITEMS_URL}${req.query.q}${limitString}`);

            if (results.length) {

                const {
                    data: {
                        path_from_root,
                    }
                } = await axios.get(`${GET_CATEGORIES_URL}${results[0].category_id}`);

                const pictureIds = results.map(({id}) => id);

                const {
                    data,
                } = await axios.get(`${GET_PICTURES_URL}${[...pictureIds]}`);

                let picturesList = {};

                data.forEach(({
                    body: {
                        id,
                        pictures,
                    }
                }) => {
                    picturesList = {
                        ...picturesList,
                        [id]: pictures[0].url,
                    };
                });

                const items = results.map(({
                    id,
                    title,
                    price: amount,
                    currency_id: currency,
                    condition,
                    shipping,
                    address: {
                        state_name: state,
                    },
                }) => ({
                    id,
                    title,
                    price: {
                        currency,
                        amount: parseInt(amount.toString().split('.')[0]),
                        decimals: calculateDecimals(amount),
                    },
                    picture: picturesList[id],
                    condition,
                    free_shipping: shipping.free_shipping,
                    state,
                }));


                response = res.json({
                    categories: path_from_root.map(item => item.name),
                    items,
                });

            } else {
                response = res.json({
                    categories: [],
                    items: [],
                });
            }

            return response;

        } catch (error) {
            if (error.response && error.response.data) {
                return res.json(error.response.data);
            } else {
                return res.json({error: UNKNOWN_ERROR_CODE, message: UNKNOWN_ERROR_MESSAGE, status: 500});
            }
        }
    } else {
        return res.json({error: WRONG_PARAMS_CODE, message: WRONG_PARAMS_MESSAGE, status: 400});
    }
};

itemsCtrl.getItem = async (req, res) => {

    if (req.params.id && req.params.id.trim() !== '' ) {
        const idParam = req.params.id;
        try {
            const {
                data: {
                    id,
                    category_id,
                    title,
                    price: amount,
                    currency_id: currency,
                    condition,
                    sold_quantity,
                    shipping: {
                        free_shipping,
                    },
                    pictures,
                },
            } = await axios.get(`${GET_ITEM_URL}${idParam}`);

            const {
                data: {
                    path_from_root,
                }
            } = await axios.get(`${GET_CATEGORIES_URL}${category_id}`);

            const {
                data: {
                    plain_text: description,
                },
            } = await axios.get(getDescriptionUrl(idParam));

            return res.json({
                id,
                title,
                price: {
                    currency,
                    amount: parseInt(amount.toString().split('.')[0]),
                    decimals: calculateDecimals(amount),
                },
                picture: pictures[0].url,
                sold_quantity,
                condition,
                free_shipping,
                description,
                categories: path_from_root.map(item => item.name),
            });
        } catch (error) {
            if (error.response && error.response.data) {
                return res.json(error.response.data);
            } else {
                return res.json({error: UNKNOWN_ERROR_CODE, message: UKNOWN_ERROR_MESSAGE, status: 500});
            }
        }
    } else {
        return res.json({error: WRONG_PARAMS_CODE, message: WRONG_PARAMS_MESSAGE, status: 400});
    }
}


module.exports = itemsCtrl;