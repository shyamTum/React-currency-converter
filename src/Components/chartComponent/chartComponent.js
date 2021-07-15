 import React from "react";
 import './chartComponent.css';
 import Chart from 'react-apexcharts';
 import SelectComponent from '../selectComponent/selectComponent';

function ChartComponent (props) {

	return (<div>
             <SelectComponent styleElement = {{marginRight: '10px', height: '200px'}} multiple = {true} onChangeHandler = {props.handleSelectMul}
                  listOfCurrencies = {props.listOfCurrencies}/>
		     
             <button onClick = {props.onClickChartButton}>Show result</button>
             <label> result </label>
             <Chart options={props.options} series={props.series} type="bar" width={500} height={600} />
             
           </div>);
  }

export default ChartComponent;

