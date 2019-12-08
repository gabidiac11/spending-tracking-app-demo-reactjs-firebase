import React from "react";

const ProductUtilityBum = props => {
  const { utility, idle } = props;

  const color = idle ? 'grey' : utility ? 'green' : 'red';
  const icon = idle ? 
  <i className="fas fa-list"></i>
  : utility ?  <i className="fab fa-angellist"></i> :  <i className="fas fa-skull"></i>;
  return (
    <div
      className="product_item_utiltity"
      onClick={props.onChangeAddedProd ? props.onChangeAddedProd : () =>{}}
      style={{
        color: color
      }}
      
    >
      {icon}
    </div>
  );
};
export default ProductUtilityBum;
