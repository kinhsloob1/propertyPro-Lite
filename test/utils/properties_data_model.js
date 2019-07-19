const properties = [
  {
    decription: 'A good property located at lekki island',
    price: 35000000.00,
    state: 'lagos',
    city: 'lekki',
    address: 'plot 456, lagos island lekki... Behind pleasure park',
    type: '3 bedroom',
    option: 'sale',
    images: [
      '/path/to/an/image.jpg',
      '/path/to/another/image.jpg',
    ],
    location: {
      lat: 67.90,
      log: 300.345,
    },
  },
  {
    decription: 'A good property located at bonny island',
    price: 88000000.00,
    state: 'rivers',
    city: 'bonny',
    address: 'plot 54, bonny nlng road. rivers state',
    type: '2 bedroom',
    option: 'sale',
    images: [
      '/path/to/an/image.jpg',
      '/path/to/another/image.jpg',
    ],
    location: {
      lat: 82.90,
      log: 120.345,
    },
  }, {
    decription: 'A good property located at benin',
    price: 2800000.00,
    state: 'edo',
    city: 'benin',
    address: 'plot 194, edo - lokoja express way benin city',
    type: '4 bedroom',
    option: 'sale',
    images: [
      '/path/to/an/image.jpg',
      '/path/to/another/image.jpg',
    ],
    location: {
      lat: 43.90,
      log: 191.532,
    },
  },
];

export const [firstProperty, secondProperty, thirdProperty] = properties;
export default properties;
