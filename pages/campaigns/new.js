import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message, Grid, GridRow } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
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

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    Ptitle: "",
    Pdescription: "",
    errorMessage: "",
    loading: false,
    name: "",
  };
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
  render() {
    return (
      <Layout>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h3 style={{ color: "white" }}>Create Campaign</h3>
              <Form
                onSubmit={this.onSubmit}
                error={!!this.state.errorMessage}
                style={{ marginTop: "2rem", width: "70%" }}
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
            </Grid.Column>
            <Grid.Column
              style={{
                color: "white",
                border: "1px solid orange",
                borderRadius: "10px",
                padding: "2rem",
                marginLeft: "-2rem",
              }}
            >
              <SimpleImageSlider
                width={"90%"}
                height={504}
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

export default CampaignNew;
