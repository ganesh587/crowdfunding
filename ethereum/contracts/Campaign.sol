pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract CampaignFactory {
    struct CampaignInfo{
        address campadd;
        string title;
        string description;
        string creatorname;
    }
    CampaignInfo[] public campaignsinfo;
    function createCampaign(uint minimum,string title,string description,string creator) public {
        address newCampaign = new Campaign(minimum, msg.sender,title,description,creator);
        CampaignInfo memory newCampaignInfo = CampaignInfo({
           campadd: newCampaign,
           title: title,
           description:description,
           creatorname:creator
        });
        campaignsinfo.push(newCampaignInfo);
    }
    function getCampaigns() public view returns (CampaignInfo[]) {
        return campaignsinfo;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    struct Contributer{
        address client;
        uint value;
    }
    Contributer[] public contributers;
    struct TopBalance {
        uint balance;
        address addr;
    }
    TopBalance[10] public topBalances;

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    string public Ptitle;
    string public Pdescription;
    string public creatorname;
    mapping(address => bool) public approvers;
    uint public approversCount;
    bool public status=true;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address creator,string memory title, string memory description,string memory creatorname) public {
        manager = creator;
        minimumContribution = minimum;
        Ptitle=title;
        Pdescription=description;
        creatorname=creatorname;

    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        elaborateTopX(msg.sender, msg.value);
        if(approvers[msg.sender] == false){
            approversCount++;
        }
        Contributer memory newContribution = Contributer({
           client: msg.sender,
           value: msg.value
        });

        contributers.push(newContribution);
    }

    function elaborateTopX(address addr, uint currentValue) private {
        uint i = 0;
        for(i; i < topBalances.length; i++) {
            if(topBalances[i].balance < currentValue) {
                break;
            }
        }
        for(uint j = topBalances.length - 1; j > i; j--) {
            topBalances[j].balance = topBalances[j - 1].balance;
            topBalances[j].addr = topBalances[j - 1].addr;
        }
        topBalances[i].balance = currentValue;
        topBalances[i].addr = addr;
    }


    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
    
    function getSummary() public view returns (
      uint, uint, uint, uint, address,string,string,bool,uint,address,uint,string
      ) {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager,
          Ptitle,
          Pdescription,
          status,
          topBalances[0].balance,
          topBalances[0].addr,
          contributers.length,
          creatorname

        );
    }
    
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    function getContributersCount() public view returns (uint) {
        return contributers.length;
    }
}