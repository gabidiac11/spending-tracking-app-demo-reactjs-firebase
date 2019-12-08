import React, { Component } from "react";
import { Menu, Button, Segment } from "semantic-ui-react";

import { db } from "../utils/dummy_databse.js";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {};
  render() {
    const { pageName, logged } = this.props;

    return (
      <div className="header_container">
        <Segment inverted>
          <Menu inverted secondary>
            <Menu.Item
              name="add receipts"
              active={pageName === "add_receipts"}
              onClick={() => this.props.tryGoToPage("add_receipts")}
            />
            {/* <Menu.Item
              name="products"
              active={pageName === "products"}
              onClick={()=>this.props.tryGoToPage('products')}
            /> */}
            <Menu.Item
              name="Charts"
              active={pageName === "charts"}
              onClick={()=>this.props.tryGoToPage('charts')}
            />
            <div className="logout_button">

            
            {logged === true ? (
              <Button secondary onClick={this.props.logout}>Log out</Button>
            ) : (
              ""
            )}
            </div>
          </Menu>
        </Segment>
      </div>
    );
  }
}
export default Header;
