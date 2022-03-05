import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

interface JSONObject {
  [k: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> { }

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async getAssetQuotes(assetType: string) {

    var productPriceSectionRE, yrHighPriceSectionRE, yrLowPriceSectionRE: RegExp;
    var actualPriceRE: RegExp;
    var priceSection, hgPriceSection, lwPriceSection, year1HighPrice, year1LowPrice: String;
    var dfSymbol, dfRegularMarketPrice, dfRegularMarketChange, dfRegularMarketChangePercent, dfDaysRange: String;
    var dfArrayRE: RegExp;
    let priceMap: {};
    var priceArray: String[];
    var arrayCryptoRegEx: string[];

    let promise = new Promise((resolve, reject) => {

      //This `actualPriceRE` Regex will extract all the $xxx.xx format of prices from the extracted HTML content
      actualPriceRE = new RegExp(
        /[\+|\-|\$]*[\d\,]*\d+\.\d{1,2}[\%]*/,
        'ig');

      if (assetType == 'Gold') {
        //Live Gold Price[\s\S]+?</html>
        productPriceSectionRE = new RegExp(
          /\<\!\-\- LIVE SPOT GOLD \-\-\>[\s\S]+?\<\!\-\- SILVER \& PGMS \-\-\>/,
          'i'
        );

        yrHighPriceSectionRE = new RegExp(
          /Year high<\/span>[\s\S]+?<\/p>/,
          'i'
        );

        yrLowPriceSectionRE = new RegExp(
          /Year low<\/span>[\s\S]+?<\/p>/,
          'i',
        );

        async function runGoldAsyncFunction() {
          await Promise.all([
            fetch('https://www.kitco.com/').then(function (response) {
              // The API call was successful!
              return response.text();
            }).then(function (html) {
              // This is the HTML from our response as a text string
              //console.log(html);
              priceSection = productPriceSectionRE.exec(html)[0];
              priceArray = priceSection.match(actualPriceRE);
              // console.log(priceArray);
            }).catch(function (err) {
              // There was an error
              console.warn('Cannot fetch URL - kitco.com', err);
            })
          ]);

          priceMap = {
            "bidask": priceArray[0] + ' | ' + priceArray[1],
            "lowhigh": priceArray[2] + ' | ' + priceArray[3],
            "change": priceArray[4] + ' | ' + priceArray[5],
            "1month": priceArray[6] + ' | ' + priceArray[7],
            "1year": priceArray[8] + ' | ' + priceArray[9],
            "yearlowhigh": '0,00' + ' | ' + '0.00',
            "time": "$longTime",
          };
          resolve("done!");
        }
        runGoldAsyncFunction();
      }

      if (assetType == 'Silver') {
        //Live Silver Price[\s\S]+?</html>
        productPriceSectionRE = new RegExp(
          /Live Spot Silver Price[\s\S]+?\<\!\-\- BEGIN KITCO 10am FIX \-\-\>/,
          'i'
        );

        yrHighPriceSectionRE = new RegExp(
          /Year high<\/span>[\s\S]+?<\/p>/,
          'i'
        );

        yrLowPriceSectionRE = new RegExp(
          /Year low<\/span>[\s\S]+?<\/p>/,
          'i',
        );

        async function runSilverAsyncFunction() {
          await Promise.all([
            fetch('http://www.kitcosilver.com/').then(function (response) {
              // The API call was successful!
              return response.text();
            }).then(function (html) {
              // This is the HTML from our response as a text string
              //console.log(html);
              priceSection = productPriceSectionRE.exec(html)[0];
              priceArray = priceSection.match(actualPriceRE);
              // console.log(priceArray);
            }).catch(function (err) {
              // There was an error
              console.warn('Cannot fetch URL - kitcosilver.com', err);
            })
          ]);
          priceMap = {
            "bidask": priceArray[0] + ' | ' + priceArray[1],
            "lowhigh": priceArray[2] + ' | ' + priceArray[3],
            "change": priceArray[4] + ' | ' + priceArray[5],
            "1month": priceArray[6] + ' | ' + priceArray[7],
            "1year": priceArray[8] + ' | ' + priceArray[9],
            "yearlowhigh": '0,00' + ' | ' + '0.00',
            "time": "$longTime",
          };
          resolve("done!");
        }
        runSilverAsyncFunction();
      }

      if (assetType != 'Gold' && assetType != 'Silver') {
        var URL: string;

        switch (assetType) {
          case 'BitCoin': {
            URL = 'https://finance.yahoo.com/quote/BTC-USD/';
            dfSymbol = 'BTC-USD';
            break;
          }
          case 'Eth': {
            URL = 'https://finance.yahoo.com/quote/ETH-USD/';
            dfSymbol = 'ETH-USD';
            break;
          }
          case 'Ada': {
            URL = 'https://finance.yahoo.com/quote/ADA-USD/';
            dfSymbol = 'ADA-USD';
            break;
          }
          case 'Dot': {
            URL = 'https://finance.yahoo.com/quote/DOT-USD';
            dfSymbol = 'DOT-USD';
            break;
          }
          case 'Lnk': {
            URL = 'https://finance.yahoo.com/quote/LINK-USD/';
            dfSymbol = 'LINK-USD';
            break;
          }
          case 'Vet': {
            URL = 'https://finance.yahoo.com/quote/VET-USD/';
            dfSymbol = 'VET-USD';
            break;
          }
          case 'Sol': {
            URL = 'https://finance.yahoo.com/quote/SOL-USD/';
            dfSymbol = 'SOL-USD';
            break;
          }
          case 'Ava': {
            URL = 'https://finance.yahoo.com/quote/AVAX-USD/';
            dfSymbol = 'AVAX-USD';
            break;
          }
          case 'Ura': {
            URL = 'https://finance.yahoo.com/quote/URA/';
            dfSymbol = 'URA';
            break;
          }
          case 'Sus': {
            URL = 'https://finance.yahoo.com/quote/SUSHI-USD/';
            dfSymbol = 'SUSHI-USD';
            break;
          }
          case 'Alg': {
            URL = 'https://finance.yahoo.com/quote/ALGO-USD/';
            dfSymbol = 'ALGO-USD';
            break;
          }
          case 'CrudeOil': {
            URL = 'https://finance.yahoo.com/quote/CL=F/';
            dfSymbol = 'CL=F';
            break;
          }
          case 'USD': {
            URL = 'https://finance.yahoo.com/quote/DX=F/';
            dfSymbol = 'DX=F';
            break;
          }
        }

        // RegEx to appropriate data fields from HTML
        arrayCryptoRegEx = [
          'data-symbol="' + dfSymbol + '"[ \\S]+?data-field=\"regularMarketPrice\"[\\s\\S]+?value=\"([\\s\\S]+?)\"',
          'data-symbol="' + dfSymbol + '"[\\s\\S]+?data-field=\"regularMarketChange\"[\\s\\S]+?value=\"([\\s\\S]+?)\"',
          'data-symbol="' + dfSymbol + '" data-field=\"regularMarketChangePercent\"[ \\S]+?data-pricehint[ \\S]+?value=\"([\\S]+?)\"',
          'data-test="DAYS_RANGE-value">([\\s\\S]+?)</td>'
        ];

        // RegEx to extract values to 2 decimal place
        const strRangePairsRegEx = new RegExp('([\\d,]+?\\.\\d\\d)[ \\S]+?([\\d,]+?\\.\\d\\d)', 'i');

        async function runCryptoOilUSDAsyncFunction() {
          await fetch(URL).then(function (response) {
            // The API call was successful!
            return response.text();
          }).then(function (html) {
            // This is the HTML from our response as a text string
            if (html == null || html == undefined) {
              console.error('Error fetching', URL);
            } else {
              dfRegularMarketPrice = '';
              //Loop through selected data fields in HTML
              arrayCryptoRegEx.forEach(function (item, index) {
                var formattedValue: String;
                // console.log("elementRegEx : "+ item);
                dfArrayRE = new RegExp(
                  item,
                  'i'
                );
                switch (index) {
                  case 0: { //regularMarketPrice
                    const extractedValue = dfArrayRE.exec(html)[1];
                    // console.log(extractedValue);
                    const decimalIndex = (extractedValue.indexOf('.') > 0) ? extractedValue.indexOf('.') : 9; // extract the whole string if there is no decimal in value
                    dfRegularMarketPrice = parseFloat(extractedValue.substring(0, decimalIndex + 3)).toLocaleString('en');
                    // console.log(dfRegularMarketPrice);
                  };
                    break;
                  case 1: { //regularMarketChange
                    const extractedValue = dfArrayRE.exec(html)[1];
                    const decimalIndex = (extractedValue.indexOf('.') > 0) ? extractedValue.indexOf('.') : 9; // extract the whole string if there is no decimal in value
                    dfRegularMarketChange = parseFloat(extractedValue.substring(0, decimalIndex + 3)).toLocaleString('en');
                    // console.log(dfRegularMarketChange);
                  };
                    break;
                  case 2: { //regularMarketChangePercent
                    const extractedValue = dfArrayRE.exec(html)[1];
                    const numExtractedValue = (Number(extractedValue) * 100);
                    const decimalIndex = (extractedValue.indexOf('.') > 0) ? extractedValue.indexOf('.') : 9; // extract the whole string if there is no decimal in value
                    dfRegularMarketChangePercent = numExtractedValue.toString().substring(0, decimalIndex + 3) + "%";
                    // console.log(dfRegularMarketChangePercent);
                  };
                    break;
                  case 3: { //DAYS_RANGE
                    const extractedValue = dfArrayRE.exec(html)[1];

                    // clean up vales to 2 decimal place
                    const extractedValueLow = strRangePairsRegEx.exec(extractedValue)[1];
                    const extractedValueHigh = strRangePairsRegEx.exec(extractedValue)[2];

                    dfDaysRange = extractedValueLow + '|' + extractedValueHigh;
                    // console.log(dfDaysRange);
                  };
                    break;
                }

              });
              if (dfRegularMarketPrice == '') {
                priceMap = {
                  "price": '0',
                  "change": '0' + ' | ' + '0',
                  "lowhigh": '0' + ' | ' + '0',
                  "time": "$longTime",
                };
              } else {
                priceMap = {
                  "price": dfRegularMarketPrice,
                  "change": dfRegularMarketChange + ' | ' + dfRegularMarketChangePercent,
                  "lowhigh": dfDaysRange,
                  "time": "$longTime",
                };
              }
              // console.dir(priceMap);
              resolve("done!");
            }
          }).catch(function (err) {
            // There was an error
            console.warn('Cannot parse data at URL: ' + URL + ". Error", err);
          });
        }
        runCryptoOilUSDAsyncFunction()
      }

    });

    let result = await promise; // wait until the promise resolves (*)
    return priceMap;
  }

  async onModuleInit() {
    this.$connect;
  }

  async onModuleDestroy() {
    this.$disconnect;
  }

}

