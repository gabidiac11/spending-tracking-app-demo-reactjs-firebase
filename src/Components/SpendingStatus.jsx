import React, { Component } from "react";
import { Button } from "semantic-ui-react";

import Receipt from "./Recept.jsx";
import { todaysDate, cleanFloatNumberErrors } from "../utils/FunctiiUtile.js";
import ProductUtilityBum from "./reusableFields/ProductUtilityBum.js";


class SpendingStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      good_percent: 80,
      all_products: [],
      all_products_filtered:[],
      products_totals_filtered:{},
      total_price_all: 0,
      total_good: 0,
      total_bad: 0,
      date_filter_start: "START",
      date_filter_end: "END",
      utility_filter_index:0,
      utilities:[
        {idle:true},
        {utility:true},
        {utility:false}
      ]
    };
  }

  componentDidMount = () => {
    this.setUpProductChart();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.receipts !== this.props.receipts) {
      this.setUpProductChart();
    }
  };
   sort_products = ( product_1, product_2 ) => {
    if ( product_1.total_price < product_2.total_price ){
      return 1;
    }
    if ( product_1.total_price > product_2.total_price ){
      return -1;
    }
    return 0;
  }
  filter_status = () => {
    let {all_products_filtered, products_totals_filtered, utility_filter_index} = this.state;
    let utils = [true, false];
    let total_good = 0;
    let total_bad = 0;

    for(let ref_id in products_totals_filtered)
    {
      const product = all_products_filtered.find((product) => {return ref_id === product.ref_id; });
      if(utility_filter_index > 0)
      {
        if(utils[utility_filter_index-1] !== product.utility)
        {
          continue;
        }
      }
      if(product.utility)
      {
        total_good += products_totals_filtered[ref_id];
      }
      else
      {
        total_bad += products_totals_filtered[ref_id];
      }
    }
    total_good = Math.floor((total_good) * 100) / 100;
    total_bad = Math.floor((total_bad) * 100) / 100;
    const total_price_all = Math.floor((total_good + total_bad) * 100) / 100;
    const good_percent = Math.floor(((total_good * 100) / total_price_all) * 100) / 100;

    this.setState({
      total_bad: total_bad,
      total_good:total_good,
      good_percent:good_percent,
      total_price_all:total_price_all
    });
  }
  setUpProductChart = () => {
    let { receipts } = this.props;
    let all_products = {};
    let total_good = 0;
    let total_bad = 0;
    let products_totals_filtered  = {};
    for (let r_id in receipts) {
      const date_txt = receipts[r_id].date;
      for (let p_id in receipts[r_id].products) {
        receipts[r_id].products[p_id].price = cleanFloatNumberErrors(receipts[r_id].products[p_id].price);
      }
    }

    for (let r_id in receipts) {
      const date_txt = receipts[r_id].date;
      for (let p_id in receipts[r_id].products) {
        const prod = receipts[r_id].products[p_id];
        if (!prod.quantity) {
          prod.quantity = 1;
        }
        const total_p_price =
          Math.floor(prod.price * prod.quantity * 100) / 100;
        if (prod.utility === true) {
          total_good += total_p_price;
        } else {
          total_bad += total_p_price;
        }

        if (all_products[prod.refenceId]) {
          all_products[prod.refenceId] = {
            ...all_products[prod.refenceId],
            total_price:
              all_products[prod.refenceId].total_price + total_p_price,
              date_indexing: {
                ...all_products[prod.refenceId].date_indexing,
                [date_txt]:all_products[prod.refenceId][date_txt] ? all_products[prod.refenceId][date_txt] + total_p_price : total_p_price
              },
          };
        } else {
          all_products[prod.refenceId] = {
            ...prod,
            total_price: total_p_price,
            date_indexing: {
            [date_txt]: total_p_price,
            }
          };
        }
        products_totals_filtered[prod.refenceId] = Math.floor((all_products[prod.refenceId].total_price) * 100) / 100;
      }
    }
    total_good = Math.floor((total_good) * 100) / 100;
    total_bad = Math.floor((total_bad) * 100) / 100;
    const total_price_all = Math.floor((total_good + total_bad) * 100) / 100;
    const good_percent = Math.floor(((total_good * 100) / total_price_all) * 100) / 100;
    
    
    all_products = Object.keys(all_products).map(ref_id => {
      return {...all_products[ref_id], ref_id: ref_id};
    });
    all_products.sort(this.sort_products);
    const all_products_filtered = JSON.parse(JSON.stringify(all_products), true);
    this.setState({
      products_totals_filtered: products_totals_filtered,
      all_products_filtered:all_products_filtered,
      all_products: all_products,
      good_percent: good_percent,
      total_price_all: total_price_all,
      total_good: total_good,
      total_bad: total_bad
    });
  };

  filter_products_date = () => {
    const {all_products} = this.state;
    let products_totals_filtered = {};

    const all_products_filtered = all_products.filter( product => {
      let total_filtered = 0;
      const {date_filter_start, date_filter_end} = this.state;
      let date_start = null;
      let date_end = null;

      if(date_filter_start !== 'START' )
      {
        date_start = new Date(date_filter_start);
      }
      if(date_filter_end !== 'END')
      {
        date_end = new Date(date_filter_end);
      }
      for(let date_txt in product.date_indexing)
      {
        const date = new Date(date_txt);
        if(date_start != null && date_start > date)
        {
          continue;
        }
        if(date_end != null && date_end < date)
        {
          continue;
        }
        total_filtered += product.date_indexing[date_txt];
      }
      if(total_filtered === 0) return false;
      products_totals_filtered[product.ref_id] = Math.floor(total_filtered*100)/100;
      return true;
  });
  this.setState({
    all_products_filtered:all_products_filtered,
    products_totals_filtered:products_totals_filtered
  }, () => {
    this.filter_status();
  })
  }
  render() {
    return (
      <div className="full_container">
        <div className="history_status_container">
          <div className="_container _flex_space_between generic_font">
            {this.state.date_filter_start === "START" ? (
              <div onClick={()=>this.setState({date_filter_start:todaysDate()}, ()=>{
                this.filter_products_date();
              })} >Start  DATE (press)</div>
            ) : (
              <input
                type="date"
                value={this.state.date_filter_start}
                onChange={e => {
                  this.setState({
                    date_filter_start: e.target.value
                  }, ()=>{
                    this.filter_products_date();
                  });
                }}
              />
            )}
            {this.state.date_filter_end === "END" ? (
              <div onClick={()=>this.setState({date_filter_end:todaysDate()}, ()=>{
                this.filter_products_date();
              })}>End</div>
            ) : (
              <input
                type="date"
                value={this.state.date_filter_end}
                onChange={e => {
                  this.setState({
                    date_filter_end: e.target.value
                  }, ()=>{
                    this.filter_products_date();
                  });
                }}
              />
            )}
          </div>
          <div className="history_status_chart sums">
            <div className="text_">{this.state.total_good} ron</div>
            <div className="text_">{this.state.total_bad} ron</div>
          </div>
          <div className="history_status_chart">
            <div
              style={{ width: this.state.good_percent + "%" }}
              className="good"
            ></div>
            <div
              style={{ width: 100 - this.state.good_percent + "%" }}
              className="bad"
            ></div>
          </div>
          <div className="legends_chart">
            <div className="legends_content_">
              <div className="spending_legend_squere good"></div>
              <div className="spending_legend_squere">Good Spending</div>
            </div>
            <div className="legends_content_">
              <div className="spending_legend_squere bad"></div>
              <div className="spending_legend_squere">Bad Spending</div>
            </div>
            <div className="legends_content_">
              Total {Number(this.state.total_price_all).toFixed(2)}
            </div>
          </div>
          <div className="_container _mg_top_40 title_box_bottom_border_">
            <div className="_display_flex generic_font utility_switcher" onClick={()=>{
                  let {utility_filter_index} = this.state;
                  utility_filter_index = utility_filter_index >=2  ? 0 : utility_filter_index += 1;
                  this.setState({utility_filter_index:utility_filter_index}, ()=>{
                    this.filter_status();
                  });
              }}>
             
              <ProductUtilityBum {...this.state.utilities[this.state.utility_filter_index]} /> 
               <div className="margin_top_20">
                 (press si aici)
               </div>

            </div>
          </div>
          <div className="topProducts_container">
            {this.state.all_products_filtered.map(product => {
              if(this.state.utility_filter_index > 0)
              {
                if(this.state.utilities[this.state.utility_filter_index].utility !== product.utility)
                {
                  return;
                }
              }
              return (
                <div key={product.refenceId} className="product_container">
                  <div className="prod_name"> {product.name}</div>
                  <div className={"prod_utility" + (product.utility ? " UTIL" : " NO")}>
                    {product.utility ? "UTIL" : "NO"}
                  </div>
                  <div className="product_total_money">
                    {this.state.products_totals_filtered[product.ref_id]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default SpendingStatus;
