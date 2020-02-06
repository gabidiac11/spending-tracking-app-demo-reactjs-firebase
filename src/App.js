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
import { todaysDate, checkFloatNumberInput } from "./utils/FunctiiUtile";
import WholeScreenLoader from "./Components/reusableFields/WholeScreenLoader";
import Login from "./Components/Login";
import SpendingStatus from "./Components/SpendingStatus";
import { Confirm } from "semantic-ui-react";
import objectPath from "object-path";
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
      logged: false,
      openConfirmDialog: false,
      calledFunction: "",
      parameters: {},
      q_inc: 0.1,
      receipt_scroll_top: 0
    };
  }
  componentDidMount = () => {
    this.init();
  };
  init = () => {
    if (localStorage.getItem("auth") === "bine" || this.props.demo) {
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
          } else {
            for (let p_id in db.receipts[receipt_id].products) {
              if (db.receipts[receipt_id].products[p_id].price) {
                // db.receipts[receipt_id].products[p_id].price = Number(db.receipts[receipt_id].products[p_id].price) || 0;
              } else {
                db.receipts[receipt_id].products[p_id].price = 0;
              }

              if (db.receipts[receipt_id].products[p_id].quantity) {
                db.receipts[receipt_id].products[p_id].quantity =
                  Number(db.receipts[receipt_id].products[p_id].quantity) || 0;
              } else {
                db.receipts[receipt_id].products[p_id].quantity = 1;
              }
            }
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
              } else {
                db.stores[storeId].products[p_id].price = Number(
                  db.stores[storeId].products[p_id].price
                );
              }
            }
          }
        }
      } else {
        db["stores"] = {};
      }
      /////receipts
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
    const {
      selectedReceiptId,
      id_store_selected
    } = this.state.selected_receipt_credentials;
    if (selectedReceiptId == null || id_store_selected == null) {
      this.setState({
        selected_receipt_credentials: {
          selectedReceiptId: null,
          id_store_selected: null,
          date: todaysDate()
        },
        choose_products: false
      });
      return;
    }
    const { products } = this.state.stores[id_store_selected];

    let receipt_products = {};
    if (this.state.receipts[selectedReceiptId]) {
      receipt_products = this.state.receipts[selectedReceiptId].products;
    }
    let products_submit = {};
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
        price: price || 0,
        tva: tva,
        utility: utility,
        refenceId: selected_products_ids[index]
      };
    }
    if (this.state.isFetchingAddingNewProducts === true) return;

    if (selectedReceiptId !== "new") {
      firebase
        .database()
        .ref()
        .child(`receipts/${selectedReceiptId}/products`)
        .update(products_submit)
        .then(error => {
          let state_dispatch = {
            isFetchingAddingNewProducts: false
          };
          if (!error) {
            state_dispatch["choose_products"] = false;
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
      this.submitNewReceipt(products_submit, id_store_selected);
    }
  };
  submitNewReceipt = (products_submit, id_store_selected) => {
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
              state_dispatch["choose_products"] = false;
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
      choose_products: true
    });
  };
  onChangeQuantity = (quantity, id_product, receipt_id, noConfirm) => {
    if (this.state.isFetchingQuantity[receipt_id + id_product] === true) return;
    this.setState({
      isFetchingQuantity: {
        ...this.state.isFetchingQuantity,
        [receipt_id + id_product]: true
      }
    });
    let receipt = this.state.receipts[receipt_id];
    if (quantity <= 0) {
      this.onDeleteProductFromReceipt(receipt_id, id_product, noConfirm);
    } else {
      firebase
        .database()
        .ref()
        .child(`receipts/${receipt_id}`)
        .update({ [`products/${id_product}/quantity`]: quantity })
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
  onDeleteProductFromReceipt = (receipt_id, id_product, noConfirm) => {
    if (!noConfirm) {
      //check if the receipt is older (meaning maybe someone is scrolling press delete by mistake)
      const date_receipt = this.state.receipts[receipt_id].date || todaysDate();
      if (date_receipt === todaysDate()) {
        noConfirm = true;
      }
    }
    if (this.state.openConfirmDialog === true || noConfirm === true) {
      this.setState(
        {
          openConfirmDialog: false,
          calledFunction: "",
          calledFunctionParameters: {}
        },
        () => {
          firebase
            .database()
            .ref()
            .child(`receipts/${receipt_id}`)
            .update({ [`products/${id_product}`]: null })
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
      );
    } else {
      this.setState({
        openConfirmDialog: true,
        calledFunction: "onDeleteProductFromReceipt",
        calledFunctionParameters: {
          receipt_id: receipt_id,
          id_product: id_product
        },
        isFetchingQuantity: {
          ...this.state.isFetchingQuantity,
          [receipt_id + id_product]: false
        }
      });
    }
  };
  updateReceiptProductPrice = (new_price, id_product, receipt_id) => {
    console.log(new_price);
    new_price = checkFloatNumberInput(new_price);
    if (
      this.state.isFetchingUpdatingRECEIPT_product_price[
        receipt_id + id_product
      ] === true ||
      new_price === -1
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

    firebase
      .database()
      .ref()
      .child(`receipts/${receipt_id}`)
      .update({ [`products/${id_product}/price`]: new_price })
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

    firebase
      .database()
      .ref()
      .child(`productPriceFluctuation`)
      .update({ [`${id_product}/${todaysDate()}`]: new_price })
      .then(error => {});
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
    if (this.state.openConfirmDialog === true) {
      this.setState(
        {
          openConfirmDialog: false,
          calledFunction: "",
          calledFunctionParameters: {}
        },
        () => {
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
        }
      );
    } else {
      this.setState({
        openConfirmDialog: true,
        calledFunction: "onDeleteReceipt",
        calledFunctionParameters: {
          receiptId: receiptId
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
  onClearFunctionSelection = () => {
    this.setState({
      openConfirmDialog: false,
      calledFunction: "",
      parameters: {}
    });
  };
  callFunction(f_name, f_param) {
    switch (f_name) {
      case "onDeleteReceipt":
        this.onDeleteReceipt(f_param.receiptId);
        break;
      case "onDeleteProductFromReceipt":
        this.onDeleteProductFromReceipt(f_param.receipt_id, f_param.id_product);
        break;
      default:
        this.onClearFunctionSelection();
    }
  }
  render() {
    const { demo } = this.props;
    return (
      <>
        {this.state.choose_products === true ? (
          <>
            {this.state.isFetchingReceipts === true ? (
              <WholeScreenLoader />
            ) : (
              <Products
                products={
                  objectPath.get(
                    this.state,
                    "selected_receipt_credentials.id_store_selected"
                  ) != null
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
                  this.state.selected_receipt_credentials.id_store_selected
                }
                tvas={this.state.tvas}
                storeName={
                  this.state.selected_receipt_credentials.id_store_selected !=
                  null
                    ? this.state.stores[
                        this.state.selected_receipt_credentials
                          .id_store_selected
                      ].name
                    : ""
                }
                onAddingNewProduct={(p_id, product, storeId) => {
                  let { stores } = this.state;
                  if (objectPath.get(stores, `${storeId}.products`)) {
                    if (stores[storeId].products) {
                      stores[storeId].products[p_id] = product;
                    } else {
                      stores[storeId].products = {
                        [p_id]: product
                      };
                    }
                  }
                  this.setState({
                    stores: stores
                  });
                }}
                submitSelectedProducts={this.submitSelectedProducts}
              />
            )}
          </>
        ) : (
          <>
            <div className="page_container">
              <div className="page_sub_container">
                <div>
                  <Confirm
                    open={this.state.openConfirmDialog}
                    onCancel={this.onClearFunctionSelection}
                    onConfirm={() => {
                      this.callFunction(
                        this.state.calledFunction,
                        this.state.calledFunctionParameters
                      );
                    }}
                  />
                </div>
                <HashRouter>
                  <Route
                    render={routerProps => {
                      let pageName = routerProps.location.pathname.split("/");
                      pageName = pageName[1];
                      return (
                        <>
                          <Header
                            demo={demo}
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
                                switch_q_inc={() => {
                                  this.setState({
                                    q_inc: this.state.q_inc === 1 ? 0.1 : 1
                                  });
                                }}
                                q_inc={this.state.q_inc}
                                setPrevScrollTopReceipts={scroll_top => {
                                  this.setState({
                                    container_receipt_scroll_top: scroll_top
                                  });
                                }}
                                scroll_top={
                                  this.state.container_receipt_scroll_top
                                }
                                q_inc={this.state.q_inc}
                                applyPriceChangeGlobally={
                                  this.applyPriceChangeGlobally
                                }
                                updateReceiptProductPrice={
                                  this.updateReceiptProductPrice
                                }
                                onChangeDate={this.onChangeDate}
                                onDeleteReceipt={this.onDeleteReceipt}
                                isFetchingQuantity={
                                  this.state.isFetchingQuantity
                                }
                                onChangeQuantity={this.onChangeQuantity}
                                selectReceipt={this.selectReceipt}
                                stores={this.state.stores}
                                receipts={this.state.receipts}
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
                    <Login demo={demo} permitAccess={this.permitAccess} />
                  )}
                </HashRouter>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
export default App;
