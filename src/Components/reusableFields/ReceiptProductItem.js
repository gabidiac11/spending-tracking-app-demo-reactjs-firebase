import React from "react";

import ProductUtilityBum from "./ProductUtilityBum";

let clickev = 0;
const ReceiptProductItem = props => {
  const { name, price, quantity, tva, utility, original_price, q_inc } = props;

  let quantity_submit = !quantity ? 1 : quantity;
  
  return (
    <div className="product_item_container">
      <div 
       
        className="product_item_action_buttons">
        <div className="quantity_edit_btn"
        
        onClick={() => props.onChangeQuantity(Math.floor((quantity_submit + q_inc)*100)/100)}
        >
        <i className="fas fa-plus"></i>
        </div>
        <div 
        onClick={() => props.onChangeQuantity(Math.floor((quantity_submit-q_inc)*100)/100 )}
        className="quantity_edit_btn">
        <i className="fas fa-minus"></i>
        </div>
      </div>
      <div className="product_item_content_container">
        <div className="product_content_row product_content_row_first">
          <div className="product_item_td rel_">
            <div className="product_item_name">
              <div>{name}</div>
            </div>
            <div 
            
            onClick={() => props.onChangeQuantity(0)}
            className="delete_button_product_item" >
                <i className="fas fa-trash"></i>
            </div>
          </div>

          
        </div>
        <div className="product_content_row product_content_row_second ">
          <div className="product_quantity_price_">
              <div className="product_quantity_item_set">{quantity_submit} BUC x</div>
              <div className="product_item_price_input_container">
                <input value={price} onChange={
                  (e) => {
                    props.updateReceiptProductPrice(e.target.value);
                  }
                }/>
              </div>
              {
                original_price != price ?
                <div className="apply_changes_globbaly" onClick={() => {
                  props.applyPriceChangeGlobally(price);
                }}>
                  <i className="fas fa-check-square"></i>
                </div>
                : ''
              }
          </div>
          <div className="product_item_td product_item_td_top_left">
            <div className="product_item_tva">{tva}</div>
            <ProductUtilityBum utility={utility} />
          </div>
        </div>
        <div className="product_content_row product_content_row_last">
            <div className="item_product_total_price">
            { ((Number)(quantity_submit*price)).toFixed(2) }
            </div>
        </div>
      </div>
    </div>
  );
};
export default ReceiptProductItem;
