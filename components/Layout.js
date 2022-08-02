import React from "react";
import Header from "./Header";
import Head from "next/head";
import { Container } from "semantic-ui-react";

const Layout = (props) => {
  return (
    <Container
      style={{
        backgroundColor: "black",
        width: "100vw",
        height: "100vh",
        padding: "2rem 5rem ",
        border: "2px solid orange",
        // backgroundImage:
        //   'url("https://c4.wallpaperflare.com/wallpaper/146/943/791/monochrome-abstract-digital-art-wallpaper-preview.jpg")',
        // backgroundRepeat: "no-repeat",
        // objectFit: "cover",
      }}
    >
      <Head>
        <link
          rel='stylesheet'
          href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css'
        ></link>
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
export default Layout;
