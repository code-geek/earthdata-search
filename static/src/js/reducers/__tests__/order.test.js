import orderReducer from '../retrieval'
import {
  UPDATE_RETRIEVAL
} from '../../constants/actionTypes'

const initialState = {
  id: null,
  collections: {}
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(orderReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_RETRIEVAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_RETRIEVAL,
      payload: {
        id: 7,
        collections: {
          download: [
            {
              collection_id: '12345-TEST'
            }
          ]
        }
      }
    }

    const expectedState = {
      id: 7,
      collections: {
        download: [
          {
            collection_id: '12345-TEST'
          }
        ]
      }
    }

    expect(orderReducer(undefined, action)).toEqual(expectedState)
  })
})
