/******************************************************************************
 * @Author                : David Petersen <david.petersen@wgu.edu>           *
 * @CreatedDate           : 2024-11-20 14:00:29                               *
 * @LastEditors           : David Petersen <david.petersen@wgu.edu>           *
 * @LastEditDate          : 2024-11-20 15:27:34                               *
 * @FilePath              : sam-df-template/sam-app/src/index.js              *
 * @CopyRight             : Western Governors University                      *
 *****************************************************************************/

const AWS = require('aws-sdk');
const { Builder } = require('selenium-webdriver');

const s3 = new AWS.S3();
const devicefarm = new AWS.DeviceFarm();

async function setupWebDriver(testGridUrl) {
  return await new Builder()
    .usingServer(testGridUrl)
    .withCapabilities({ browserName: 'chrome' })
    .build();
}

async function runTest(driver, url) {
  await driver.get(url);
  const title = await driver.getTitle();
  const html = await driver.getPageSource();
  const screenshot = await driver.takeScreenshot();

  const key = `screenshots/${Date.now()}.png`;
  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(screenshot, 'base64'),
      ContentType: 'image/png',
    })
    .promise();

  return { title, html, screenshotKey: key };
}

async function createTestGridUrl(projectArn) {
  const response = await devicefarm
    .createTestGridUrl({
      projectArn,
      expiresInSeconds: 300,
    })
    .promise();
  return response.url;
}

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  let driver;
  const crawlUrl = event.input.crawlUrl;
  try {
    const testGridUrl = await createTestGridUrl(
      process.env.DEVICE_FARM_PROJECT_ARN
    );
    driver = await setupWebDriver(testGridUrl);

    const results = await runTest(driver, crawlUrl);

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Test execution failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Test failed',
        error: error.message,
      }),
    };
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
};