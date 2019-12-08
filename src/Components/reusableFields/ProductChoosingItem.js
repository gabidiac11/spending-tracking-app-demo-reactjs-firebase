import React from "react";

import ProductUtilityBum from "./ProductUtilityBum";
import { Button} from 'semantic-ui-react';

const ProductChoosingItem = props => {
  const { 
    tvas,
    product_selected
  } = props;

   // product 
  const { name, price, quantity, tva, utility } = props.product;
  
  return (
    <div
    onClick={props.toggleCheckProduct}
       className="product_select_item_container prod_bk prod_padding_">
      <div className="product_item_name w100_">
        {name}
      </div>
      <div className="product_quantity_price_">
        <div className="product_SLEECT_item_price_input_container">
          {price} RON
        </div>
        <ProductUtilityBum utility={utility} />
      </div>
      <div className="product_item_td product_item_td_top_left new_product">
        <div className="product_item_tva">
            {tva}
        </div>
        <div className={`checkProduct${product_selected === true ? ' selected___' : ''}`}
        >
        <Button 
          seconday
          // onClick={props.toggleCheckProduct}
        >
          <i className="fa fa-check" ></i>
        </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductChoosingItem;
