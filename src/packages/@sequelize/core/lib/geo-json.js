"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var geo_json_exports = {};
__export(geo_json_exports, {
  GeoJsonType: () => GeoJsonType,
  assertIsGeoJson: () => assertIsGeoJson,
  assertIsGeoJsonGeometryCollection: () => assertIsGeoJsonGeometryCollection,
  assertIsGeoJsonLineString: () => assertIsGeoJsonLineString,
  assertIsGeoJsonMultiLineString: () => assertIsGeoJsonMultiLineString,
  assertIsGeoJsonMultiPoint: () => assertIsGeoJsonMultiPoint,
  assertIsGeoJsonMultiPolygon: () => assertIsGeoJsonMultiPolygon,
  assertIsGeoJsonPoint: () => assertIsGeoJsonPoint,
  assertIsGeoJsonPolygon: () => assertIsGeoJsonPolygon
});
module.exports = __toCommonJS(geo_json_exports);
var import_node_util = __toESM(require("node:util"));
var import_check = require("./utils/check.js");
var import_validator_extras = require("./utils/validator-extras.js");
var GeoJsonType = /* @__PURE__ */ ((GeoJsonType2) => {
  GeoJsonType2["Point"] = "Point";
  GeoJsonType2["LineString"] = "LineString";
  GeoJsonType2["Polygon"] = "Polygon";
  GeoJsonType2["MultiPoint"] = "MultiPoint";
  GeoJsonType2["MultiLineString"] = "MultiLineString";
  GeoJsonType2["MultiPolygon"] = "MultiPolygon";
  GeoJsonType2["GeometryCollection"] = "GeometryCollection";
  return GeoJsonType2;
})(GeoJsonType || {});
const geoJsonTypeArray = Object.keys(GeoJsonType);
function assertIsGeoJson(value) {
  assertIsBaseGeoJson(value);
  switch (value.type) {
    case "Point" /* Point */:
      assertIsGeoJsonPoint(value);
      break;
    case "LineString" /* LineString */:
      assertIsGeoJsonLineString(value);
      break;
    case "Polygon" /* Polygon */:
      assertIsGeoJsonPolygon(value);
      break;
    case "MultiPoint" /* MultiPoint */:
      assertIsGeoJsonMultiPoint(value);
      break;
    case "MultiLineString" /* MultiLineString */:
      assertIsGeoJsonMultiLineString(value);
      break;
    case "MultiPolygon" /* MultiPolygon */:
      assertIsGeoJsonMultiPolygon(value);
      break;
    case "GeometryCollection" /* GeometryCollection */:
      assertIsGeoJsonGeometryCollection(value);
      break;
    default:
      throw new Error(`GeoJSON object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected one of ${geoJsonTypeArray.join(", ")}`);
  }
}
function validatePosition(tuple, source) {
  if (!Array.isArray(tuple)) {
    throw new Error(`GeoJSON ${source.type} object ${import_node_util.default.inspect(source)} specifies an invalid position: ${import_node_util.default.inspect(tuple)}. Expected an array of numeric values.`);
  }
  for (const coordinate of tuple) {
    if (!import_validator_extras.validator.isNumeric(String(coordinate))) {
      throw new Error(`GeoJSON ${source.type} object ${import_node_util.default.inspect(source)} specifies an invalid point: ${import_node_util.default.inspect(tuple)}. ${import_node_util.default.inspect(coordinate)} is not a numeric value.`);
    }
  }
}
function assertIsBaseGeoJson(value) {
  if (!(0, import_check.isPlainObject)(value)) {
    throw new Error(`${import_node_util.default.inspect(value)} is not a valid GeoJSON object: it must be a plain object.`);
  }
}
function assertIsGeoJsonPoint(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "Point") {
    throw new Error(`GeoJSON Point object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "Point".`);
  }
  const coordinates = value.coordinates;
  if (Array.isArray(coordinates) && coordinates.length === 0) {
    return;
  }
  validatePosition(coordinates, value);
}
function assertIsGeoJsonLineString(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "LineString") {
    throw new Error(`GeoJSON LineString object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "LineString".`);
  }
  const coordinates = value.coordinates;
  if (!Array.isArray(coordinates)) {
    throw new Error(`GeoJSON LineString object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of positions (array of numeric values).`);
  }
  for (const position of coordinates) {
    validatePosition(position, value);
  }
}
function assertIsGeoJsonPolygon(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "Polygon") {
    throw new Error(`GeoJSON Polygon object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "Polygon".`);
  }
  const coordinates = value.coordinates;
  if (!Array.isArray(coordinates)) {
    throw new Error(`GeoJSON Polygon object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of linear ring coordinate arrays. Refer to the GeoJSON specification for more information.`);
  }
  for (const ring of coordinates) {
    if (!Array.isArray(ring)) {
      throw new Error(`GeoJSON Polygon object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of linear ring coordinate arrays. Refer to the GeoJSON specification for more information.`);
    }
    for (const position of ring) {
      validatePosition(position, value);
    }
  }
}
function assertIsGeoJsonMultiPoint(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "MultiPoint") {
    throw new Error(`GeoJSON MultiPoint object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "MultiPoint".`);
  }
  const coordinates = value.coordinates;
  if (!Array.isArray(coordinates)) {
    throw new Error(`GeoJSON MultiPoint object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of point coordinates.`);
  }
  for (const position of coordinates) {
    validatePosition(position, value);
  }
}
function assertIsGeoJsonMultiLineString(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "MultiLineString") {
    throw new Error(`GeoJSON MultiLineString object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "MultiLineString".`);
  }
  const coordinates = value.coordinates;
  if (!Array.isArray(coordinates)) {
    throw new Error(`GeoJSON MultiLineString object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of line string coordinates.`);
  }
  for (const lineString of coordinates) {
    if (!Array.isArray(lineString)) {
      throw new Error(`GeoJSON MultiLineString object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of line string coordinates.`);
    }
    for (const position of lineString) {
      validatePosition(position, value);
    }
  }
}
function assertIsGeoJsonMultiPolygon(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "MultiPolygon") {
    throw new Error(`GeoJSON MultiPolygon object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "MultiPolygon".`);
  }
  const coordinates = value.coordinates;
  if (!Array.isArray(coordinates)) {
    throw new Error(`GeoJSON MultiPolygon object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of polygon coordinates.`);
  }
  for (const polygon of coordinates) {
    if (!Array.isArray(polygon)) {
      throw new Error(`GeoJSON MultiPolygon object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of polygon coordinates.`);
    }
    for (const ring of polygon) {
      if (!Array.isArray(ring)) {
        throw new Error(`GeoJSON MultiPolygon object ${import_node_util.default.inspect(value)} has an invalid or missing "coordinates" property. Expected an array of polygon coordinates.`);
      }
      for (const position of ring) {
        validatePosition(position, value);
      }
    }
  }
}
function assertIsGeoJsonGeometryCollection(value) {
  assertIsBaseGeoJson(value);
  if (value.type !== "GeometryCollection") {
    throw new Error(`GeoJSON GeometryCollection object ${import_node_util.default.inspect(value)} has an invalid or missing "type" property. Expected "GeometryCollection".`);
  }
  const geometries = value.geometries;
  if (!Array.isArray(geometries)) {
    throw new Error(`GeoJSON GeometryCollection object ${import_node_util.default.inspect(value)} has an invalid or missing "geometries" property. Expected an array of GeoJSON geometry objects.`);
  }
  for (const geometry of geometries) {
    assertIsGeoJson(geometry);
  }
}
//# sourceMappingURL=geo-json.js.map
