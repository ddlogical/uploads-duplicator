import { Box, Button, Typography } from "@strapi/design-system";
import { Rotate } from '@strapi/icons';

const PluginRestart = ({dispatch}) => {

    const handleRestart = () => {
      dispatch({type: 'chande_status', payload: 'get_creds'})
    }

    return <Box maxWidth='max-content' style={{display: 'flex',  gap: '1rem', flexDirection: 'column', position: 'fixed', top: '1rem', right: '1rem'}}>
            <Typography variant="beta">If something goes wrong you can restart</Typography>
            <Typography variant="delta">1. Restart Strapi</Typography>
            <Typography variant="delta">2. Click "Restart" btn</Typography>
            <Typography variant="delta">3. Check your Google Drive and delete unnecessary data</Typography>
            <Button onClick={handleRestart} style={{alignSelf: 'flex-start'}} startIcon={<Rotate />}>Restart</Button>
        </Box>
}

export default PluginRestart;