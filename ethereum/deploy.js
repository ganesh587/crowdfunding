const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "praise sense toy bread ketchup coast erupt pig chaos hammer pool web",
  "https://rinkeby.infura.io/v3/cf145630bd5d4c048c8ed03ee7aaf3c8"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]); //manager account

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "5000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address); //address of newly created campaign factory
  provider.engine.stop();
};
deploy();
