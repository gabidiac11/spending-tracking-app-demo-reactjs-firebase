import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Receipt from "./Recept.jsx";
import { todaysDate } from "../utils/FunctiiUtile.js";
class AddReceipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add_new_receipt: false,
      receipt_new: {
        date: todaysDate(),
        storeId: null,
        products: {},
        total: 0
      }
    };
  }
  componentDidMount = () => {};

  render() {
    const { stores, receipts, isFetchingAddingNewProducts } = this.props;
    return (
      <div className="all_receipts_container">
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
            onChangeDate = {(value) =>{ this.props.onChangeDate('new', value) }}
            addProductsToReceipt={
              () => {
                const {
                  date,
                  storeId
                } = this.state.receipt_new;
                const selected_receipt_credentials = {
                  selectedReceiptId:'new',
                  id_store_selected: storeId,
                  date:date
                }
                this.props.selectReceipt(selected_receipt_credentials);
              }
            } 
            onChangeReceiptData = {
              (prop, val) =>{
                this.setState({
                  receipt_new:{...this.state.receipt_new, [prop]:val}
                })
              }
            }
            onDeleteReceipt={()=>{
              this.setState(
                {
                  add_new_receipt: false,
                  receipt_new: {
                    date: todaysDate(),
                    storeId: null,
                    products: {},
                    total: 0
                  }
                }
              );
            }}
            receipt={this.state.receipt_new} 
            stores={stores} 
          />
        )}
        {
        Object.keys(receipts).reverse().map(receipt_id => {
          const receipt = receipts[receipt_id];
          return (
                <Receipt 
                applyPriceChangeGlobally={this.props.applyPriceChangeGlobally}
                  addProductsToReceipt={
                    () => 
                    {
                      const selected_receipt_credentials = {
                        selectedReceiptId:receipt_id,
                        id_store_selected:receipt.storeId,
                        date:receipt.date
                      }
                      this.props.selectReceipt(selected_receipt_credentials);
                    }
                  } 
                  onDeleteReceipt={()=>{
                    this.props.onDeleteReceipt(receipt_id);
                  }}
                  onChangeDate={(value) =>{ this.props.onChangeDate(receipt_id, value) }}

                  isFetchingQuantity={this.props.isFetchingQuantity}
                  onChangeQuantity={(quantity, id_product) => this.props.onChangeQuantity(quantity, id_product, receipt_id)}
                  updateReceiptProductPrice={(new_price, id_product) => this.props.updateReceiptProductPrice(new_price, id_product, receipt_id)}
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
