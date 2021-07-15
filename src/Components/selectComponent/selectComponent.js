 import React from "react";

function SelectComponent (props) {
	const listOfCurrencies = props.listOfCurrencies;
	return (
             <select onChange = {props.onChangeHandler} style = {props.styleElement} 
                 multiple = {props.multiple? 'multiple' : ''}>
                 {listOfCurrencies.map(currency => {
                    return <option key={currency} value={currency} 
                        selected = {props.selectedCurrency === currency.substring(currency.length - 3)}>
                        {currency.substring(currency.length - 3)}
                    </option>
                 })}
             </select>
           );
  }
//}

export default SelectComponent;
