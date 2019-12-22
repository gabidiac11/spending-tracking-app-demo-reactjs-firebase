import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import { db } from "../utils/dummy_databse.js";
import ReceiptProductItem from "./reusableFields/ReceiptProductItem.js";
import objectPath from 'object-path';

class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q_inc:0.1,
      total:0
    };
  }
  componentDidMount = () => {
  };
  render() {
    const { receipt, stores } = this.props;
    const store = receipt.storeId ? stores[receipt.storeId] : "";
    let total = 0;
    if(objectPath.get(receipt, 'products'))
    {
      for(let p_id in receipt.products)
      {
        if(objectPath.get(receipt, `products.${p_id}.price`))
        {
          const p = typeof receipt.products[p_id].price === 'number' ? receipt.products[p_id].price : 0;
          const q = receipt.products[p_id].quantity ? receipt.products[p_id].quantity : 0;
          total += Math.floor(Number(p) * Number(q)*100)/100;
          total = Math.floor(total*1000)/1000;
        }
      }
    }
    total = Math.floor(total*100)/100;
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
                  onChangeQuantity={(quanitity, noConfirm = false) => {
                    this.props.onChangeQuantity(quanitity, id_product, noConfirm);
                  }}
                  updateReceiptProductPrice={new_price => {
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
              <div>{total}</div>
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
