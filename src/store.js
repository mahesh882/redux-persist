import {applyMiddleware, createStore} from 'redux'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'

const PERSIST_KEY = 'root';

const stringifyTransform = createTransform(
    (inboundState, key) => {
        return inboundState
    },
    (outboundState, key) => {
        return outboundState
    },
    { whitelist: ['reducer'] }
)

const reducer = (state = {name: 'James', age: 25}, action) => {
    switch (action.type) {
        case 'NEW_NAME':
            return {...state, ...action.payload}
        default:
            return state;
    }
}

const getStoredState = config => {
    console.log('config - ', config)
    const {storage, transforms, debug} = config;
    const deserialize = x => x


    return storage.getItem(`persist:${PERSIST_KEY}`).then(serialized => {
        if (!serialized) return undefined
        else {
          try {
            let state = {}
            let rawState = deserialize(serialized)
            Object.keys(rawState).forEach(key => {
              state[key] = transforms.reduceRight((subState, transformer) => {
                return transformer.out(subState, key, rawState)
              }, deserialize(rawState[key]))
            })
            return state
          } catch (err) {
            if (process.env.NODE_ENV !== 'production' && debug)
              console.log(
                `redux-persist/getStoredState: Error restoring data ${serialized}`,
                err
              )
            throw err
          }
        }
      })
}

const persistConfig = {
    key: PERSIST_KEY,
    storage: createIdbStorage({ name: "testcase", storeName: "person" }),
    serialize: false,
    transforms: [stringifyTransform],
    debug: true,
    getStoredState,
}



const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
const persistor = persistStore(store)

export { store, persistor }
