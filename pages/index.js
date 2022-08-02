import React, { Component, useState } from "react";
import {
  Card,
  Button,
  Grid,
  Popup,
  Icon,
  Modal,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import Layout from "../components/Layout";
import { Link } from "../routes";
import campaign from "../ethereum/campaign";
import "react-slideshow-image/dist/styles.css";

import { Router } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getCampaigns().call();
    const count = campaigns.length;
    return {
      campaigns,
      count,
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      minimumContribution: "",
      Ptitle: "",
      Pdescription: "",
      errorMessage: "",
      loading: false,
      name: "",
      open: false,
    };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(
          this.state.minimumContribution,
          this.state.Ptitle,
          this.state.Pdescription,
          this.state.name
        )
        .send({
          from: accounts[0],
        });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderCampaigns() {
    const items = this.props.campaigns.map((item) => {
      return {
        header: (
          <div style={{ marginBottom: "1rem" }}>
            <Popup
              content="Campaign's Title"
              trigger={
                <h4
                  style={{
                    display: "inline",
                    fontSize: "2rem",
                    marginBottom: "10px",
                  }}
                >
                  {item[1]}
                </h4>
              }
            />

            <br />
            <Popup
              content="Campaign's Description"
              trigger={
                <h4
                  style={{
                    display: "inline",
                    color: "grey",
                    marginBottom: "10px",
                  }}
                >
                  {item[2]}
                </h4>
              }
            />

            <br />
            <Popup
              content="Campaign's Address"
              trigger={
                <h4
                  style={{
                    display: "inline",
                    fontSize: "0.8rem",
                    marginBottom: "10px",
                    color: "grey",
                  }}
                >
                  {item[0]}
                </h4>
              }
            />
            <br />
            <Popup
              content="Campaign's creator name"
              trigger={
                <h4
                  style={{
                    display: "inline",
                    marginBottom: "10px",
                    fontSize: "0.8rem",
                  }}
                >
                  Created by {item[3]}
                </h4>
              }
            />
          </div>
        ),
        description: (
          <Button animated secondary>
            <Button.Content visible>
              <Link route={`/campaigns/${item[0]}`}>
                <a style={{ textDecoration: "none", color: "white" }}>
                  View Campaign
                </a>
              </Link>
            </Button.Content>
            <Button.Content hidden>
              <Link route={`/campaigns/${item[0]}`}>
                <Icon name='arrow right' />
              </Link>
            </Button.Content>
          </Button>
        ),
        fluid: true,
      };
    });
    const cards = [];
    for (var i = 0; i < items.length; i++) {
      cards.push(
        <Card
          style={{
            padding: "1rem",
            border: "2px solid orange",
            width: "23.5%",
          }}
        >
          {items[i].header}
          {items[i].description}
        </Card>
      );
    }
    return (
      <Card.Group
        style={{
          border: "3px solid white",
          borderRadius: "0.5rem",
          marginTop: "1rem",
          padding: "1rem",
        }}
      >
        {cards}
      </Card.Group>
    );
  }

  render() {
    return (
      <Layout>
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
          }}
        >
          <span style={{ fontSize: "1.7rem", color: "white" }}>
            Available Campaigns
            <Icon style={{ marginLeft: "1rem" }} name='arrow right' />{" "}
            {this.props.count}
          </span>
          <Modal
            style={{ marginTop: "-20rem" }}
            basic
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
            open={this.state.open}
            size='small'
            trigger={
              <Button
                animated
                secondary
                style={{ border: "1px solid white" }}
                floated='right'
              >
                <Button.Content visible>Create Campaign</Button.Content>
                <Button.Content hidden>
                  <Icon name='add circle' />
                </Button.Content>
              </Button>
            }
          >
            <Modal.Content>
              <Button
                basic
                color='red'
                inverted
                onClick={() => this.setState({ open: false })}
              >
                <Icon name='remove' />
              </Button>
              <Form
                onSubmit={this.onSubmit}
                error={!!this.state.errorMessage}
                style={{ width: "70%" }}
              >
                <Form.Field>
                  <label style={{ color: "white", margin: "1rem 0" }}>
                    Minimum Contribution
                  </label>
                  <Input
                    label='wei'
                    labelPosition='right'
                    value={this.state.minimumContribution}
                    placeholder='enter value in wei'
                    onChange={(event) =>
                      this.setState({ minimumContribution: event.target.value })
                    }
                  />
                  <label style={{ color: "white", margin: "1rem 0" }}>
                    Project Title
                  </label>
                  <Input
                    value={this.state.Ptitle}
                    placeholder='enter your project title'
                    onChange={(event) =>
                      this.setState({ Ptitle: event.target.value })
                    }
                  />
                  <label style={{ color: "white", margin: "1rem 0" }}>
                    Project description
                  </label>
                  <Input
                    value={this.state.Pdescription}
                    placeholder='enter your project description'
                    onChange={(event) =>
                      this.setState({ Pdescription: event.target.value })
                    }
                  />
                  <label style={{ color: "white", margin: "1rem 0" }}>
                    Creator Name
                  </label>
                  <Input
                    value={this.state.name}
                    placeholder='enter your name'
                    onChange={(event) =>
                      this.setState({ name: event.target.value })
                    }
                  />
                </Form.Field>
                <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
                />
                <Button
                  style={{ margin: "1rem 0" }}
                  loading={this.state.loading}
                  secondary
                >
                  Create
                </Button>
              </Form>
            </Modal.Content>
          </Modal>

          <div style={{ marginTop: "3rem" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {this.renderCampaigns()}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
