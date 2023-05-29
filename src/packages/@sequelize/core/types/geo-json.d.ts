export declare enum GeoJsonType {
    Point = "Point",
    LineString = "LineString",
    Polygon = "Polygon",
    MultiPoint = "MultiPoint",
    MultiLineString = "MultiLineString",
    MultiPolygon = "MultiPolygon",
    GeometryCollection = "GeometryCollection"
}
interface BaseGeoJson<Type> {
    type: Type;
    properties?: Record<string, unknown>;
    crs?: {
        type: 'name';
        properties: {
            name: string;
        };
    };
}
export type PositionPosition = [x: number, y: number, elevation?: number];
export interface GeoJsonPoint extends BaseGeoJson<'Point'> {
    coordinates: PositionPosition | [];
}
export interface GeoJsonLineString extends BaseGeoJson<'LineString'> {
    coordinates: PositionPosition[];
}
export interface GeoJsonPolygon extends BaseGeoJson<'Polygon'> {
    coordinates: PositionPosition[][];
}
export interface GeoJsonMultiPoint extends BaseGeoJson<'MultiPoint'> {
    coordinates: PositionPosition[];
}
export interface GeoJsonMultiLineString extends BaseGeoJson<'MultiLineString'> {
    coordinates: PositionPosition[][];
}
export interface GeoJsonMultiPolygon extends BaseGeoJson<'MultiPolygon'> {
    coordinates: PositionPosition[][][];
}
export interface GeoJsonGeometryCollection extends BaseGeoJson<'GeometryCollection'> {
    geometries: GeoJson[];
}
export type GeoJson = GeoJsonPoint | GeoJsonLineString | GeoJsonPolygon | GeoJsonMultiPoint | GeoJsonMultiLineString | GeoJsonMultiPolygon | GeoJsonGeometryCollection;
export declare function assertIsGeoJson(value: unknown): asserts value is GeoJson;
export declare function assertIsGeoJsonPoint(value: unknown): asserts value is GeoJsonPoint;
export declare function assertIsGeoJsonLineString(value: unknown): asserts value is GeoJsonLineString;
export declare function assertIsGeoJsonPolygon(value: unknown): asserts value is GeoJsonPolygon;
export declare function assertIsGeoJsonMultiPoint(value: unknown): asserts value is GeoJsonMultiPoint;
export declare function assertIsGeoJsonMultiLineString(value: unknown): asserts value is GeoJsonMultiLineString;
export declare function assertIsGeoJsonMultiPolygon(value: unknown): asserts value is GeoJsonMultiPolygon;
export declare function assertIsGeoJsonGeometryCollection(value: unknown): asserts value is GeoJsonGeometryCollection;
export {};
