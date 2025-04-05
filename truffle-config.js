module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Ganache host
      port: 7545,            // Ganache port
      network_id: "5777",    // Match Ganache's network id
    },
  },
  compilers: {
    solc: {
      version: "0.5.16",     // Match your pragma
    }
  }
};
