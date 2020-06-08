const axios = require('axios');

const { getItems, getItem } = require('./items.controller');

const { calculateDecimals, calculateLimit } = require('./utils.controller');

jest.mock('./utils.controller', () => {
  return {
    calculateDecimals: jest.fn(() => 0),
    calculateLimit: jest.fn(),
  };
});


jest.mock('axios');

describe('items controller', () => {
  const getItemData = {
    data: {
      id: 'MLA123456',
      title: 'Mochila Genial',
      price: 1000,
      currency_id: 'ARS',
      condition: 'new',
      sold_quantity: 0,
      shipping: {
          free_shipping: false
      },
      pictures: [{url: 'http://www.image.com/hey.jpg'}],
    },
  };

  const getItemDescriptionData = {
      data: {
        plain_text: 'Esta es una mochila increible!',
    },
  };

  const getItemsData = {
    data: {
      results: [{
        id: 'MLA123456',
        title: 'Mochila Genial',
        price: 1000,
        currency_id: 'ARS',
        condition: 'new',
        shipping: {
            free_shipping: false
        },
        address: {
          state_name: 'Mendoza',
        },
      }],
    },
  };

  const getItemsCategories = {
    data: {
      path_from_root: [
        {id: 1, name: 'Ropa y Accesorios'},
        {id: 2, name: 'Mochilas'},
      ],
    },
  };

  const getItemsPictures = {
    data: [{
      body: {
        id: 'MLA123456',
        pictures: [{url: 'http://www.myimg.com'}],
      },
    }],
  };

  it('checks getItem returns data properly', async () => {
    axios.get.mockResolvedValueOnce(getItemData);
    axios.get.mockResolvedValueOnce(getItemDescriptionData);

    const mReq = {params: {id: '123456'}};
    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItem(mReq, mRes);

    expect(axios.get).toBeCalled();
    expect(mRes.json).toBeCalledWith({
        id: 'MLA123456',
        title: 'Mochila Genial',
        price: {
            currency: 'ARS',
            amount: 1000,
            decimals: 0,
        },
        condition: 'new',
        sold_quantity: 0,
        free_shipping: false,
        picture: 'http://www.image.com/hey.jpg',
        description: 'Esta es una mochila increible!',
    });

  });

  it('checks getItem returns an error with wrong params', async () => {
    const mReq = {params: {lala: '123'}};
    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItem(mReq, mRes);
    expect(mRes.json).toBeCalledWith({
        error: 'wrong_params',
        message: 'Wrong params.',
        status: 400,
    });
  });

  it('checks getItems returns data properly', async () => {
    axios.get.mockResolvedValueOnce(getItemsData);
    axios.get.mockResolvedValueOnce(getItemsCategories);
    axios.get.mockResolvedValueOnce(getItemsPictures);

    const mReq = {
      query: {
        q: 'mochila',
        limit: 4,
      },
    };
    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItems(mReq, mRes);

    expect(axios.get).toBeCalled();
    expect(mRes.json).toBeCalledWith({
      categories: ['Ropa y Accesorios', 'Mochilas'],
      items: [{
        id: 'MLA123456',
        title: 'Mochila Genial',
        price: {
            currency: 'ARS',
            amount: 1000,
            decimals: 0,
        },
        condition: 'new',
        free_shipping: false,
        picture: 'http://www.myimg.com',
        state: 'Mendoza',
      }],
    });

  });

  it('checks getItems returns empty data', async () => {
    axios.get.mockResolvedValueOnce({data: { results: []}});

    const mReq = {
      query: {
        q: 'mochila',
        limit: 4,
      },
    };
    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItems(mReq, mRes);

    expect(axios.get).toBeCalled();
    expect(mRes.json).toBeCalledWith({
      categories: [],
      items: [],
    });

  });

  it('checks getItems with wrong params', async () => {
    const mReq = {
      query: {
        wrong: 'mochila',
      },
    };

    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItems(mReq, mRes);

    expect(mRes.json).toBeCalledWith({
        error: 'wrong_params',
        message: 'Wrong params.',
        status: 400,
    });
  });

  it('checks getItems returns unkown when we the promise failed', async () => {
    axios.get.mockImplementation(() => Promise.reject({error: 'bad request'}));
    const mReq = {
      query: {
        q: 'mochila',
      },
    };

    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItems(mReq, mRes);

    expect(mRes.json).toBeCalledWith({
        error: 'unknown_error',
        message: 'Unknown error.',
        status: 500,
    });
  });

  it('checks getItems returns a proper error when we got all the error data from ML endpoint', async () => {
    axios.get.mockImplementation(() => Promise.reject({
        response: {
          data: {
            error: 'wrong_data',
            message: 'Bad query data...',
            status: 400,
          },
        },
    }));

    const mReq = {
      query: {
        q: 'mochila',
      },
    };

    const mRes = {status: jest.fn().mockReturnThis(), json: jest.fn()};

    await getItems(mReq, mRes);

    expect(mRes.json).toBeCalledWith({
      error: 'wrong_data',
      message: 'Bad query data...',
      status: 400,
    });
  });

});
