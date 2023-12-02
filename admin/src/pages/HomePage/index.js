/*
 *
 * HomePage
 *
 */

import React from 'react';
import PluginHeading from '../../components/PluginHeading';
import PluginStarterForm from '../../components/PluginStarterForm';
import PluginRedirectUrl from '../../components/PluginRedirectUrl';
import PluginOptions from '../../components/PluginOptions';
import PluginError from '../../components/PluginError';
import { useReducer, useEffect } from 'react';
import { Box, Loader } from '@strapi/design-system';
import newAbortSignal from "../../utils/newAbortSignal";
import { useFetchClient } from "@strapi/helper-plugin";

function statusReducer(state, action) {
  switch (action.type) {
    case 'chande_status': {
      return {
        status: action.payload,
        isLoading: false
      };
    }
    case 'add_loading_status': {
      return {
        status: state.status,
        isLoading: true
      };
    }
  }
  throw Error('Unknown action for statusReducer: ' + action.type);
}

const HomePage = () => {
  const [pluginState, dispatch] = useReducer(statusReducer, { status: '', isLoading: true});
  const {get} = useFetchClient();

  const checkStatus = async () => {
    try {
      const res = await get('/uploads-duplicator/check-creds', {
          signal: newAbortSignal(5000)
       });
       if(res.data.success) {
          if(res.data.nextClicked) {
            dispatch({type: 'chande_status', payload: 'options'});
          } else {
            dispatch({type: 'chande_status', payload: 'set_redirect_url'});
          }
       } else {
          dispatch({type: 'chande_status', payload: 'get_creds'});
       }
  } catch(err) {
      console.error(err);
      dispatch({type: 'chande_status', payload: 'error'});
  }
  }

  useEffect(() => {
    dispatch({type: 'add_loading_status'});
    checkStatus();
  },[]);

  return (
    <Box>
      <PluginHeading />
      {pluginState.status === 'get_creds' && !pluginState.isLoading && <PluginStarterForm dispatch={dispatch} />}
      {pluginState.status === 'set_redirect_url' && !pluginState.isLoading && <PluginRedirectUrl dispatch={dispatch} />}
      {pluginState.status === 'options' && !pluginState.isLoading && <PluginOptions dispatch={dispatch} />}
      {pluginState.status === 'error' && !pluginState.isLoading && <PluginError />}
      {pluginState.isLoading && <Loader  style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh'}}/>}
    </Box>
  );
};

export default HomePage;
