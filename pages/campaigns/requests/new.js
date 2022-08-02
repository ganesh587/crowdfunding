import React, { Component } from "react";
import { Form, Button, Message, Input, Grid } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

import { Slide } from "react-slideshow-image";

const slideImages = [
  {
    url: "",
    caption: "Slide 1",
  },
  {
    url: "",
    caption: "Slide 2",
  },
  {
    url: "",
    caption: "Slide 3",
  },
];

import SimpleImageSlider from "react-simple-image-slider";

const images = [
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: "",
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
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

  render() {
    const style = {
      color: "white",
    };
    return (
      <Layout>
        <Button style={{ color: "white" }}>
          <Link route={`/campaigns/${this.props.address}/requests`}>Back</Link>
        </Button>

        <Grid style={{ marginTop: "2rem" }} columns={2} divided>
          <Grid.Row>
            <Grid.Column style={{ width: "40%" }}>
              <h3 style={{ color: "orange" }}>Create a Request</h3>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                  <label style={style}>Description</label>
                  <Input
                    value={this.state.description}
                    onChange={(event) =>
                      this.setState({ description: event.target.value })
                    }
                    placeholder='enter Description of request'
                  />
                </Form.Field>
                <Form.Field>
                  <label style={style}>Value in Ether</label>
                  <Input
                    value={this.state.value}
                    onChange={(event) =>
                      this.setState({ value: event.target.value })
                    }
                    placeholder='enter amount you require'
                  />
                </Form.Field>
                <Form.Field>
                  <label style={style}>Recipient</label>
                  <Input
                    value={this.state.recipient}
                    onChange={(event) =>
                      this.setState({ recipient: event.target.value })
                    }
                    placeholder="enter recipient's wallet address"
                  />
                </Form.Field>
                <Message
                  error
                  header='Oops!'
                  content={this.state.errorMessage}
                />
                <Button
                  style={{ backgroundColor: "orange", color: "black" }}
                  secondary
                  loading={this.state.loading}
                >
                  Create
                </Button>
              </Form>
            </Grid.Column>
            <Grid.Column
              style={{
                color: "white",
                border: "2px solid orange",
                borderRadius: "10px",
                padding: "2rem",
                margin: "-4rem 0 0 8rem",
              }}
            >
              <SimpleImageSlider
                width={"90%"}
                height={454}
                images={images}
                showBullets={true}
                showNavs={true}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default RequestNew;
