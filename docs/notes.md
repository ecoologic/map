# Notes

## 1 - useClickRecorded useEffect dependencies

2019/10/12 - 4e59671

Adding `addClickRecord` causes an exponential mounting/unmounting of `useClickRecorded` when clicking on different countries.

Adding `addInteraction, removeInteraction` causes double records after hot-reload.

However, considering these functions should be always equal, leaving them out of the dependencies shouldn't be a problem (:fingerscrossed:)
