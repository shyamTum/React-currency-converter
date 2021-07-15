import React from 'react';
import './App.css';
import RowComponent from './Components/rowComponent/index';
import HistoryComponent from './Components/historyComponent/index';
import { PropTypes } from 'prop-types';
import ChartComponent from './Components/chartComponent/index';
import NavbarComponent from './Components/navbarComponent/index';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      listOfCurrencies: ['USDUSD'],
      listOfCurrencyRates: [],
      listOfAllCurrencies: [],
      listOfAllCurrencieRates: [],
      listOfMultiSelectedChartOptions: [],
      fromCurrency: 'EUR',
      toCurrency: 'USD',
      fromInputVal: 1,
      toInputVal: 1,
      queryDate: '',
      queryFromCurrency: 'USD',
      queryToCurrency: 'USD',
      queryHistoryValue: '',
      options: {
        chart: {
          id: 'currencies-conversion-chart'
        },
        xaxis: {
          categories: ['USDCHF', 'USDEUR']
        }
      },
      series: [{
        name: 'series-1',
        data: [1, 10]
      }]
    }
    this.CurrencyLayerClient = require('currencylayer-client');
    this.client = new this.CurrencyLayerClient({apiKey: '3d99d16e1df524263c7f24492e028000'});
    this.selectMulCurrencies = React.createRef();
  }

  componentDidMount() {
    this.fetchCurrencies(this.client);
    this.fetchAllCurrencies(this.client);
  }
  
  fetchCurrencies(client) {
    client.live({currencies: 'CHF,EUR'})
      .then((result) => {
        if(result.quotes != null) {
          this.setState(prevState => ({
            listOfCurrencies: [...prevState.listOfCurrencies, ...Object.keys(result.quotes)],
            listOfCurrencyRates: result.quotes
          }));
          this.setState({toCurrency:this.state.listOfCurrencies[0].substring(this.state.listOfCurrencies[0].length - 3)});
          this.setState({toInputVal: this.state.fromInputVal * 1/this.state.listOfCurrencyRates['USDEUR']})
        }
      })
      .catch(err => {
        console.log(err.code)
        console.log(err.message)
      });
  }

  fetchAllCurrencies(client) {
    client.live()
      .then((result) => {
        if(result.quotes != null) {
          this.setState(prevState => ({
            listOfAllCurrencies: [...prevState.listOfAllCurrencies, ...Object.keys(result.quotes)],
            listOfAllCurrencieRates: result.quotes
          }));
        }
        this.setState({series: [{
        name: 'series-1',
        data: [this.state.listOfAllCurrencieRates['USDCHF'], this.state.listOfAllCurrencieRates['USDEUR']]
      }]})
      })
      .catch(err => {
        console.log(err.code)
        console.log(err.message)
      });
  }

  async fetchHistoricalData(client, date, currencies) {
    client.historical({date: date, currencies: currencies})
      .then( result => {
        if (Object.keys(result.quotes).length === 1) {
          this.setState({queryHistoryValue : 1});
        }
        else {
          this.setState({queryHistoryValue : this.state.queryFromCurrency + ': 1, ' + this.state.queryToCurrency + ': ' + result.quotes[Object.keys(result.quotes)[0]] / result.quotes[Object.keys(result.quotes)[1]]});
        }
        
      });

    if (this.state.queryDate < 1) {
      await this.setState({queryDate : this.calculateToday()});
    }
  }

  findConverstionRate(fromCurrency, toCurrency) {
    let listOfCurrencyRates = this.state.listOfCurrencyRates;

    fromCurrency = fromCurrency > 3? fromCurrency.substring(fromCurrency.length - 3) : fromCurrency;
    toCurrency = toCurrency > 3? toCurrency.substring(toCurrency.length - 3) : toCurrency;

    if (toCurrency === fromCurrency){
        return 1;
      }
    
    else if (fromCurrency === 'USD') {
      return listOfCurrencyRates['USD'+ toCurrency].toFixed(2);
    }
    else if (toCurrency === 'USD'){
      return 1 /listOfCurrencyRates['USD' + fromCurrency].toFixed(2);
    }

    return listOfCurrencyRates['USD'+ toCurrency]/listOfCurrencyRates['USD'+fromCurrency].toFixed(2);
  }

  onChangeToCurrency = async(event) => {
      await this.setState({toCurrency: event.target.value.slice(event.target.value.length - 3)});
      await this.setState(prevState => ({
          fromInputVal: (prevState.toInputVal * this.findConverstionRate(event.target.value.substring(event.target.value.length - 3), 
                        this.state.fromCurrency))
      }));

  }

  onChangeFromCurrency = async(event) => {
      await this.setState({fromCurrency: event.target.value.substring(event.target.value.length - 3)});
      await this.setState(prevState => ({
          toInputVal: (prevState.fromInputVal * this.findConverstionRate(event.target.value.substring(event.target.value.length - 3), 
                        this.state.toCurrency))
      }));
  }

  onChangeToInputVal = async(event) => {
    
      await this.setState({toInputVal: event.target.value?  event.target.value : 1});
      const conversionRate = this.state.toCurrency !== this.state.fromCurrency ? this.findConverstionRate(this.state.toCurrency.substr(this.state.toCurrency.length - 3) , this.state.fromCurrency.substr(this.state.fromCurrency.length - 3)) : 1;
      await this.setState({fromInputVal: event.target.value * conversionRate});
  }

  onChangeFromInputVal  = async(event) => {
     
      await this.setState({fromInputVal: event.target.value?  event.target.value : 1});
      //const conversionRate = this.state.toCurrency !== this.state.fromCurrency ? 1 / this.state.listOfCurrencyRates[this.state.toCurrency.substr(this.state.toCurrency.length - 3) + this.state.fromCurrency.substr(this.state.fromCurrency.length - 3)] : 1;
      const conversionRate = this.state.toCurrency !== this.state.fromCurrency ? 1 / this.findConverstionRate(this.state.toCurrency.substr(this.state.toCurrency.length - 3) , this.state.fromCurrency.substr(this.state.fromCurrency.length - 3)) : 1;
    
    await this.setState({toInputVal: event.target.value * conversionRate});
  }

  onChangeDate = async(event) => {
    await this.setState({queryDate : event.target.value});
    this.fetchHistoricalData(this.client, event.target.value, this.state.queryToCurrency + ',' + this.state.queryFromCurrency);
  }

  onChangeQueryToCurrency = async(event) => {
    await this.setState ({queryToCurrency : event.target.value.substring(event.target.value.length - 3)});
    this.fetchHistoricalData(this.client, this.state.queryDate, this.state.queryToCurrency + ',' + this.state.queryFromCurrency);
  }

  onChangeQueryFromCurrency = async(event) => {
    await this.setState ({queryFromCurrency : event.target.value.substring(event.target.value.length - 3)});
    this.fetchHistoricalData(this.client, this.state.queryDate, this.state.queryToCurrency + ',' + this.state.queryFromCurrency);
  }

  onClickChartButton = async(event) => {
    let tempArr= [];
    
      for (let i = 0; i<this.state.listOfMultiSelectedChartOptions.length; i++) {
          tempArr.push(this.state.listOfAllCurrencieRates[this.state.listOfMultiSelectedChartOptions[i]]);
      }
      await this.setState({options: {chart: {
          id: 'currencies-conversion-chart'
        },
        xaxis: {
          categories: this.state.listOfMultiSelectedChartOptions
        }
      }, series: [{
        name: 'series-1',
        data: tempArr
      }]
    });
  }

  handleSelectMul = async(event) => {
    let tempArr = [];
    for (let i=0; i < event.target.selectedOptions.length; i++) {
      tempArr.push(event.target.selectedOptions[i].value);
    }
    await this.setState ({listOfMultiSelectedChartOptions : tempArr});
  }

  calculateToday = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    if(dd<10){
       dd='0'+dd
    } 
    if(mm<10){
       mm='0'+mm
    } 

    return yyyy+'-'+mm+'-'+dd;
  }


  render() {
    const today = this.calculateToday();
    return (
      <>
        <h1> Currency - Converter </h1>
        
        <Router>
            <NavbarComponent/>
            <Switch>
              <Route exact path = "/">
                 <label>Converted Currency</label>
                  <RowComponent key = '1' listOfCurrencies = {this.state.listOfCurrencies} 
                     selectedCurrency = {this.state.toCurrency} 
                     onChangeCurrency = {this.onChangeToCurrency} 
                     inputVal = {this.state.toInputVal} 
                     onchangeInputVal = {this.onChangeToInputVal}
                     />
                  <div className = 'equals'>=</div>
                  <label>Base Currency</label>
                  <RowComponent key = '2' listOfCurrencies = {this.state.listOfCurrencies} 
                      selectedCurrency = {this.state.fromCurrency} 
                      onChangeCurrency = {this.onChangeFromCurrency} 
                      inputVal = {this.state.fromInputVal} 
                      onchangeInputVal = {this.onChangeFromInputVal}/>
              </Route>
                
              <Route exact path = "/Historical_Data">
                  <div className='historicalDataLabel'>   
                  <label style = {{marginRight: '10px'}}>Historical Data</label>
                  <HistoryComponent className = 'dateItem' onChangeDate = {this.onChangeDate} maxDate = {today}
                          listOfCurrencies = {this.state.listOfCurrencies} queryHistoryValue = {this.state.queryHistoryValue}
                          onChangeQueryToCurrency = {this.onChangeQueryToCurrency}
                          onChangeQueryFromCurrency = {this.onChangeQueryFromCurrency}
                          />
                  </div> 
              </Route>  

              <Route exact path = "/chart">
                  <div className='Chart'>   
                  <label style = {{marginRight: '10px'}}>Chart</label>
                  <ChartComponent className = 'dateItem' listOfCurrencies = {this.state.listOfAllCurrencies} 
                          options = {this.state.options}
                          series = {this.state.series}
                          onClickChartButton = {this.onClickChartButton}
                          setRef = {this.selectMulCurrencies}
                          handleSelectMul = {this.handleSelectMul}
                          />
                  </div>        
              </Route>
                
                
            </Switch>
            
        </Router>        
        
      </>
    );
  }
}

App.propTypes = {
      listOfCurrencies: PropTypes.array,
      listOfCurrencyRates: PropTypes.array,
      fromCurrency: PropTypes.string,
      toCurrency: PropTypes.string,
      fromInputVal: PropTypes.number,
      toInputVal: PropTypes.number
}
  
export default App;