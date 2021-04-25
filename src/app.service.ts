import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
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

  cronCount: number = 0;

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

      if (assetType == 'Gold') {
        //Live Gold Price[\s\S]+?</html>
        productPriceSectionRE = new RegExp(
          /\<\!\-\- LIVE SPOT GOLD \-\-\>[\s\S]+?\<\!\-\- SILVER \& PGMS \-\-\>/,
          'i'
        );

        yrHighPriceSectionRE = new RegExp(
          /Year High\"[\s\S]+?<\/span><\/td>/,
          'i'
        );

        yrLowPriceSectionRE = new RegExp(
          /Year Low\"[\s\S]+?<\/span><\/td>/,
          'i',
        );

        //This `actualPriceRE` Regex will extract all the $xxx.xx format of prices from the extracted HTML content
        actualPriceRE = new RegExp(
          /[\+|\-|\$]*[\d\,]*\d+\.\d{1,2}[\%]*/,
          'ig');

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
              console.log(priceArray);
            }).catch(function (err) {
              // There was an error
              console.warn('Cannot fetch URL - kitco.com', err);
            }),

            fetch('https://www.bullionbypost.co.uk/gold-price/year/ounces/USD/').then(function (response) {
              // The API call was successful!
              return response.text();
            }).then(function (html) {
              // This is the HTML from our response as a text string
              //console.log(html);
              hgPriceSection = yrHighPriceSectionRE.exec(html)[0];
              year1HighPrice = hgPriceSection.match(actualPriceRE)[0];
              console.log(year1HighPrice);
              lwPriceSection = yrLowPriceSectionRE.exec(html)[0];
              year1LowPrice = lwPriceSection.match(actualPriceRE)[0];
              console.log(year1LowPrice);

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
          /Year High\"[\s\S]+?<\/span><\/td>/,
          'i'
        );

        yrLowPriceSectionRE = new RegExp(
          /Year Low\"[\s\S]+?<\/span><\/td>/,
          'i',
        );

        //This `actualPriceRE` Regex will extract all the $xxx.xx format of prices from the extracted HTML content
        actualPriceRE = new RegExp(
          /[\+|\-|\$]*[\d\,]*\d+\.\d{1,2}[\%]*/,
          'ig');

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
              console.log(priceArray);
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
              console.log(year1HighPrice);
              lwPriceSection = yrLowPriceSectionRE.exec(html)[0];
              year1LowPrice = lwPriceSection.match(actualPriceRE)[0];
              console.log(year1LowPrice);

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
            "yearlowhigh": year1LowPrice + ' | ' + year1HighPrice,
            "time": "$longTime",
          };
          resolve("done!");
        }
        runSilverAsyncFunction();
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

