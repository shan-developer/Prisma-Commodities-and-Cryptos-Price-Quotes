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

  // getHello(): string {
  //   return 'CronCount : ' + this.cronCount.toString();
  // }

  async getAssetQuotes(assetType: string) {

    var productPriceSectionRE, yrHighPriceSectionRE, yrLowPriceSectionRE: RegExp;
    var actualPriceRE: RegExp;
    var priceSection, hgPriceSection, lwPriceSection, year1HighPrice, year1LowPrice: String;
    let priceMap: {};
    var priceArray: String[];

    let promise = new Promise((resolve, reject) => {
      // setTimeout(() => resolve("done!"), 5000)

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
            }),

            fetch('https://www.bullionbypost.co.uk/gold-price/year/ounces/USD/').then(function (response) {
              // The API call was successful!
              return response.text();
            }).then(function (html) {
              // This is the HTML from our response as a text string
              //console.log("=========HTML============");
              //console.log(html);
              //console.log("=========REGEX matching============");
              hgPriceSection = yrHighPriceSectionRE.exec(html)[0];
              //console.log("=========Value matching============");
              year1HighPrice = hgPriceSection.match(actualPriceRE)[0];
              //console.log("==========year1HighPrice===========");
              //console.log(year1HighPrice);
              lwPriceSection = yrLowPriceSectionRE.exec(html)[0];
              year1LowPrice = lwPriceSection.match(actualPriceRE)[0];
              //console.log("=========year1LowPrice============");
              //console.log(year1LowPrice);

            }).catch(function (err) {
              // There was an error
              console.warn('Cannot fetch URL - bullionbypost.co.uk', err);
            })
          ]);
          priceMap = {
            "bidask": priceArray[0] + ' | ' + priceArray[1],
            "lowhigh": priceArray[2] + ' | ' + priceArray[3],
            "change": priceArray[4] + ' | ' + priceArray[5],
            "1month": priceArray[6] + ' | ' + priceArray[7],
            "1year": priceArray[8] + ' | ' + priceArray[9],
            "yearlowhigh": year1LowPrice + ' | ' + year1HighPrice,
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
            }),

            fetch('https://www.bullionbypost.co.uk/silver-price/year/ounces/USD/').then(function (response) {
              // The API call was successful!
              return response.text();
            }).then(function (html) {
              // This is the HTML from our response as a text string
              //console.log(html);
              hgPriceSection = yrHighPriceSectionRE.exec(html)[0];
              year1HighPrice = hgPriceSection.match(actualPriceRE)[0];
              // console.log(year1HighPrice);
              lwPriceSection = yrLowPriceSectionRE.exec(html)[0];
              year1LowPrice = lwPriceSection.match(actualPriceRE)[0];
              // console.log(year1LowPrice);

            }).catch(function (err) {
              // There was an error
              console.warn('Cannot fetch URL - bullionbypost.co.uk', err);
            })
          ]);
          priceMap = {
            "bidask": priceArray[0] + ' | ' + priceArray[1],
            "lowhigh": priceArray[2] + ' | ' + priceArray[3],
            "change": priceArray[4] + ' | ' + priceArray[5],
            "1month": priceArray[6] + ' | ' + priceArray[7],
            "1year": priceArray[8] + ' | ' + priceArray[9],
            "yearlowhigh": year1LowPrice + ' | ' + year1HighPrice,
            "time": "$longTime",
          };
          resolve("done!");
        }
        runSilverAsyncFunction();
      }

      if (assetType == 'CrudeOil' || assetType == 'USD') {
        var URL: string;
        var idxPrice, idxChgPrice, idxChgPercent, idxLow, idxHigh: number;

        switch (assetType) {
          case 'CrudeOil': {
            productPriceSectionRE = new RegExp(
              /Currency in USD[\s\S]+?quote-market-notice/,
              'i'
            );
            // URL = '  ';
            URL = 'https://finance.yahoo.com/quote/CL=F';
            break;
          }
          case 'USD': {
            productPriceSectionRE = new RegExp(
              /Currency in USD[\s\S]+?quote-market-notice/,
              'i'
            );
            // URL = 'https://www.investing.com/indices/usdollar';
            URL = 'https://finance.yahoo.com/quote/DX=F';
            break;
          }
        }
        async function runCommdAsyncFunction() {
          let resHTML: String;
          let combPriceArray = [];

          await fetch(URL).then(function (response) {
            // The API call was successful!
            return response.text();
          }).then(function (html) {
            // This is the HTML from our response as a text string
            if (html == null || html == undefined) {
              console.error('Error fetching', URL);
            } else {
              resHTML = html;
              priceSection = productPriceSectionRE.exec(resHTML)[0];
              priceArray = priceSection.match(actualPriceRE);
              // console.log(priceArray);
            }
          }).catch(function (err) {
            // There was an error
            console.warn('Cannot parse data at URL: ' + URL + ". Error", err);
          });
          if (priceSection == null) {
            priceMap = {
              "price": '0',
              "change": '0' + ' | ' + '0',
              "lowhigh": '0' + ' | ' + '0',
              "time": "$longTime",
            };
          } else {

            // -----DEBUG-----
            // if (assetType == 'CrudeOil') {
            //   console.table(priceArray);
            // }

            combPriceArray.push(priceArray[priceArray.length - 5]); //price
            combPriceArray.push(priceArray[priceArray.length - 3]); //price changed
            combPriceArray.push(priceArray[priceArray.length - 1]); //price changed % percent

            productPriceSectionRE = new RegExp(
              /s Range<[\s\S]+?Volume</,
              'i'
            );

            priceSection = productPriceSectionRE.exec(resHTML)[0];
            priceArray = priceSection.match(actualPriceRE);

            // -----DEBUG-----
            // if (assetType == 'CrudeOil') {
            //   console.table(priceArray);
            // }

            combPriceArray.push(priceArray[priceArray.length - 2]); //low price
            combPriceArray.push(priceArray[priceArray.length - 1]); //high price

            priceMap = {
              "price": combPriceArray[0],
              "change": combPriceArray[1] + ' | ' + combPriceArray[2],
              "lowhigh": combPriceArray[3] + ' | ' + combPriceArray[4],
              "time": "$longTime",
            };

            // if (assetType == 'CrudeOil') {
            //   console.table(priceMap);
            // }
            
          }
          //resolve Promise
          resolve("done!");

        }
        runCommdAsyncFunction()
      }

      if (assetType != 'Gold' && assetType != 'Silver' && assetType != 'CrudeOil' && assetType != 'USD') {
        var URL: string;

        switch (assetType) {
          case 'BitCoin': {
            URL = 'https://finance.yahoo.com/quote/BTC-USD/';
            productPriceSectionRE = new RegExp(
              /Bitcoin USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Eth': {
            URL = 'https://finance.yahoo.com/quote/ETH-USD/';
            productPriceSectionRE = new RegExp(
              /Ethereum USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Ada': {
            URL = 'https://finance.yahoo.com/quote/ADA-USD/';
            productPriceSectionRE = new RegExp(
              /Cardano USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Dot': {
            URL = 'https://finance.yahoo.com/quote/DOT1-USD/';
            productPriceSectionRE = new RegExp(
              /Polkadot USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Lnk': {
            URL = 'https://finance.yahoo.com/quote/LINK-USD/';
            productPriceSectionRE = new RegExp(
              /Chainlink USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Vet': {
            URL = 'https://finance.yahoo.com/quote/VET-USD/';
            productPriceSectionRE = new RegExp(
              /VeChain USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Sol': {
            URL = 'https://finance.yahoo.com/quote/SOL1-USD/';
            productPriceSectionRE = new RegExp(
              /Solana USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Ava': {
            URL = 'https://finance.yahoo.com/quote/AVAX-USD/';
            productPriceSectionRE = new RegExp(
              /Avalanche USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Ura': {
            URL = 'https://finance.yahoo.com/quote/URA/';
            productPriceSectionRE = new RegExp(
              /Global X Uranium ETF[\s\S]+?Avg\. Volume\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Sus': {
            URL = 'https://finance.yahoo.com/quote/SUSHI-USD/';
            productPriceSectionRE = new RegExp(
              /Sushi USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }
          case 'Alg': {
            URL = 'https://finance.yahoo.com/quote/ALGO-USD/';
            productPriceSectionRE = new RegExp(
              /Algorand USD[\s\S]+?Volume \(24hr\)\<\/span\>\<\/td\>/,
              'i'
            );
            break;
          }          
        }

        async function runCryptoAsyncFunction() {
          await fetch(URL).then(function (response) {
            // The API call was successful!
            return response.text();
          }).then(function (html) {
            // This is the HTML from our response as a text string
            if (html == null || html == undefined) {
              console.error('Error fetching', URL);
            } else {
              priceSection = productPriceSectionRE.exec(html)[0];
              priceArray = priceSection.match(actualPriceRE);
              // console.log(priceArray);
            }
          }).catch(function (err) {
            // There was an error
            console.warn('Cannot parse data at URL: ' + URL + ". Error", err);
          });
          if (priceSection == null) {
            priceMap = {
              "price": '0',
              "change": '0' + ' | ' + '0',
              "lowhigh": '0' + ' | ' + '0',
              "time": "$longTime",
            };
          } else {
            let pal = priceArray.length;
            if (assetType != 'Ura') { //Cryptos
              priceMap = {
                "price": priceArray[pal - 108],
                "change": priceArray[pal - 107] + ' | ' + priceArray[pal - 104],
                "lowhigh": priceArray[pal - 6] + ' | ' + priceArray[pal - 5],
                "time": "$longTime",
              };
            } else { //Uranium
              priceMap = {
                "price": priceArray[pal - 114],
                "change": priceArray[pal - 112] + ' | ' + priceArray[pal - 110],
                "lowhigh": priceArray[pal - 4] + ' | ' + priceArray[pal - 3],
                "time": "$longTime",
              };
            }
          }
            // console.log("Crypto Price Array - Length = " + priceArray.length);
            // console.dir(priceArray.slice(-20, -1)); //Day's Range
            // console.dir(priceArray.slice(-120, -99)); //Price and changes
            // console.dir(priceMap);
          resolve("done!");
        }
        runCryptoAsyncFunction()
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

