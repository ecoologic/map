import React, {useContext, useReducer} from 'react';
import {featureHelpers, MapContext} from './Map';
import {useMount, Td, useShortcut} from "../utils";
import Select from "ol/interaction/Select";
import {click} from "ol/events/condition";
import {MapHoverContext} from "./Hover";

// Select only for single feature, otherwise:
// https://openlayers.org/en/latest/examples/select-multiple-features.html
const clickSelect = new Select({ condition: click })

const onSelectFeature = (select, callback) => {
  select.on('select', (ev) => {
    callback(featureHelpers.properties(ev.target))
  })
}

export const ClickRecordContext = React.createContext([]);

ClickRecordContext.emptyFeaturesData = { featuresData: [{}] };

export const ClickRecordProvider = ({ children }) => {
  console.debug(`Render ClickRecordProvider`)
  const [records, setRecords] = React.useState([]);
  const addClickRecord = (newRecord) => setRecords((oldRecords) => [...oldRecords, newRecord])
  useShortcut('Escape', (_event) => setRecords([]));

  const value = { records, addClickRecord }
  return <ClickRecordContext.Provider value={value}>{children}</ClickRecordContext.Provider>
}

export const useClickRecord = () => {
  console.debug(`Render useClickRecord`)
  const { addInteraction, removeInteraction } = useContext(MapContext)
  const { records, addClickRecord } = useContext(ClickRecordContext)
  const select = clickSelect

  useMount('useClickRecord', () => {
    onSelectFeature(select, (featuresData) => addClickRecord({ featuresData }))
    addInteraction(select)
  }, () => removeInteraction(select))

  return { records }
}

// TODO? must this be a component for ErrorBoundary to catch an error?
const Record = ({record}) => {
  return record.featuresData.map((fd) => fd.title).join(', ')
}

// TODO: tr to map hover
const FeaturedTr = ({ olUid, children }) => {
  console.debug(`Render FeaturedTr`)
  const hoveredOlUid = useContext(MapHoverContext).featureData?.geometry?.ol_uid;
  const hoveredOnMap = hoveredOlUid === olUid;
  return <tr className={hoveredOnMap ? 'highlighted' : '' }>{children}</tr>
}

export const Records = () => {
  console.debug(`Render Records`)
  const {records} = useClickRecord();

  return <table><tbody>
    {records.map((record, i) =>
      <FeaturedTr key={`${i}-${record.featuresData[0].geometry.ol_uid}`}
            olUid={record.featuresData[0].geometry.ol_uid}>
        <Td>
          <Record record={record} />
        </Td>
      </FeaturedTr>
    )}
  </tbody></table>
}
