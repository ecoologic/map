# Notes

_Add new at the top, leave this line._

## 1 - useClickRecorded useEffect dependencies [FIXED]

2019/10/12 - 4e59671

Adding `addClickRecord` causes an exponential mounting/unmounting of `useClickRecorded` when clicking on different countries.

Adding `addInteraction, removeInteraction` causes double records after hot-reload.

However, considering these functions should be always equal, leaving them out of the dependencies shouldn't be a problem (:fingerscrossed:)

FIXED: useMount quiets esLint and I don't think it's necessary to add all dependencies if you only want to run a fn once.
