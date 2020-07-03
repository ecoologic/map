import React from 'react'
import { useFetch, SpinnerContext, Spinner } from "./utils";
import { ClickRecordContext } from './map/Record';

export const Flag = () => {
  const {records} = React.useContext(ClickRecordContext);
  const record = records[records.length - 1] || ClickRecordContext.emptyFeaturesData;
  const country = record.featuresData[0];
  const response = useFetch(`https://restcountries.eu/rest/v2/name/${country.name}?fullText=true`)
  const {isSpinning} = React.useContext(SpinnerContext);

  return isSpinning
    ? <Spinner />
    : response[0]
      ? <img src={response[0]?.flag} alt={`${country.name} flag`} height="100px" />
      : <span className="h-100px inline-block">{response.error || response.message}</span>
}
