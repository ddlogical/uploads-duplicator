import { Box, Typography } from "@strapi/design-system";
import { FileError } from "@strapi/icons";

const PluginError = () => {

return <Box 
    maxWidth='max-content' 
    style={{display: 'flex', alignItems: 'center', gap: '1rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-20%, -50%)'}}>
        <FileError />
        <Typography variant="beta">Something wrong, please try again later...</Typography>
    </Box>
}

export default PluginError;