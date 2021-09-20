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
        var idxLow, idxHigh: number;

        switch (assetType) {
          case 'CrudeOil': {
            productPriceSectionRE = new RegExp(
              /<div id="quotes_summary_current_data"[\s\S]+?<div class="float_lang_base_2/,
              'i'
            );
            URL = 'https://www.investing.com/commodities/crude-oil';
            idxLow = 5;
            idxHigh = 6;

            break;
          }
          case 'USD': {
            productPriceSectionRE = new RegExp(
              /data-test="instrument-price-last"[\s\S]+?data-test="instrument-bottom-bar-view"/,
              'i'
            );
            URL = 'https://www.investing.com/indices/usdollar';
            idxLow = 4;
            idxHigh = 5;
            break;
          }
        }
        async function runCommdAsyncFunction() {
          await fetch(URL).then(function (response) {
            // The API call was successful!
            return response.text();
          }).then(function (html) {
            // This is the HTML from our response as a text string
            //console.log(html);
            priceSection = productPriceSectionRE.exec(html)[0];
            priceArray = priceSection.match(actualPriceRE);
            //console.log(JSON.stringify(priceArray));
          }).catch(function (err) {
            // There was an error
            console.warn('Cannot fetch URL - $URL', err);
          });

          priceMap = {
            "price": priceArray[0],
            "change": priceArray[1] + ' | ' + priceArray[2],
            "lowhigh": priceArray[idxLow] + ' | ' + priceArray[idxHigh],
            "time": "$longTime",
          };
          // console.log("Commodities Price Array");
          // console.dir(priceArray);
          // console.dir(priceMap);
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
        }

        async function runCryptoAsyncFunction() {
          await fetch(URL).then(function (response) {
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
            // console.warn('Cannot fetch URL - ' + URL, err);
          });
          let pal = priceArray.length;
          if (assetType != 'Ura') {
            priceMap = {
              "price": priceArray[pal - 115],
              "change": priceArray[pal - 113] + ' | ' + priceArray[pal - 112],
              "lowhigh": priceArray[pal - 12] + ' | ' + priceArray[pal - 11],
              "time": "$longTime",
            };
          } else {
            priceMap = {
              "price": priceArray[pal - 115],
              "change": priceArray[pal - 113] + ' | ' + priceArray[pal - 112],
              "lowhigh": priceArray[pal - 5] + ' | ' + priceArray[pal - 4],
              "time": "$longTime",
            };
          }
          // console.log("Crypto Price Array");
          // console.dir(priceArray.slice(-20, -1));
          // console.dir(priceArray.slice(-120, -99));
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

