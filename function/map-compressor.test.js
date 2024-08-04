import compressMapData from "./map-compressor.mjs";
import fs from "fs";

test('Can compress map data', async () => {
  const inputData = fs.readFileSync('testdata/testdata.geojson');
  const inputDataJson = JSON.parse(inputData);
  const outputData = fs.readFileSync('testdata/testdata.output.geojson')
  const data = await compressMapData(inputDataJson.map, inputDataJson.percentage, false);
  expect(data).toEqual(JSON.parse(outputData));
})
