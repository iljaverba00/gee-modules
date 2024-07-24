import { Tile as layerTile } from 'ol/layer'
import { XYZ as sourceXYZ, OSM as sourceOSM, BingMaps as sourceBingMaps } from 'ol/source'

import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { get as getProj } from 'ol/proj'

// Для работы Яндекс подложек
proj4.defs(
  'EPSG:3395',
  '+proj=merc +lon_0=0 +lat_0=90 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
)
register(proj4)
const projection = getProj('EPSG:3395')
projection?.setExtent([
  -20037508.342789248, -20037508.342789248, 20037508.342789248, 20037508.342789248,
])
projection?.setWorldExtent([
  -20037508.342789248, -20037508.342789248, 20037508.342789248, 20037508.342789248,
])

const BING_API_KEY = 'AjtUzWJBHlI3Ma_Ke6Qv2fGRXEs0ua5hUQi54ECwfXTiWsitll4AkETZDihjcfeI'

export const getUnderlay = {
  osm: function () {
    return new layerTile({
      source: new sourceOSM({
        crossOrigin: 'anonymous',
      }),
      preload: Infinity,
      properties: {
        id: 'osm',
        name: 'Open Street Map',
      },
      zIndex: 0,
    })
  },

  google_road: function () {
    return new layerTile({
      source: new sourceOSM({
        url: 'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions:
          '© Google Maps <a href="https://www.google.com/intl/ru_ru/help/terms_maps.html">Условия использования</a>',
      }),
      preload: Infinity,
      properties: {
        id: 'google_road',
        name: 'Google Карта',
      },
      zIndex: 0,
    })
  },

  google_terr: function () {
    return new layerTile({
      source: new sourceOSM({
        url: 'https://mt{0-3}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        attributions:
          '© Google Maps <a href="https://www.google.com/intl/ru_ru/help/terms_maps.html">Условия использования</a>',
      }),
      preload: Infinity,
      properties: {
        id: 'google_terr',
        name: 'Google Рельеф',
      },
      zIndex: 0,
    })
  },

  google_sat: function () {
    return new layerTile({
      source: new sourceOSM({
        url: 'https://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attributions:
          '© Google Maps <a href="https://www.google.com/intl/ru_ru/help/terms_maps.html">Условия использования</a>',
      }),
      preload: Infinity,
      properties: {
        id: 'google_sat',
        name: 'Google Спутник',
      },
      zIndex: 0,
    })
  },

  google_hyb: function () {
    return new layerTile({
      source: new sourceOSM({
        url: 'https://mt{0-3}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attributions:
          '© Google Maps <a href="https://www.google.com/intl/ru_ru/help/terms_maps.html">Условия использования</a>',
        maxZoom: 21,
      }),
      preload: Infinity,
      properties: {
        id: 'google_hyb',
        name: 'Google Гибрид',
      },
      zIndex: 0,
    })
  },

  bing_road: function () {
    return new layerTile({
      source: new sourceBingMaps({
        key: BING_API_KEY,
        imagerySet: 'road',
      }),
      properties: {
        id: 'bing_road',
        name: 'Bing Roads',
      },
      zIndex: 0,
    })
  },

  bing_aerial: function () {
    return new layerTile({
      source: new sourceBingMaps({
        key: BING_API_KEY,
        imagerySet: 'aerial',
      }),
      properties: {
        id: 'bing_aerial',
        name: 'Bing Aerial',
      },
      zIndex: 0,
    })
  },

  bing_aerial_wl: function () {
    return new layerTile({
      source: new sourceBingMaps({
        key: BING_API_KEY,
        imagerySet: 'AerialWithLabels',
      }),
      properties: {
        id: 'bing_aerial_wl',
        name: 'Bing Aerial With Label Map',
      },
      zIndex: 0,
    })
  },

  map_2gis: function () {
    return new layerTile({
      source: new sourceOSM({
        url: 'https://tile0.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
        attributions: '© 2GIS <a href="http://law.2gis.ru/api-rules/">Условия использования</a>',
      }),
      preload: Infinity,
      properties: {
        id: 'map_2gis',
        name: '2 ГИС',
      },
      zIndex: 0,
    })
  },

  ya_map: function () {
    return new layerTile({
      source: new sourceXYZ({
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.06.15-1-b210520094930&x={x}&y={y}&z={z}',
        attributions:
          '© Yandex Maps <a href="https://yandex.ru/legal/maps_termsofuse">Условия использования</a>',
        projection: 'EPSG:3395',
      }),
      preload: Infinity,
      properties: {
        name: 'Яндекс Карта',
        id: 'ya_map',
      },
      zIndex: 0,
    })
  },

  ya_sat: function () {
    return new layerTile({
      source: new sourceXYZ({
        url: 'https://sat02.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
        attributions:
          '© Yandex Maps <a href="https://yandex.ru/legal/maps_termsofuse">Условия использования</a>',
        projection: 'EPSG:3395',
      }),
      preload: Infinity,
      properties: {
        name: 'Яндекс Спутник',
        id: 'ya_sat',
      },
      zIndex: 0,
    })
  },
}
