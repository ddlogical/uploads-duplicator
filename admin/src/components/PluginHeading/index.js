import pluginId from "../../pluginId";
import { Box, BaseHeaderLayout, Typography } from "@strapi/design-system";

const PluginHeading = () => {
const pluginName = pluginId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
return <Box background="neutral100">
      <BaseHeaderLayout 
        title={pluginName} 
        subtitle={<Typography>Manage project size: copy "uploads" folder to Google Drive</Typography>} 
        as="h2" />
    </Box>
}

export default PluginHeading;