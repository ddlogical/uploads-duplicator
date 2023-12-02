import { Box, Button, Typography, LinkButton } from "@strapi/design-system";
import pluginId from "../../pluginId";
import { Duplicate, Check, Rotate } from "@strapi/icons";
import { useState } from "react";
import copy from 'clipboard-copy';

const PluginRedirectUrl = ({dispatch}) => {
    const [copyClicked, setCopyClicked] = useState(false);
    const redirectURI = `${window.location.origin}/${pluginId}/google/redirect`;

    const handleCopyClick = async () => {
        await copy(redirectURI);
        setCopyClicked(true);
    }

    const handleChangeCredentials = () => dispatch({type: 'chande_status', payload: 'get_creds'});

return <Box background="neutral100" paddingLeft={10} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <Typography variant="beta">Please, put this link to authorized redirect URIs</Typography>
        <Box style={{display: 'flex', alignItems: 'center', gap: '1rem', width: 'max-content', padding: '1rem', border: '1px solid #fff', borderRadius: '5px'}}>
            <Typography variant="delta">{redirectURI}</Typography>
            <Button onClick={handleCopyClick}>{copyClicked?<Check />:<Duplicate/>}</Button>
        </Box>
        <Box style={{display: "flex", alignItems: 'center', gap: '1rem'}}>
            <LinkButton variant="default" href="/uploads-duplicator/auth" style={{textDecoration: 'none'}}>Next</LinkButton>
            <Button style={{padding: '1rem .8rem'}} onClick={handleChangeCredentials} startIcon={<Rotate />}>Change Credentials</Button>
        </Box>
    </Box>
}

export default PluginRedirectUrl;