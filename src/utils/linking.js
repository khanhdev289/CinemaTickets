const linking = {
  prefixes: ['mychat://'],
  config: {
    screens: {
      TicketScreen: {
        path: 'ticket/:_id',
        parse: {_id: _id => `${_id}`},
      },
      Welcome: {path: 'welcome'},
      Login: {path: 'login'},
      // Add other screens as needed...
    },
  },
};

export default linking;
