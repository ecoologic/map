import React from 'react'
import { useCachedFetch, SpinnerContext, Spinner } from "./utils";
import { ClickRecordContext } from './map/Record';

// TODO: height not perfect
export const Flag = () => {
  const {records} = React.useContext(ClickRecordContext);
  const record = records[records.length - 1] || ClickRecordContext.emptyFeaturesData;
  const country = record.featuresData[0];
  const response = useCachedFetch(`https://restcountries.eu/rest/v2/name/${country.name}?fullText=true`)
  const {isSpinning} = React.useContext(SpinnerContext);

  return isSpinning
    ? <span className="flag flag--missing"><Spinner /></span>
    : response[0]
      ? <img src={response[0]?.flag} alt={`${country.name} flag`} height="100px" />
      : <i className="flag flag--missing">{response.error || response.message}</i>
}
