/**
 * Coarse continent outlines in [lon, lat] pairs.
 * Deliberately low-fidelity: the map is rendered as a ~4-degree dot lattice,
 * so anything finer than this is thrown away by the grid anyway.
 */
export type Polygon = [number, number][];

export const LAND: Polygon[] = [
  // North America
  [[-168,66],[-152,71],[-128,70],[-105,72],[-88,73],[-70,68],[-58,58],[-52,47],[-62,45],[-70,41],[-76,35],[-81,25],[-90,29],[-97,26],[-105,21],[-96,16],[-84,10],[-92,15],[-105,19],[-114,29],[-124,40],[-124,48],[-133,55],[-150,59],[-166,60]],
  // Greenland
  [[-55,60],[-42,60],[-20,70],[-24,81],[-45,83],[-60,76]],
  // South America
  [[-81,8],[-62,11],[-50,4],[-35,-5],[-38,-15],[-48,-25],[-58,-35],[-62,-40],[-66,-54],[-73,-52],[-71,-33],[-70,-18],[-81,-4]],
  // Europe
  [[-10,36],[0,43],[4,51],[-4,58],[6,61],[13,55],[11,66],[22,70],[31,70],[40,66],[40,50],[30,45],[28,41],[22,38],[15,38],[10,44],[-2,36]],
  // British Isles
  [[-6,50],[2,52],[0,58],[-7,57]],
  // Africa
  [[-17,15],[-16,28],[-5,36],[10,37],[25,32],[35,31],[43,12],[51,11],[42,-2],[40,-15],[35,-25],[25,-34],[18,-35],[13,-23],[9,-1],[5,5],[-8,4],[-13,9]],
  // Madagascar
  [[43,-13],[50,-16],[49,-25],[44,-24]],
  // Asia
  [[40,66],[60,72],[80,75],[105,78],[130,72],[145,60],[142,50],[130,42],[122,38],[121,30],[110,20],[105,10],[100,13],[97,17],[92,21],[89,22],[80,15],[77,8],[72,20],[68,24],[60,25],[57,25],[48,30],[43,38],[40,42],[40,50]],
  // Japan
  [[130,32],[141,40],[146,44],[140,35],[132,31]],
  // Maritime Southeast Asia
  [[95,6],[112,3],[126,1],[135,-2],[141,-7],[132,-8],[118,-9],[105,-7],[96,2]],
  // Australia
  [[113,-21],[114,-33],[123,-34],[131,-32],[138,-35],[147,-39],[151,-36],[153,-28],[145,-15],[137,-11],[130,-12],[124,-15]],
  // New Zealand
  [[166,-45],[175,-40],[178,-37],[172,-44]],
];

/** Ray-casting point-in-polygon test. */
export function pointInPolygon(x: number, y: number, poly: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Regions with live extraction coverage, highlighted on the map. */
export const COVERAGE_PINS = [
  { city: 'Berlin', lon: 13.4, lat: 52.5 },
  { city: 'Casablanca', lon: -6.8, lat: 34.0 },
  { city: 'New York', lon: -74.0, lat: 40.7 },
  { city: 'Dubai', lon: 55.3, lat: 25.2 },
  { city: 'Singapore', lon: 103.8, lat: 1.35 },
] as const;
