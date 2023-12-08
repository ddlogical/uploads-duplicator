import { Box, Typography } from "@strapi/design-system";
import stl from './pluginFilesLoader.module.css';

const PluginFilesLoader = ({filesNumber, totalFilesNumber}) => {
   
    return <Box maxWidth='max-content' paddingLeft={10} paddingRight={10} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {
                totalFilesNumber > 0 
                ?
                    <Typography variant="beta"><span style={{fontSize: '2rem', color: '#8312d1'}}>{filesNumber}</span><span className={stl.loading}> {`files from ${totalFilesNumber} successfully processed`}</span></Typography>
                :
                    <Typography variant="beta"><span className={stl.loading}>Preparing</span></Typography>
            }
            <Typography variant="delta">Google sets some limits and quotas on API Requests, so if you have many files, this operation may take some time</Typography>
        </Box>
}

export default PluginFilesLoader;