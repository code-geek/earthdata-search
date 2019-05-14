import { toggleFacetsModal } from './ui'
import { CollectionRequest } from '../util/request/cmr'
import { buildSearchParams, prepareCollectionParams } from '../util/collections'
import { prepareCMRFacetPayload } from '../util/facets'
import { changeCmrFacet } from './facets'

import {
  ERRORED_VIEW_ALL_FACETS,
  LOADED_VIEW_ALL_FACETS,
  LOADING_VIEW_ALL_FACETS,
  UPDATE_VIEW_ALL_FACETS,
  UPDATE_SELECTED_VIEW_ALL_FACET,
  COPY_CMR_FACETS_TO_VIEW_ALL
} from '../constants/actionTypes'

export const updateViewAllFacets = payload => ({
  type: UPDATE_VIEW_ALL_FACETS,
  payload
})

export const onViewAllFacetsLoading = category => ({
  type: LOADING_VIEW_ALL_FACETS,
  payload: {
    selectedCategory: category
  }
})

export const onViewAllFacetsLoaded = payload => ({
  type: LOADED_VIEW_ALL_FACETS,
  payload
})

export const onViewAllFacetsErrored = () => ({
  type: ERRORED_VIEW_ALL_FACETS
})

export const applyViewAllFacets = () => (dispatch, getState) => {
  const selectedFacets = { ...getState().facetsParams.viewAll }
  dispatch(toggleFacetsModal(false))
  dispatch(changeCmrFacet(selectedFacets))
}

export const copyCMRFacets = () => (dispatch, getState) => {
  dispatch({
    type: COPY_CMR_FACETS_TO_VIEW_ALL,
    payload: getState().facetsParams.cmr
  })
}

export const updateViewAllFacet = newParams => ({
  type: UPDATE_SELECTED_VIEW_ALL_FACET,
  payload: prepareCMRFacetPayload(newParams)
})


/**
 * Perform a collections request based on the current redux state.
 * @param {string} category - The string representing the selected category. This should be the humanized version,
 * and not the one we use to pass the parameters.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getViewAllFacets = (category = '') => (dispatch, getState) => {
  dispatch(onViewAllFacetsLoading(category))
  dispatch(toggleFacetsModal(true))

  const collectionParams = prepareCollectionParams(getState())

  const requestObject = new CollectionRequest()

  const response = requestObject.search(buildSearchParams(collectionParams))
    .then((response) => {
      const payload = {}

      payload.selectedCategory = collectionParams.viewAllFacetsCategory
      payload.facets = response.data.feed.facets.children || []
      payload.hits = response.headers['cmr-hits']

      dispatch(onViewAllFacetsLoaded({
        loaded: true
      }))
      dispatch(updateViewAllFacets(payload))
    }, (error) => {
      dispatch(onViewAllFacetsErrored())
      dispatch(onViewAllFacetsLoaded({
        loaded: false
      }))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export const triggerViewAllFacets = category => (dispatch) => {
  dispatch(copyCMRFacets())
  dispatch(getViewAllFacets(category))
}

export const changeViewAllFacet = newParams => (dispatch) => {
  dispatch(updateViewAllFacet(newParams))
  dispatch(getViewAllFacets())
}