import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class ContributerRow extends Component {
  render() {
    const { Row, Cell } = Table;
    const { id, contributer } = this.props;
    const style = {
      border: "1px solid grey",
    };

    return (
      <Row>
        <Cell style={style}>{id}</Cell>
        <Cell style={style}>{contributer.client}</Cell>
        <Cell style={style}>
          {web3.utils.fromWei(contributer.value, "ether")}
        </Cell>
      </Row>
    );
  }
}

export default ContributerRow;
