import type Map from 'ol/Map'
import type View from 'ol/View.js'
import type { Source } from 'ol/source'
import type { Extent } from 'ol/extent'
import type VectorLayer from 'ol/layer/Vector'
import type VectorSourceType from 'ol/source/Vector'

export interface ISource extends Source {
  getExtent: () => Extent
}

export interface IMap extends Map {
  map: Map
}

export interface IView extends View {
  view: View
}

export interface ICreator {
  createLayer: (data: IData, map: Map) => TVectorLayer
  data: IData
}

export interface IData {
  bankId: number
  layerId: number
  workset: string
  filter: string
  uid: string
}

export interface ILayer {
  alias: string
  value: number
  text: string
  layerId: number
  add: boolean
  show: boolean
  isDefault?: boolean
  creator?: ICreator
  uid?: string
}

export type TVectorLayer = VectorLayer<VectorSourceType>

export interface IStyleParams {
  fillColor: string
  strokeColor: string
  strokeWidth: number
  imageRadius: number
}
