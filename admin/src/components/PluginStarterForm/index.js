import { Box, TextInput, Button, Typography } from "@strapi/design-system";
import newAbortSignal from "../../utils/newAbortSignal";
import validateInputData from "../../utils/validator";
import pluginId from "../../pluginId";
import { useFetchClient } from "@strapi/helper-plugin";
import { useState } from "react";

const PluginStarterForm = ({dispatch}) => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isIdValid, setIsIdValid] = useState(true);
    const [isSecretValid, setIsSecretValid] = useState(true);
    const {post} = useFetchClient();
    const redirectURI = `${window.location.origin}/${pluginId}/google/redirect`;
    const gDriveDirName = window.location.hostname;
    const handleFormSubmit = async e => {
        e.preventDefault();
        if(isIdValid && isSecretValid) {
            try {
                dispatch({type: 'add_loading_status'});
                const res = await post('/uploads-duplicator/store-creds', {clientId, clientSecret, redirectURI, gDriveDirName} ,{
                    signal: newAbortSignal(5000)
                 });
                 if(res.data.success) {
                     dispatch({type: 'chande_status', payload: 'set_redirect_url'});
                 } else {
                    console.error(res?.data?.message);
                    dispatch({type: 'chande_status', payload: 'error'});
                 }
            } catch(err) {
                console.error(err);
                dispatch({type: 'chande_status', payload: 'error'});
            }
        }
    }

    const handleChange = (value, setter, errorSetter) => {
        errorSetter(validateInputData(value));
        setter(value);
    }

    return <Box maxWidth='max-content' paddingLeft={10} paddingRight={10} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <Typography variant="beta">Please, put here credentials from Google Cloud (OAuth 2.0)</Typography>
            <form 
                style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
                onSubmit={handleFormSubmit}
                >
                <TextInput 
                    label="CLIENT ID" 
                    name="client_id" 
                    hint="Put here the client id from your Google Cloud project. If you don't get one, please create a new project and credentials" 
                    value={clientId} 
                    onChange={e => handleChange(e.target.value, setClientId,  setIsIdValid)}
                    error={isIdValid ? "" : "Please enter valid client id. Get correct value from google drive. It should contain numbers, letters, etc..."}
                    />
                <TextInput 
                    label="CLIENT SECRET" 
                    name="client_secret" 
                    hint="Put here the client secret from your Google Cloud project. If you don't get one, please create a new project and credentials" 
                    value={clientSecret} 
                    onChange={e => handleChange(e.target.value, setClientSecret, setIsSecretValid)}
                    error={isSecretValid ? "" : "Please enter valid client secret. Get correct value from google drive. It should contain numbers, letters, etc..."}
                    />
                <Button type='submit' style={{alignSelf: 'flex-start'}}>ENTER</Button>
            </form>
        </Box>
}

export default PluginStarterForm;