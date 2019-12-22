import React, { Component } from "react";
import * as firebase from "firebase";

import ProductChoosingItem from "./reusableFields/ProductChoosingItem";
import { Button } from "semantic-ui-react";
import AddNewProduct from "./reusableFields/AddNewProduct";
import {checkFloatNumberInput, cleanFloatNumberErrors} from '../utils/FunctiiUtile';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add_new_product: false,
      product_new: {
        name: "",
        price: 0,
        tva: "B",
        utility: true,
        category: 1,
        quantity:1
      },
      erorsProductNew: {},
      isFetchingAddingNewProduct: false,
      selected_product_ids:[],
      searchInput:'',
      productsIdsSorted:[]
    };
  }
  componentDidMount = () => {
    this.setUpProductsSort();
  };
  componentDidUpdate = prevProps =>{
    if(prevProps.products !== this.props.products)
    {
      this.setUpProductsSort();
    }
  }
  setUpProductsSort = () => {
    const {products} = this.props;
    this.setState( {
        productsIdsSorted: Object.keys(products).sort(
          (id1, id2 ) => {
            if ( this.props.products[id1].name < this.props.products[id2].name )
            {
              return -1;
            }
            if ( this.props.products[id1].name > this.props.products[id2].name )
            {
              return 1;
            }
            return 0;
          }
        ) || []
    });
  }
  
  onChangeAddedProd = (propName, val) => {
    if (this.state.isFetchingAddingNewProduct) return;
    if(propName === 'price' )
    {
      val = checkFloatNumberInput(val);
      if(val === -1)
        return;
    }
    this.setState({
      product_new: { ...this.state.product_new, [propName]: val }
    });
  };
  onSubmitNewProduct = () => {
    let { product_new } = this.state;
    let erorsProductNew = {};
    if (product_new.name === "") {
      erorsProductNew["name"] = true;
    }
    product_new.price = Number(product_new.price);
    if (product_new.price <= 0) {
      erorsProductNew["price"] = true;
    }
    if (Object.keys(erorsProductNew).length === 0) {
      this.setState(
        {
          isFetchingAddingNewProduct: true
        },
        () => {
          let update_path = `stores/${this.props.id_store_selected}/products`;

          let newProductId = firebase
            .database()
            .ref()
            .child(update_path)
            .push().key;
          let product_db = {};
         
          product_db[`${update_path + "/" + newProductId}`] = product_new;
          firebase
            .database()
            .ref()
            .update(product_db).then( error => {
              if (!error) {
                this.props.onAddingNewProduct(newProductId, product_new, this.props.id_store_selected);
                product_new = {
                  name: "",
                  price: 0,
                  tva: "A",
                  utility: true,
                  category: 1
                };
              }else{
                console.log(error);
              }
              this.setState({
                isFetchingAddingNewProduct: false,
                product_new: product_new,
                erorsProductNew:{}
              });
            });
        }
      );
    } else {
      this.setState({
        erorsProductNew: erorsProductNew
      });
    }
  };
  filterProducts = (name) =>
  {
    let {searchInput} = this.state;
    if(searchInput === '') return true;
    
    let s_input_uppercase = searchInput.toUpperCase();
    let n_uppercase = name.toUpperCase();

    return n_uppercase.includes(s_input_uppercase);
  }
  render() {
    const { products, tvas, storeName, id_store_selected } = this.props;
    const { add_new_product } = this.state;
    return (
      <>
      {id_store_selected ? 
      <div className="all_products_container">
        <div className="receipt_title_container">
          <div> - - - - </div>
          <div> {storeName} </div>
          <div> - - - - </div>
        </div>
        {add_new_product === true ? (
          <AddNewProduct
            key={'fdasfasdfdas'}
            product={this.state.product_new}
            tvas={tvas}
            errors={this.state.erorsProductNew}
            isFetchingAddingNewProduct={this.state.isFetchingAddingNewProduct}
            onSubmitNewProduct={this.onSubmitNewProduct}
            onChangeAddedProd={this.onChangeAddedProd}
          />
        ) : (
          <Button
            secondary
            style={{ 
            width: '90%',
            marginBottom:'16px',
            }}
            onClick={() => {
              this.setState({ add_new_product: true });
            }}
          >
            Add new product
          </Button>
        )}
         <div fallbackElement="[object Object]" className="ui right aligned search" style={{marginBottom:'5px'}}>

            <div className="ui icon input">
            <input  onChange={(e) => this.setState({searchInput:e.target.value})} type="text" value={this.state.inputSearch} tabindex={"0"} className="prompt" autocomplete={"off"} />
            <i aria-hidden={"true"} className="search icon"></i>
          </div>
        </div>
        {
        this.state.productsIdsSorted.map(id_product => {
          if(!this.filterProducts(products[id_product].name))
          {
            return;
          }
          return (
            <ProductChoosingItem
              key={id_product}
              product={products[id_product]}
              tvas={tvas}
              onChangeAddedProd={this.onChangeAddedProd}
              product_selected={this.state.selected_product_ids.indexOf(id_product) > -1 ? true : false}
              toggleCheckProduct={() =>{
                let {selected_product_ids} = this.state;
                let ind = selected_product_ids.indexOf(id_product)
                if(ind > -1 )
                {
                  selected_product_ids.splice(ind, 1);
                }
                else
                {
                  selected_product_ids.push(id_product);
                }
                  this.setState({ 
                    selected_product_ids:selected_product_ids
                  });
              }}
            />
          );
        })}
        <div style={{height:'50px'}}/>
        <div className="addSelectedProductsBtnContainer">
          <Button 
            secondary
            onClick={()=>{this.props.submitSelectedProducts(this.state.selected_product_ids)}}
          >
            <i className="fas fa-plus-circle"></i> Adauga produse selectate {this.state.selected_product_ids.length> 0 ? ` ( ${this.state.selected_product_ids.length} items )`:''}
          </Button>
        </div>
      </div>
      :  <div className="all_products_container"> Nu e voie, mai tinere.</div>}
      </>
    );
  }
}
export default Products;
