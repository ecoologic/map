import { Fill, Style } from "ol/style";

export const fills = {
    green: new Fill({ color: 'rgba(0,255,0,0.1)' })
}

export const styles = {
    filledGreen: new Style({ fill: fills.green })
}
