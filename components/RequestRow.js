import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    const style = {
      border: "1px solid grey",
      textAlign: "center",
    };

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell style={style}>{id + 1}</Cell>
        <Cell style={style}>{request.description}</Cell>
        <Cell style={style}>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell style={style}>{request.recipient}</Cell>
        <Cell style={style}>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell style={style}>
          {request.complete ? null : (
            <Button color='green' basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell style={style}>
          {request.complete ? null : (
            <Button color='teal' basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
