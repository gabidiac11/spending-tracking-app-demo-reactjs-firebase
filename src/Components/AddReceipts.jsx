import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Receipt from "./Recept.jsx";
import { todaysDate } from "../utils/FunctiiUtile.js";
import objectPath from "object-path";
class AddReceipts extends Component {
  constructor(props) {
    super(props);
    this.receipt_container_ref = React.createRef();
    this.state = {
      add_new_receipt: false,
      receipt_new: {
        date: todaysDate(),
        storeId: null,
        products: {}
      }
    };
  }
  componentDidMount = () => {
    if (this.receipt_container_ref.current) {
      this.receipt_container_ref.current.scrollTo(0, this.props.scroll_top);
    }
  };
  componentWillUnmount = () => {
    let scroll_top = 0;
    if (this.receipt_container_ref.current) {
      scroll_top = this.receipt_container_ref.current.scrollTop;
    }
    this.props.setPrevScrollTopReceipts(scroll_top);
  };
  render() {
    const { stores, receipts, isFetchingAddingNewProducts, q_inc } = this.props;
    return (
      <div ref={this.receipt_container_ref} className="all_receipts_container">
        <div
          className="toggle_q_inc"
          onClick={this.props.switch_q_inc}
        >
          {this.props.q_inc}
        </div>
        {this.state.add_new_receipt !== true ? (
          <div className="add_new_receipt_btn_container">
            <Button
              secondary
              loading={isFetchingAddingNewProducts}
              onClick={() => {
                this.setState({ add_new_receipt: true });
              }}
            >
              Add new receipt
            </Button>
          </div>
        ) : (
          <Receipt
            q_inc={q_inc}
            onChangeDate={value => {
              this.props.onChangeDate("new", value);
            }}
            addProductsToReceipt={() => {
              const { date, storeId } = this.state.receipt_new;
              const selected_receipt_credentials = {
                selectedReceiptId: "new",
                id_store_selected: storeId,
                date: date
              };
              this.props.selectReceipt(selected_receipt_credentials);
            }}
            onChangeReceiptData={(prop, val) => {
              this.setState({
                receipt_new: { ...this.state.receipt_new, [prop]: val }
              });
            }}
            onDeleteReceipt={() => {
              this.setState({
                add_new_receipt: false,
                receipt_new: {
                  date: todaysDate(),
                  storeId: null,
                  products: {}
                }
              });
            }}
            receipt={this.state.receipt_new}
            stores={stores}
            total={0}
          />
        )}
        {Object.keys(receipts)
          .reverse()
          .map(receipt_id => {
            const receipt = receipts[receipt_id];
            return (
              <Receipt
                q_inc={q_inc}
                applyPriceChangeGlobally={this.props.applyPriceChangeGlobally}
                addProductsToReceipt={() => {
                  const selected_receipt_credentials = {
                    selectedReceiptId: receipt_id,
                    id_store_selected: receipt.storeId,
                    date: receipt.date
                  };
                  this.props.selectReceipt(selected_receipt_credentials);
                }}
                onDeleteReceipt={() => {
                  this.props.onDeleteReceipt(receipt_id);
                }}
                onChangeDate={value => {
                  this.props.onChangeDate(receipt_id, value);
                }}
                isFetchingQuantity={this.props.isFetchingQuantity}
                onChangeQuantity={(quantity, id_product, noConfirm = false) =>
                  this.props.onChangeQuantity(
                    quantity,
                    id_product,
                    receipt_id,
                    noConfirm
                  )
                }
                updateReceiptProductPrice={(new_price, id_product) =>
                  this.props.updateReceiptProductPrice(
                    new_price,
                    id_product,
                    receipt_id
                  )
                }
                key={receipt_id}
                receipt={receipt}
                stores={stores}
              />
            );
          })}
      </div>
    );
  }
}
export default AddReceipts;
