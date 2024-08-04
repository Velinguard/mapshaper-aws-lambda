import compressMapData from "./map-compressor.mjs";

const serialize = function (object) {
  return JSON.stringify(object, null, 2)
};

const formatError = function (error) {
  return {
    "statusCode": error.statusCode,
    "headers": {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": error.code
    },
    "isBase64Encoded": false,
    "body": error.code + ": " + error.message
  }
};

const formatResponse = function (body) {
  return {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "isBase64Encoded": false,
    "multiValueHeaders": {
      "X-Custom-Header": ["My value", "My other value"],
    },
    "body": body
  }
};

// Handler
export const handler = async (event, context) => {
  try {
    let inputData = JSON.parse(event.body);
    let mapData = await compressMapData(inputData.map, inputData.percentage, true)
    return formatResponse(serialize(mapData))
  } catch (error) {
    console.error(error)
    return formatError(error)
  }
}
