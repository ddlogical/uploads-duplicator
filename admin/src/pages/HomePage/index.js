/*
 *
 * HomePage
 *
 */

import React from 'react';
import PluginHeading from '../../components/PluginHeading';
import PluginStarterForm from '../../components/PluginStarterForm';
import PluginRedirectUrl from '../../components/PluginRedirectUrl';
import PluginFilesLoader from '../../components/PluginFilesLoader';
import PluginOptions from '../../components/PluginOptions';
import PluginError from '../../components/PluginError';
import { useReducer, useEffect, useState } from 'react';
import { Box, Loader } from '@strapi/design-system';
import newAbortSignal from "../../utils/newAbortSignal";
import { useFetchClient } from "@strapi/helper-plugin";
import PluginRestart from '../../components/PluginRestart';

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
  const [filesStatus, setFilesStatus] = useState({
    filesProcessing: false,
    processedFiles: 0,
    totalFiles: 0
  });
  const {get} = useFetchClient();
  const checkStatus = async () => {
    try {
      const res = await get('/uploads-duplicator/check-creds', {
          signal: newAbortSignal(5000)
       });
       if(res?.data?.success) {
          if(res?.data?.nextClicked) {
            const resp = await get('/uploads-duplicator/check-state', {
              signal: newAbortSignal(5000)
           });
           if(resp?.data?.filesProcessing) {
            dispatch({type: 'add_loading_status'});
            setFilesStatus({
              filesProcessing: resp?.data?.filesProcessing, 
              processedFiles: resp?.data?.processedFiles,
              totalFiles: resp?.data?.totalFiles
            })
           } else {
             dispatch({type: 'chande_status', payload: 'options'});
           }
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

  const getPluginStatus = async () => {
    try {
      const resp = await get('/uploads-duplicator/check-state', {
        signal: newAbortSignal(5000)
     });
     setFilesStatus({
      filesProcessing: resp?.data?.filesProcessing, 
      processedFiles: resp?.data?.processedFiles,
      totalFiles: resp?.data?.totalFiles,
    })
    if (!resp?.data?.filesProcessing) {
      if(pluginState.status !== 'set_redirect_url') {
        dispatch({type: 'chande_status', payload: 'options'});
      }
    }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    dispatch({type: 'add_loading_status'});
    checkStatus();
  },[]);

  useEffect(() => {
    let timer = null;
    if(filesStatus.filesProcessing) {
      setTimeout(() => getPluginStatus(), 1000);
    }
    return () => {
      clearInterval(timer);
    };
  },[filesStatus]);

  return (
    <Box>
      <PluginHeading />
      {pluginState.status === 'get_creds' && !pluginState.isLoading && <PluginStarterForm dispatch={dispatch} />}
      {pluginState.status === 'set_redirect_url' && !pluginState.isLoading && <PluginRedirectUrl dispatch={dispatch} />}
      {pluginState.status === 'options' && !pluginState.isLoading && <PluginOptions dispatch={dispatch} setFilesStatus={setFilesStatus} />}
      {pluginState.status === 'error' && pluginState.status !== 'get_creds' && !pluginState.isLoading && <PluginError />}
      {pluginState.isLoading && <Loader  style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh'}}/>}
      {filesStatus.filesProcessing && pluginState.status !== 'get_creds' && <PluginFilesLoader filesNumber={filesStatus.processedFiles} totalFilesNumber={filesStatus.totalFiles} />}
      {(filesStatus.filesProcessing || pluginState.status === 'error') && <PluginRestart dispatch={dispatch} />}
    </Box>
  );
};

export default HomePage;
