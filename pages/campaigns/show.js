import React, { Component } from "react";
import { Card, Grid, Button, Icon, Popup } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Table } from "semantic-ui-react";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";
import ContributerRow from "../../components/ContributerRow";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    const contributersCount = await campaign.methods
      .getContributersCount()
      .call();
    const contributers = await Promise.all(
      Array(parseInt(contributersCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.contributers(index).call();
        })
    );
    console.log(summary);

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      Ptitle: summary[5],
      Pdescription: summary[6],
      status: summary[7],
      topBalances: summary[8],
      contributers,
      highContribution: summary[9],
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
      Ptitle,
      Pdescription,
      status,
      highContribution,
      topBalances,
    } = this.props;

    const items = [
      {
        header: Ptitle,
        meta: "Project title",
        description: "",
        style: { border: "3px solid orange" },
      },
      {
        header: Pdescription,
        meta: "Project description",
        description: "",
        style: { border: "3px solid orange" },
      },

      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager or creator of this campaign can create requests to withdraw money",
        style: { overflowWrap: "break-word", border: "3px solid orange" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
        style: { border: "3px solid orange" },
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
        style: { border: "3px solid orange" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
        style: { border: "3px solid orange" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
        style: { border: "3px solid orange" },
      },

      {
        header: web3.utils.fromWei(topBalances, "ether"),
        meta: "Highest Contribution",
        description: highContribution,
        style: { border: "3px solid orange", width: "27rem" },
      },
    ];
    console.log(items);

    return <Card.Group items={items} />;
  }
  renderRows() {
    return this.props.contributers.map((contributer, index) => {
      return (
        <ContributerRow
          key={index}
          id={index}
          contributer={contributer}
          contributersCount={this.props.contributersCount}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    const style = {
      backgroundColor: "black",
      color: "white",
      border: "1px solid white",
      marginTop: "2rem",
    };
    return (
      <Layout>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h3 style={{ marginBottom: "2rem", color: "white" }}>
                Campaign Details
              </h3>
            </Grid.Column>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button
                    style={{ float: "right", border: "1px solid white" }}
                    animated
                    secondary
                  >
                    <Button.Content visible>View Requests</Button.Content>
                    <Button.Content hidden>
                      <Icon name='arrow right' />
                    </Button.Content>
                  </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid>
          <Grid.Row color={"whitesmoke"}>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
              <Table
                style={{
                  marginTop: "3rem",
                  border: "2px solid grey",
                }}
              >
                <Header>
                  <Row>
                    <HeaderCell style={style}>ID</HeaderCell>
                    <HeaderCell style={style}>Contributer</HeaderCell>
                    <HeaderCell style={style}>Amount</HeaderCell>
                  </Row>
                </Header>
                <Body>{this.renderRows()}</Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
