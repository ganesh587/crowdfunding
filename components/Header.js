import React from "react";
import { Menu, Input } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu
      style={{
        marginTop: "10px",
        backgroundColor: "orange",
        height: "4rem",
        color: "white",
        marginBottom: "3rem",
      }}
    >
      <Link route='/'>
        <a className='item'>CrowdFunding</a>
      </Link>

      <Menu.Menu position='right'>
        {/* <Menu.Item>
        <Input icon='search' placeholder='Search...' />
      </Menu.Item> */}
        <Link route='/'>
          <a className='item'>Campaigns</a>
        </Link>

        <Link route='/campaigns/new'>
          <a className='item'>+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
