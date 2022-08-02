import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x7fCbFA0f4D18D568D07d57578ebDe0Ca893c3494"
);
// console.log(instance);

export default instance;
