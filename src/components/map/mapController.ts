import { ref } from 'vue'
import { Draw, Modify, Snap } from 'ol/interaction'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
// import { GeoJSON } from 'ol/format'
import type Map from 'ol/Map'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { MapBrowserEvent } from 'ol'
import type { TVectorLayer, IStyleParams } from './types'

const modify = ref<Modify>()
const draw = ref<Draw>()
const snap = ref<Snap>()

// export const updateInteractions = (map: Map) => {

// }

export const addInteractionDraw = (
  map: Map,
  source: VectorSource,
  type:
    | 'Point'
    | 'LineString'
    | 'LinearRing'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon'
    | 'GeometryCollection'
    | 'Circle',
) => {
  draw.value = new Draw({
    source,
    type,
  })

  map.addInteraction(draw.value)
}

export const addInteractionSnap = (map: Map, source: VectorSource) => {
  snap.value = new Snap({ source })
  map.addInteraction(snap.value)
}

export const addInteractionModify = (map: Map, source: VectorSource) => {
  modify.value = new Modify({ source })
  map.addInteraction(modify.value)
}

export const addDrawLayer = (map: Map) => {
  const source = new VectorSource()

  const vectorLayer = new VectorLayer({
    source,
    properties: {
      uidKey: 'drawingLayer',
    },
    visible: false,
    zIndex: 23000,
  })
  // setDrawModeStyle(vectorLayer)

  map.addLayer(vectorLayer)
}

export const showLayer = (layer: TVectorLayer | undefined) => {
  if (!layer) return

  layer.setVisible(true)
}

const createStyle = (params: IStyleParams) => {
  return {
    'circle-radius': params.imageRadius,
    'circle-fill-color': params.fillColor,
    'stroke-color': params.strokeColor,
    'stroke-width': params.strokeWidth,
    'fill-color': params.fillColor,
  }
}

const setStyle = (layer: TVectorLayer, style: IStyleParams) => {
  const newStyle = createStyle(style)
  layer.setStyle(newStyle)
}

export const setEditedModeStyle = (layer: TVectorLayer) => {
  const windowStyle = window.getComputedStyle(document.body)
  const secondaryColor = windowStyle.getPropertyValue('--q-secondary')
  const whiteColor = 'rgba(255, 255, 255, 0.3)'

  const style = {
    fillColor: whiteColor,
    strokeColor: secondaryColor,
    strokeWidth: 2,
    imageRadius: 5,
  }

  setStyle(layer, style)
}

export const setDrawModeStyle = (layer: TVectorLayer) => {
  const windowStyle = window.getComputedStyle(document.body)
  const secondaryColor = windowStyle.getPropertyValue('--q-accent')
  const whiteColor = 'rgba(255, 255, 255, 0.3)'

  const style = {
    fillColor: whiteColor,
    strokeColor: secondaryColor,
    strokeWidth: 2,
    imageRadius: 5,
  }

  setStyle(layer, style)
}

export const setDefaultStyle = (layer: TVectorLayer) => {
  const windowStyle = window.getComputedStyle(document.body)
  const primaryColor = windowStyle.getPropertyValue('--q-primary')
  const whiteColor = 'rgba(255, 255, 255, 0.4)'

  const style = {
    fillColor: whiteColor,
    strokeColor: primaryColor,
    strokeWidth: 2,
    imageRadius: 5,
  }

  setStyle(layer, style)
}

const addFeaturesOnLayer = (layer: TVectorLayer | undefined, features: Feature<Geometry>[]) => {
  if (!layer) return

  const source = layer.getSource()
  if (!source) return

  source.addFeatures(features)
}

export const clickOnMap = (click: MapBrowserEvent<MouseEvent>) => {
  const map = click.map as Map
  // const coordinates = click.coordinate
  const pixels = click.pixel

  const features = map.getFeaturesAtPixel(pixels) as Feature<Geometry>[]

  if (features.length) {
    const layers = map.getLayers().getArray() as TVectorLayer[]
    const drawingLayer = layers.find((lay: TVectorLayer) => lay.get('uidKey') == 'drawingLayer')

    addFeaturesOnLayer(drawingLayer, features)
    showLayer(drawingLayer)
  } else {
    console.log('Нет объектов на указанном пикселе')
  }
}
