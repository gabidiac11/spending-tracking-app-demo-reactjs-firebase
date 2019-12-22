import React from "react";

import ProductUtilityBum from "./ProductUtilityBum";
import { Button} from 'semantic-ui-react';

const AddNewProduct = props => {
  const { tvas } = props;

  const { name, price, tva, utility } = props.product;
  const {isFetchingAddingNewProduct, errors} = props;
  return (
    <div className="product_select_item_container product_select_item_container_new">
      <div className="product_item_name w100_">
        <input type="text" value={name}
          placeholder="Nume produs"
          style={errors['name']? {'border':'1px solid red'} : {}}
          onChange={
            (e) =>{
              props.onChangeAddedProd('name', e.target.value);
            }
          }
        />
      </div>
      <div className="product_quantity_price_">
        <div className="product_SLEECT_item_price_input_container">
          <input 
          type="text"
          value={price} 
          style={errors['price']? {'border':'1px solid red'} : {}}
          onChange={
            (e) =>{
              props.onChangeAddedProd('price', e.target.value);
            }
          }
          />
        </div>
      </div>
      <div className="product_item_td product_item_td_top_left new_product">
        <div className="product_item_tva">
          <select 
          className='ui button'
            val={tva} 
            onChange={
              (e) =>{
                props.onChangeAddedProd('tva', e.target.value);
              }
            }
          >
            {Object.keys(tvas).map(id_tva => {
              return <option value={id_tva}>{id_tva}</option>;
            })}
          </select>
          <div className="hover_">
          <ProductUtilityBum
            utility={utility} 
            onChangeAddedProd={()=> {
              props.onChangeAddedProd('utility', !utility);
          }}/>
</div>
        </div>
        {
          isFetchingAddingNewProduct ?
          <Button 
          seconday 
          loading
          >
          <i className="fas fa-plus-circle"></i>
          </Button>
          :
          <Button 
          seconday 
          onClick={props.onSubmitNewProduct}>
          <i className="fas fa-plus-circle"></i>
          </Button>
        }

      </div>
    </div>
  );
};
export default AddNewProduct;
