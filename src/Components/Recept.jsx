import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { db } from "../utils/dummy_databse.js";
import ReceiptProductItem from "./reusableFields/ReceiptProductItem.js";
import { newExpression } from "@babel/types";

class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q_inc:0.1
    };
  }
  componentDidMount = () => {};
  render() {
    const { receipt, stores } = this.props;
    const store = receipt.storeId ? stores[receipt.storeId] : "";
    return (
      <div className="receiptContainer">
        <div
          className="deleteButton_receipt"
          onClick={this.props.onDeleteReceipt}
        >
          <i className="fas fa-trash"></i>
        </div>
        <div
          className="toggle_q_inc"
          onClick={() =>{
            this.setState({
              q_inc: this.state.q_inc === 1 ? 0.1 : 1
            })
          }}
        >
          {this.state.q_inc}
        </div>
        <div className="receiptNameAdress">
          {receipt.storeId ? (
            stores[receipt.storeId].name
          ) : (
            <select
              value={receipt.storeId ? receipt.storeId : "0"}
              style={receipt.storeId ? {} : { color: "red" }}
              onChange={e => {
                this.props.onChangeReceiptData("storeId", e.target.value);
              }}
            >
              {Object.keys(stores).map(id_store => {
                return (
                  <option key={id_store} value={id_store}>
                    {stores[id_store].name}
                  </option>
                );
              })}
              {receipt.storeId ? (
                ""
              ) : (
                <option key={["00"]} value={"0"} style={{ color: "red" }}>
                  SELECTEAZA MAGAZIN MAI INTAI
                </option>
              )}
            </select>
          )}
          <div className="textBreeakLine">{store.address}</div>
        </div>
        <div className="receipt_title_container">
          <div> - - - - </div>
          <div> BON FISCAL </div>
          <div> - - - - </div>
        </div>
        <div className="receptContentContainer">
          <div className="recept_product_items_container">
            {Object.keys(receipt.products).map(id_product => {
              const receipt_product = receipt.products[id_product];
              return (
                <ReceiptProductItem
                  q_inc={this.state.q_inc}
                  original_price={store.products[receipt_product.refenceId].price}
                  key={id_product}
                  name={receipt_product.name}
                  price={receipt_product.price}
                  quantity={receipt_product.quantity}
                  tva={receipt_product.tva}
                  utility={receipt_product.utility}
                  onChangeQuantity={quanitity => {
                    this.props.onChangeQuantity(quanitity, id_product);
                  }}
                  updateReceiptProductPrice={new_price => {
                    let temp = new_price;
                    let count = (temp.match(/\./g) || []).length;
                    console.log(count);
                    if (count > 1) return;
                    const length = new_price.length;
                    if (length > 0) {
                      if (
                        length > 1 &&
                        new_price[0] === "0" &&
                        new_price[1] !== "."
                      ) {
                        let index = 0;
                        while (new_price[index] === "0" && index < length - 1) {
                          index += 1;
                        }
                        new_price.slice(0, index);
                      }

                      for (let i = 0; i < new_price.length; i++) {
                        if (
                          !(new_price[i] >= "0" && new_price[i] <= "9") &&
                          new_price[i] != "."
                        ) {
                          console.log();
                          return;
                        }
                      }
                    } else {
                      new_price = 0;
                    }
                    // new_price = Number(new_price);
                    this.props.updateReceiptProductPrice(new_price, id_product);
                  }}
                  applyPriceChangeGlobally={price=>{
                    this.props.applyPriceChangeGlobally(price, receipt.storeId, receipt_product.refenceId);
                  }}
                />
              );
            })}
          </div>
          <div
            className="receipt_totals_container"
            style={{ marginTop: "65px" }}
          >
            <div className="addNewProductItemButtonContainer">
              {receipt.storeId ? (
                <Button secondary onClick={this.props.addProductsToReceipt}>
                  +
                </Button>
              ) : (
                ""
              )}
            </div>
            <div className="total_sub_container">
              <div>Total</div>
              <div>{receipt["total"]}</div>
            </div>
            <div className="total_sub_container">{receipt.payment}</div>
          </div>
          <div className="receipt_totals_container">
            <div className="total_sub_container">
              <div>A - TVA 9 %</div>
              <div>mai vedem</div>
            </div>
            <div className="total_sub_container">
              <div>B - TVA 9 %</div>
              <div>mai vedem</div>
            </div>
            <div className="receipt_date_container">
              <input
                type="date"
                value={receipt.date}
                onChange={e => {
                  this.props.onChangeDate(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Receipt;
