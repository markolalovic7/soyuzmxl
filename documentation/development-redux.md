# Libraries

- [Redux-toolkit](./development-redux.md#redux-toolkit)
- [Redux-persist](./development-redux.md#redux-persist)

# Redux-toolkit

The project uses the [Redux Toolkit](https://redux-toolkit.js.org/introduction/quick-start).

You can see the whole setup here:

![documentation/images/screenshot_redux_folder.png](documentation/images/screenshot_redux_folder.png)

Basically, there is one slice file per state category, and there you define the state and the actions that manipulate
the state.

When used for API interaction purposes, Redux uses the async thunk (and Axios).

# Redux-persist

The project uses the [Redux Persist](https://github.com/rt2zz/redux-persist).

Configuration is defined in `./src/redux/get-persist-config.js` file.

## Why?

To provide a consistent, performant, and structured way to persist state.

## How to

Each time the new reducer is added it is important to add a wrapper in `root-reducer.js` for

- `REHYDRATE` redux-persist action.
The action is dispatched when redux is persisted (when values get from localstorage)

- `PURGE` redux-persist action.
To clean the storage when `PURGE` action is dispatched.

- Handling 401 error.
Clean the data when API returns 401 response.

## Adding values to be persisted

In `get-persist-config.js` define the data from the slice to keep in `localstorage`.

For example:

```javascript
const chatReducersFilter = createFilter("chat", ["sessionId", "startTime"]);
```

Means that `sessionId` and `startTime` be saved in `localstorage` inside `chat` slice.

Extend `transforms` and `whitelist` config by adding the `slice`.

```javascript
  transforms: [authReducersFilter, betslipReducersFilter, chatReducersFilter, liveReducersFilter],
  whitelist: ["auth", "betslip", "chat", "live"],
```

To retrieve the data from `localstorage` when `REHYDRATE` action is dispatched in root reducer specify a new state in an
appropriate wrapper.

For example:

```javascript
 case REHYDRATE: {
      return chatReducer(
        getChatInitialState(action.payload?.chat?.sessionId, action.payload?.chat?.startTime),
        action,
      );
    }
```

Means that during `REHYDRATE` new state be initialized from values `sessionId` and `startTime` taken from
`localstorage`.

# Code Conventions

- Selectors Retrieving logic from the store should be done via `createSelector` (for optimization purposes) function and
  moved in `reselect` folder.
  
  Selector file pattern: `XXXX-selector.js`, where `XXXX` an appropriate reducer name.

  `Bad`:

  ```javascript
  referralsSelectors.js 
  ```

  `Good`:

  ```javascript
  referral-selector.js
  ```

- Redux Slice

  Slice file pattern: `XXXX-slice.js`, where `XXXX` an appropriate slice name.

  `Bad`:

  ```javascript
  referralsSlice.js 
  ```

  `Good`:

  ```javascript
  referral-slice.js
  ```

  For `slice` methods, the pattern is `camelCasedSlice.js`. All slices should have `Slice` suffix.

  `Bad`:

  ```javascript
  const sport_slice = createSlice({});
  ```

  `Good`:

  ```javascript
  const sportSlice = createSlice({});
  ```
