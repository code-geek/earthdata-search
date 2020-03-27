import { findIndex } from 'lodash'

import {
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SELECTED,
  DELETE_AUTOCOMPLETE_VALUE,
  RESTORE_FROM_URL,
  CLEAR_AUTOCOMPLETE_SELECTED,
  CLEAR_FILTERS
} from '../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false,
  suggestions: [],
  selected: []
}

const autocompleteReducer = (state = initialState, action) => {
  const { payload, type } = action

  switch (type) {
    case LOADED_AUTOCOMPLETE: {
      const { loaded } = payload
      return {
        ...state,
        isLoaded: loaded,
        isLoading: false
      }
    }
    case LOADING_AUTOCOMPLETE: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true
      }
    }
    case CLEAR_AUTOCOMPLETE_SELECTED: {
      return {
        ...state,
        selected: []
      }
    }
    case CLEAR_AUTOCOMPLETE_SUGGESTIONS: {
      return {
        ...state,
        isLoaded: false
      }
    }
    case UPDATE_AUTOCOMPLETE_SUGGESTIONS: {
      const { suggestions } = payload

      return {
        ...state,
        suggestions
      }
    }
    case UPDATE_AUTOCOMPLETE_SELECTED: {
      const { suggestion } = payload

      return {
        ...state,
        suggestions: [],
        selected: [
          ...state.selected,
          suggestion
        ]
      }
    }
    case DELETE_AUTOCOMPLETE_VALUE: {
      const {
        level,
        type,
        value
      } = payload

      const { selected } = state
      const index = findIndex(selected, (item) => {
        // if the type is science_keywords, check the correct level of keyword for the autocomplete
        if (type === 'science_keywords') {
          const parts = item.value.split(':')
          return parts[level] === value
        }

        return item.type === type && item.value === value
      })

      return {
        ...state,
        selected: [
          ...selected.slice(0, index),
          ...selected.slice(index + 1)
        ]
      }
    }
    case RESTORE_FROM_URL: {
      const { autocompleteSelected = [] } = payload

      return {
        ...state,
        selected: autocompleteSelected
      }
    }
    case CLEAR_FILTERS: {
      return initialState
    }
    default:
      return state
  }
}

export default autocompleteReducer