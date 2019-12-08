
import React, { Component } from "react";
import {
    Redirect
  } from "react-router-dom";

class RedirectModerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
        pages:[
            'add_receipts',
            'products',
            'charts'
        ],
        redirectDomEl:'',

    };
  }
  componentDidMount = () => {

  };
  redirectToPage = (pageName) =>{
      const {pages} = this.state;
      const {cPage} = this.props;
      if(pages.indexOf(pageName) !== -1 && cPage !== pageName)
      {
        this.setState({
            redirectDomEl: <Redirect
            to={{
                pathname: "/" + pageName
              }}
          />
        }, () =>{
            this.props.pageRedirectedSetups(pageName);
        })
      }
  }
  componentDidUpdate = (prevProps) =>{
      if(this.props.redirectToPage !== '' && prevProps.redirectToPage !== this.props.redirectToPage)
      {
          
        this.redirectToPage(this.props.redirectToPage);
      }
  }
  render() {
    return (
            <>
            {
                this.state.redirectDomEl
            }
            </>
          );
  }
}
export default RedirectModerator;
