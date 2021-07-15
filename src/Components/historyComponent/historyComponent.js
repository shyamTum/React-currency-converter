 import React from "react";
 import './historyComponent.css';
 import SelectComponent from '../selectComponent/selectComponent';

function HistoryComponent (props) {

	return (<div>
             <input type = 'date' name="Select Date" onChange = {props.onChangeDate} 
              min="01-01-2018" max={props.maxDate}/>
              <SelectComponent onChangeHandler = {props.onChangeQueryFromCurrency} listOfCurrencies = {props.listOfCurrencies} 
                   selectedCurrency = {props.selectedCurrency} styleElement = {{marginRight: '10px'}}/>
              
              <SelectComponent onChangeHandler = {props.onChangeQueryToCurrency} listOfCurrencies = {props.listOfCurrencies} 
                   selectedCurrency = {props.selectedCurrency}/>

             <label> result </label>
             <input type = 'text' className = 'historyRateResult' value = {props.queryHistoryValue} readOnly/>
             
           </div>);
  }

export default HistoryComponent;
