import mapshaper from "mapshaper";
import fs from "fs";

async function compressMapData (mapData, factor, lambda = true) {
  const baseFilePath =  (lambda) ? '/tmp/' : 'geojson'
  const d = fs.mkdtempSync(baseFilePath, null);
  const tmpFile = d + '/input.geojson';
  const simplifiedFile = d + '/output.geojson';
  fs.writeFileSync(tmpFile, JSON.stringify(mapData, null, 2));
  await mapshaper.runCommands(`-i ${tmpFile} -simplify ${factor * 100}% -o ${simplifiedFile}`);
  const simplifiedData = fs.readFileSync(simplifiedFile, {encoding: 'utf-8'});
  fs.rmSync(tmpFile);
  fs.rmSync(simplifiedFile);
  fs.rmdirSync(d);
  return JSON.parse(simplifiedData);
}

export default compressMapData;
