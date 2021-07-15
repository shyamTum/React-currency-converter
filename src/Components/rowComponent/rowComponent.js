 import React from "react";
 import './rowComponent.css';
 import SelectComponent from '../selectComponent/selectComponent';

function RowComponent (props) {
	return (<div>
             <input type = 'number' value = {props.inputVal} onChange = {props.onchangeInputVal} onKeyDown = {props.onchangeInputVal}/>
             <SelectComponent onChangeHandler = {props.onChangeCurrency} listOfCurrencies = {props.listOfCurrencies} 
                   selectedCurrency = {props.selectedCurrency}/>
           </div>);
  }
//}

export default RowComponent;
