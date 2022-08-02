import React, { Component } from "react";
import {
  Button,
  Table,
  Icon,
  Modal,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import { Link, Router } from "../../../routes";
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";
// 0xba96c66101b699cb93b2267f222f0e131b45b050;

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    return { address, requests, requestCount, approversCount };
  }
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: "",
      description: "",
      recipient: "",
      loading: false,
      errorMessage: "",
    };
  }
  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    const style = {
      backgroundColor: "black",
      color: "white",
      marginTop: "2rem",
      border: "1px solid orange",
      textAlign: "center",
    };

    return (
      <Layout>
        <span style={{ fontSize: "1.3rem", color: "white" }}>Requests</span>
        <Modal
          style={{ marginTop: "-20rem" }}
          basic
          onClose={() => this.setState({ open: false })}
          onOpen={() => this.setState({ open: true })}
          open={this.state.open}
          size='small'
          trigger={
            <Button
              style={{ float: "right", border: "2px solid white" }}
              animated
              secondary
            >
              <Button.Content visible>Add Request</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow right' />
              </Button.Content>
            </Button>
          }
        >
          <Modal.Content>
            <Button
              style={{ marginBottom: "3rem" }}
              basic
              color='red'
              inverted
              onClick={() => this.setState({ open: false })}
            >
              <Icon name='remove' />
            </Button>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
              <Form.Field>
                <label style={{ color: "white" }}>Description</label>
                <Input
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                  placeholder='enter Description of request'
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "white" }}>Value in Ether</label>
                <Input
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                  placeholder='enter amount you require'
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "white" }}>Recipient</label>
                <Input
                  value={this.state.recipient}
                  onChange={(event) =>
                    this.setState({ recipient: event.target.value })
                  }
                  placeholder="enter recipient's wallet address"
                />
              </Form.Field>
              <Message error header='Oops!' content={this.state.errorMessage} />
              <Button
                style={{
                  backgroundColor: "orange",
                  color: "black",
                  marginTop: "2rem",
                }}
                secondary
                loading={this.state.loading}
              >
                Create
              </Button>
            </Form>
          </Modal.Content>
        </Modal>

        <Table style={{ marginTop: "3rem", border: "2px solid orange" }}>
          <Header>
            <Row>
              <HeaderCell style={style}>ID</HeaderCell>
              <HeaderCell style={style}>Description</HeaderCell>
              <HeaderCell style={style}>Amount</HeaderCell>
              <HeaderCell style={style}>Recipient</HeaderCell>
              <HeaderCell style={style}>Approval Count</HeaderCell>
              <HeaderCell style={style}>Approve</HeaderCell>
              <HeaderCell style={style}>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div
          style={{
            color: "orange",

            padding: "1rem",
          }}
        >
          Found {this.props.requestCount} requests
        </div>
      </Layout>
    );
  }
}

export default RequestIndex;
