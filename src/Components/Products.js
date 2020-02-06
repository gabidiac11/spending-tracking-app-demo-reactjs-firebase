import React, { Component } from "react";
import * as firebase from "firebase";

import ProductChoosingItem from "./reusableFields/ProductChoosingItem";
import { Button } from "semantic-ui-react";
import AddNewProduct from "./reusableFields/AddNewProduct";
import { checkFloatNumberInput } from "../utils/FunctiiUtile";

class Products extends Component {
  constructor(props) {
    super(props);
    //this.container_ref = React.createRef();
    this.state = {
      add_new_product: false,
      product_new: {
        name: "",
        price: 0,
        tva: "B",
        utility: true,
        category: 1,
        quantity: 1
      },
      erorsProductNew: {},
      isFetchingAddingNewProduct: false,
      selected_product_ids: [],
      searchInput: "",
      productsIdsSorted: [],
      scroll_handle_top: 0
    };
  }
  componentDidMount = () => {
    this.setUpProductsSort();
  };
  componentDidUpdate = prevProps => {
    if (prevProps.products !== this.props.products) {
      this.setUpProductsSort();
    }
  };
  setUpProductsSort = () => {
    const { products } = this.props;
    this.setState({
      productsIdsSorted:
        Object.keys(products).sort((id1, id2) => {
          const name1 = this.props.products[id1].name.toLowerCase();
          const name2 = this.props.products[id2].name.toLowerCase();
          if (name1 < name2) {
            return -1;
          }
          if (name1 > name2) {
            return 1;
          }
          return 0;
        }) || []
    });
  };
  onChangeAddedProd = (propName, val) => {
    if (this.state.isFetchingAddingNewProduct) return;
    if (propName === "price") {
      val = checkFloatNumberInput(val);
      if (val === -1) return;
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
            .update(product_db)
            .then(error => {
              let data_set = {
                isFetchingAddingNewProduct: false,
                product_new: product_new,
                erorsProductNew: {}
              };
              if (!error) {
                this.props.onAddingNewProduct(
                  newProductId,
                  product_new,
                  this.props.id_store_selected
                );
                product_new = {
                  name: "",
                  price: 0,
                  tva: "A",
                  utility: true,
                  category: 1
                };

                data_set["product_new"] = product_new;
                data_set["selected_product_ids"] = [
                  ...this.state.selected_product_ids,
                  newProductId
                ];
              } else {
                console.log(error);
              }
              this.setState({
                ...data_set
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
  filterProducts = name => {
    let { searchInput } = this.state;
    if (searchInput === "") return true;

    let s_input_uppercase = searchInput.toUpperCase();
    let n_uppercase = name.toUpperCase();

    return n_uppercase.includes(s_input_uppercase);
  };
  render() {
    const { products, tvas, storeName, id_store_selected } = this.props;
    const { add_new_product } = this.state;
    // const child_height = this.container_ref.current ?
    // this.container_ref.current.children[1].clientHeight : 0;
    // const parent_height = this.container_ref.current ? this.container_ref.current.clientHeight - 100 : 0;
    // const percent = Math.floor(parent_height*100/child_height*100)/100;
    // console.log(percent);
    // const scroll_handle_height = parent_height*percent/100;
    return (
      <div
        className="all_products_container_scroll"
        ref={this.container_ref}
        style={{
          overflow: this.state.lock_scroll === true ? "hidden" : "auto"
        }}
        // onScroll={(e)=>{
        //   setState({
        //     scroll_handle_top:
        //   });
        // }}
      >
        {/* <div className="container_scroll_handle"
          style={{
            top:this.state.scroll_handle_top,
            height: scroll_handle_height
          }}
          onTouchMove ={e => {
            const my_Y = e.touches[0].clientY;
            if( my_Y >= 0 && my_Y < window.innerHeight - scroll_handle_height/2 - 50)
            {
              this.setState({
                scroll_handle_top: my_Y/2,
                
              });
              if(this.container_ref.current)
              {
                this.container_ref.current.scrollTo(0,  my_Y)
              }
            }
            if(!this.state.lock_scroll)
            {
              this.setState({
                lock_scroll: true
              })
            }
          }}
          onTouchEnd = {()=>{
            this.setState({
              lock_scroll:false
            })}
          }
          >
        </div> */}
        {id_store_selected ? (
          <div className="all_products_container">
            <div className="receipt_title_container">
              <div> - - - - </div>
              <div> {storeName} </div>
              <div> - - - - </div>
            </div>
            {add_new_product === true ? (
              <AddNewProduct
                key={"fdasfasdfdas"}
                product={this.state.product_new}
                tvas={tvas}
                errors={this.state.erorsProductNew}
                isFetchingAddingNewProduct={
                  this.state.isFetchingAddingNewProduct
                }
                onSubmitNewProduct={this.onSubmitNewProduct}
                onChangeAddedProd={this.onChangeAddedProd}
              />
            ) : (
              <Button
                secondary
                style={{
                  width: "90%",
                  minHeight: "unset",
                  marginBottom: "16px"
                }}
                onClick={() => {
                  this.setState({ add_new_product: true });
                }}
              >
                Add new product
              </Button>
            )}
            <div
              className="ui right aligned search"
              style={{ marginBottom: "5px" }}
            >
              <div className="ui icon input">
                <input
                  onChange={e => this.setState({ searchInput: e.target.value })}
                  type="text"
                  value={this.state.searchInput}
                  tabIndex={"0"}
                  className="prompt"
                  autoComplete={"off"}
                />
                <i aria-hidden={"true"} className="search icon"></i>
              </div>
            </div>
            {this.state.productsIdsSorted.map(id_product => {
              if (!this.filterProducts(products[id_product].name)) {
                return;
              }
              return (
                <ProductChoosingItem
                  key={id_product}
                  product={products[id_product]}
                  tvas={tvas}
                  onChangeAddedProd={this.onChangeAddedProd}
                  product_selected={
                    this.state.selected_product_ids.indexOf(id_product) > -1
                      ? true
                      : false
                  }
                  toggleCheckProduct={() => {
                    let { selected_product_ids } = this.state;
                    let ind = selected_product_ids.indexOf(id_product);
                    let data_set = {};
                    if (ind > -1) {
                      selected_product_ids.splice(ind, 1);
                    } else {
                      selected_product_ids.push(id_product);
                    }
                    data_set["selected_product_ids"] = selected_product_ids;
                    this.setState({
                      ...data_set
                    });
                  }}
                />
              );
            })}
            <div style={{ height: "50px" }} />
            <div className="addSelectedProductsBtnContainer">
              <Button
                secondary
                onClick={() => {
                  this.props.submitSelectedProducts(
                    this.state.selected_product_ids
                  );
                }}
              >
                {this.state.selected_product_ids.length === 0 ?
                <>
                  <i className="fas fa-arrow-left"></i>
                  {`BACK`}
                </>
                :
                <>
                  <i className="fas fa-plus-circle"></i>
                  
                  {`Adauga produse selectate ( ${this.state.selected_product_ids.length} items )`}
                </>}
              </Button>
            </div>
          </div>
        ) : (
          <div className="all_products_container"> Nu e voie, mai tinere.</div>
        )}
      </div>
    );
  }
}
export default Products;
