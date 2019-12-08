import React, { Component } from "react";
import { Redirect, Route, Switch, HashRouter } from "react-router-dom";
import * as firebase from "firebase";
import "./App.css";
import "./assets/style/style.css";
import "./assets/style/all.css";
// import { db } from "./utils/dummy_databse.js";
import AddReceipts from "./Components/AddReceipts";
import Header from "./Components/Header";
import RedirectModerator from "./Components/RedirectModerator";
import Products from "./Components/Products";
import { todaysDate } from "./utils/FunctiiUtile";
import WholeScreenLoader from "./Components/reusableFields/WholeScreenLoader";
import Login from "./Components/Login";
import SpendingStatus from "./Components/SpendingStatus";
// import Spend

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToPage: "",
      history: [],
      stores: {},
      receipts: {},
      tvas: {},
      isFetchingStores: true,
      isFetchingReceipts: true,
      isFetchingAddingNewProducts: false,
      selected_receipt_credentials: {
        selectedReceiptId: null,
        id_store_selected: null,
        date: todaysDate()
      },
      isFetchingQuantity: {},
      isFetchingUpdatingRECEIPT_product_price: {},
      isFetchingReceiptDate: {},
      isFetchingDeleteReceipt: {},
      isFetchingStorePrice: {},
      logged: false
    };
  }
  componentDidMount = () => {
    this.init();
  };
  init = () => {
    if (localStorage.getItem("auth") === "bine" ) {
      this.setState({
        logged: true
      });
      this.getDataFromServer();
    } else {
      this.setState({ logged: false });
    }
  };
  permitAccess = () => {
    this.setState({ logged: true }, () => {
      this.getDataFromServer();
    });
  };
  logout = () => {
    localStorage.setItem("auth", null);
    this.setState({ logged: false });
  };
  getDataFromServer = () => {
    let ref = firebase.database().ref("/");
    ref.on("value", snapshot => {
      let db = snapshot.val();
      db["pallete"] = null;
      if (db["receipts"]) {
        for (let receipt_id in db.receipts) {
          if (db.receipts[receipt_id].products == null) {
            db.receipts[receipt_id]["products"] = {};
          }
        }
      } else {
        db["receipts"] = {};
      }
      if (db["stores"]) {
        for (let storeId in db.stores) {
          if (db.stores[storeId].products == null) {
            db.stores[storeId]["products"] = {};
          } else {
            for (let p_id in db.stores[storeId].products) {
              if (db.stores[storeId].products[p_id].price == null) {
                db.stores[storeId].products[p_id].price = 0;
              }
            }
          }
        }
      } else {
        db["stores"] = {};
      }
      /////receipts)
      this.setState({
        id_store_selected: Object.keys(db.stores)[0],
        stores: db.stores,
        receipts: db.receipts,
        tvas: db.tvas,
        isFetchingStores: false,
        isFetchingReceipts: false
      });
    });
  };
  tryGoToPage = pageName => {
    this.setState({ redirectToPage: pageName });
  };
  pageRedirectedSetups = (pageName, goneBack) => {
    let { history } = this.state;
    if (goneBack === true) {
      if (history.length > 2 && history[history.length - 2] === pageName) {
        history.splice(history.length - 1, 1);
      }
    } else {
      if (
        history.length === 0 ||
        (history.length > 0 && history[history.length - 1] !== pageName)
      ) {
        history.push(pageName);
      }
    }
    this.setState({ history: history, redirectToPage: "" });
  };
  submitSelectedProducts = selected_products_ids => {
    console.log(selected_products_ids);
    const {
      selectedReceiptId,
      id_store_selected
    } = this.state.selected_receipt_credentials;
    if (selectedReceiptId == null || id_store_selected == null) {
      this.setState({
        redirectToPage: "add_receipts",
        selected_receipt_credentials: {
          selectedReceiptId: null,
          id_store_selected: null,
          date: todaysDate()
        }
      });
      return;
    }
    const { products } = this.state.stores[id_store_selected];

    let receipt_products = {};
    if (this.state.receipts[selectedReceiptId]) {
      receipt_products = this.state.receipts[selectedReceiptId].products;
    }
    let products_submit = {};
    let total = 0;
    for (let index = 0; index < selected_products_ids.length; index++) {
      const { category, name, price, tva, utility } = products[
        selected_products_ids[index]
      ];
      let newProductId = firebase
        .database()
        .ref()
        .push().key;
      products_submit[newProductId] = {
        category: category,
        name: name,
        price: price,
        tva: tva,
        utility: utility,
        refenceId: selected_products_ids[index]
      };
      total += price;
    }
    if (this.state.isFetchingAddingNewProducts === true) return;

    if (selectedReceiptId !== "new") {
      for (let p_id in receipt_products) {
        total +=
          Number(receipt_products[p_id].price) *
          (receipt_products[p_id].quantity
            ? receipt_products[p_id].quantity
            : 1);
      }
      total = Math.floor(total * 100) / 100;
      firebase
        .database()
        .ref()
        .child(`receipts/${selectedReceiptId}/products`)
        .update(products_submit)
        .then(error => {
          if (!error) {
            firebase
              .database()
              .ref()
              .child(`receipts/${selectedReceiptId}`)
              .update({ total: total })
              .then(error => {
                let state_dispatch = {
                  isFetchingAddingNewProducts: false
                };
                if (!error) {
                  state_dispatch["redirectToPage"] = "add_receipts";
                  state_dispatch["selected_receipt_credentials"] = {
                    selectedReceiptId: null,
                    id_store_selected: null,
                    date: todaysDate()
                  };
                } else {
                  console.log(error);
                }
                this.setState({
                  ...state_dispatch
                });
              });
          } else {
            console.log(error);
          }
        });
    } else {
      this.submitNewReceipt(products_submit, id_store_selected, total);
    }
  };
  submitNewReceipt = (products_submit, id_store_selected, total) => {
    console.log(products_submit, id_store_selected);
    this.setState(
      {
        isFetchingAddingNewProducts: true
      },
      () => {
        const receipt_new = {
          date: this.state.selected_receipt_credentials.date,
          storeId: id_store_selected,
          products: products_submit,
          total: total,
          quantity: 1
        };
        console.log(receipt_new);
        let newReceiptsId = firebase
          .database()
          .ref()
          .child("receipts/")
          .push().key;

        firebase
          .database()
          .ref()
          .child(`receipts/${newReceiptsId}`)
          .update(receipt_new)
          .then(error => {
            let state_dispatch = {
              isFetchingAddingNewProducts: false
            };
            if (!error) {
              state_dispatch["redirectToPage"] = "add_receipts";
              state_dispatch["selected_receipt_credentials"] = {
                selectedReceiptId: null,
                id_store_selected: null,
                date: todaysDate()
              };
            } else {
              console.log(error);
            }
            this.setState({
              ...state_dispatch
            });
          });
      }
    );
  };
  selectReceipt = selected_receipt_credentials => {
    this.setState({
      selected_receipt_credentials: selected_receipt_credentials,
      redirectToPage: "products"
    });
  };
  onChangeQuantity = (quantity, id_product, receipt_id) => {
    console.log(quantity);
    if (this.state.isFetchingQuantity[receipt_id + id_product] === true) return;

    this.setState({
      isFetchingQuantity: {
        ...this.state.isFetchingQuantity,
        [receipt_id + id_product]: true
      }
    });
    let receipt = this.state.receipts[receipt_id];
    let total =
      receipt.total -
      Number(receipt.products[id_product].price) *
        (receipt.products[id_product].quantity
          ? receipt.products[id_product].quantity
          : 1) +
      Number(receipt.products[id_product].price) * quantity;
    total = Math.floor(total * 100) / 100;
    if (quantity <= 0) {
      firebase
        .database()
        .ref()
        .child(`receipts/${receipt_id}`)
        .update({ [`products/${id_product}`]: null, total: total })
        .then(error => {
          if (!error) {
            this.setState({
              isFetchingQuantity: {
                ...this.state.isFetchingQuantity,
                [receipt_id + id_product]: false
              }
            });
          } else {
          }
        });
    } else {
      firebase
        .database()
        .ref()
        .child(`receipts/${receipt_id}`)
        .update({ [`products/${id_product}/quantity`]: quantity, total: total })
        .then(error => {
          if (!error) {
            this.setState({
              isFetchingQuantity: {
                ...this.state.isFetchingQuantity,
                [receipt_id + id_product]: false
              }
            });
          } else {
          }
        });
    }
  };
  updateReceiptProductPrice = (new_price, id_product, receipt_id) => {
    if (
      this.state.isFetchingUpdatingRECEIPT_product_price[
        receipt_id + id_product
      ] === true
    )
      return;

    this.setState({
      isFetchingUpdatingRECEIPT_product_price: {
        ...this.state.isFetchingUpdatingRECEIPT_product_price,
        [receipt_id + id_product]: true
      }
    });

    let receipt = this.state.receipts[receipt_id];
    let quantity = receipt.products[id_product].quantity
      ? receipt.products[id_product].quantity
      : 1;
    let total =
      receipt.total -
      Number(receipt.products[id_product].price) * quantity +
      new_price * quantity;
    total = total.toFixed(2);

    firebase
      .database()
      .ref()
      .child(`receipts/${receipt_id}`)
      .update({ [`products/${id_product}/price`]: new_price, total: total })
      .then(error => {
        if (!error) {
          this.setState({
            isFetchingUpdatingRECEIPT_product_price: {
              ...this.state.isFetchingUpdatingRECEIPT_product_price,
              [receipt_id + id_product]: false
            }
          });
        } else {
        }
      });
  };
  onChangeDate = (receiptId, value) => {
    if (this.state.isFetchingReceiptDate === true) return;
    this.setState({
      isFetchingReceiptDate: {
        ...this.state.isFetchingReceiptDate,
        [receiptId]: true
      }
    });
    if (receiptId !== "new") {
      firebase
        .database()
        .ref()
        .child(`receipts/${receiptId}`)
        .update({ date: value })
        .then(error => {
          if (!error) {
            this.setState({
              isFetchingReceiptDate: {
                ...this.state.isFetchingReceiptDate,
                [receiptId]: false
              }
            });
          } else {
          }
        });
    }
  };
  onDeleteReceipt = receiptId => {
    if (this.state.isFetchingDeleteReceipt === true) return;
    this.setState({
      isFetchingDeleteReceipt: {
        ...this.state.isFetchingDeleteReceipt,
        [receiptId]: true
      }
    });
    if (receiptId !== "new") {
      firebase
        .database()
        .ref()
        .child(`receipts`)
        .update({ [receiptId]: null })
        .then(error => {
          if (!error) {
            this.setState({
              isFetchingDeleteReceipt: {
                ...this.state.isFetchingDeleteReceipt,
                [receiptId]: false
              }
            });
          } else {
          }
        });
    }
  };
  applyPriceChangeGlobally = (price, storeId, refenceId) => {
    if (this.state.isFetchingStorePrice[refenceId] === true) return;
    this.setState({
      isFetchingStorePrice: {
        ...this.state.isFetchingStorePrice,
        [refenceId]: true
      }
    });
    if (price != null) {
      firebase
        .database()
        .ref()
        .child(`stores/${storeId}/products/${refenceId}`)
        .update({ price: price })
        .then(error => {
          if (!error) {
            this.setState({
              isFetchingStorePrice: {
                ...this.state.isFetchingStorePrice,
                [refenceId]: false
              }
            });
          } else {
          }
        });
    }
  };
  render() {
    return (
      <div className="page_container">
        <div className="page_sub_container">
          <HashRouter>
            <Route
              render={routerProps => {
                let pageName = routerProps.location.pathname.split("/");
                pageName = pageName[1];
                return (
                  <>
                    <Header
                      logged={this.state.logged}
                      logout={this.logout}
                      pageName={pageName}
                      tryGoToPage={this.tryGoToPage}
                    />
                  </>
                );
              }}
            />
            <Route
              render={routerProps => {
                // let pageName = routerProps.location.pathname.split("/");
                // let id_user = pageName[2];
                // pageName = pageName[1];
                // let pageNameWhole = pageName;
                // if(id_user != null ){
                //   pageNameWhole += '/'+id_user;
                // }
                return (
                  <>
                    {/* 8/moderator */}
                    <RedirectModerator
                      redirectToPage={this.state.redirectToPage}
                      pageRedirectedSetups={this.pageRedirectedSetups}
                    />
                  </>
                );
              }}
            />

            {this.state.logged === true ? (
              <Switch>
                {/* 8/add_receipts */}
                <Route
                  exact
                  path="/add_receipts"
                  render={routerProps => (
                    <>
                      {this.state.isFetchingReceipts === true ? (
                        <WholeScreenLoader />
                      ) : (
                        <AddReceipts
                          applyPriceChangeGlobally={
                            this.applyPriceChangeGlobally
                          }
                          updateReceiptProductPrice={
                            this.updateReceiptProductPrice
                          }
                          onChangeDate={this.onChangeDate}
                          onDeleteReceipt={this.onDeleteReceipt}
                          isFetchingQuantity={this.state.isFetchingQuantity}
                          onChangeQuantity={this.onChangeQuantity}
                          selectReceipt={this.selectReceipt}
                          stores={this.state.stores}
                          receipts={this.state.receipts}
                        />
                      )}
                    </>
                  )}
                />
                {/* 8/products */}
                <Route
                  exact
                  path="/products"
                  render={routerProps => (
                    <>
                      {this.state.isFetchingReceipts === true ? (
                        <WholeScreenLoader />
                      ) : (
                        <Products
                          products={
                            this.state.selected_receipt_credentials
                              .id_store_selected != null
                              ? this.state.stores[
                                  this.state.selected_receipt_credentials
                                    .id_store_selected
                                ].products
                              : {}
                          }
                          isFetchingAddingNewProducts={
                            this.state.isFetchingAddingNewProducts
                          }
                          id_store_selected={
                            this.state.selected_receipt_credentials
                              .id_store_selected
                          }
                          tvas={this.state.tvas}
                          storeName={
                            this.state.selected_receipt_credentials
                              .id_store_selected != null
                              ? this.state.stores[
                                  this.state.selected_receipt_credentials
                                    .id_store_selected
                                ].name
                              : ""
                          }
                          submitSelectedProducts={this.submitSelectedProducts}
                        />
                      )}
                    </>
                  )}
                />
                {/* 8/charts */}
                <Route
                  exact
                  path="/charts"
                  render={routerProps => (
                    <>
                      {this.state.isFetchingReceipts === true ? (
                        <WholeScreenLoader />
                      ) : (
                        <SpendingStatus receipts={this.state.receipts} />
                      )}
                    </>
                  )}
                />
                <Redirect from="/" to="add_receipts" />
              </Switch>
            ) : (
              <Login permitAccess={this.permitAccess} />
            )}
          </HashRouter>
        </div>
      </div>
    );
  }
}
export default App;
