import { Box, Button, Dialog, DialogBody, DialogFooter, Flex,  Typography } from "@strapi/design-system";
import newAbortSignal from "../../utils/newAbortSignal";
import { ExclamationMarkCircle, Trash, CloudUpload, Download, Rotate } from '@strapi/icons';
import { useState } from "react";
import { useFetchClient } from "@strapi/helper-plugin";

const PluginOptions = ({dispatch, setFilesStatus}) => {
    const [isGetVisible, setIsGetVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const {get} = useFetchClient();

    const handleUploadData = async() => {
        try {
            dispatch({type: 'add_loading_status'});
            setFilesStatus({
                filesProcessing: true,
                processedFiles: 0,
                totalFiles: 0
              });
            const res = await get('/uploads-duplicator/upload-data', {
                signal: newAbortSignal()
             });
             if(!res.data.success) {
                dispatch({type: 'chande_status', payload: 'error'});
             }
        } catch(err) {
            console.error(err);
            dispatch({type: 'chande_status', payload: 'error'});
        }
    }
    const handleGetData = async () => {
        try {
            dispatch({type: 'add_loading_status'});
            setFilesStatus({
                filesProcessing: true,
                processedFiles: 0,
                totalFiles: 0
              });
            const res = await get('/uploads-duplicator/get-data', {
                signal: newAbortSignal()
             });
             if(!res.data.success) {
                dispatch({type: 'chande_status', payload: 'error'});
             }
        } catch(err) {
            console.error(err);
            dispatch({type: 'chande_status', payload: 'error'});
        }
    }

    const handleDeleteData = async () => {
        try {
            dispatch({type: 'add_loading_status'});
            const res = await get('/uploads-duplicator/delete-data', {
                signal: newAbortSignal()
             });
             if(res.data.success) {
                dispatch({type: 'chande_status', payload: 'options'});
             } else {
                dispatch({type: 'chande_status', payload: 'error'});
             }
        } catch(err) {
            console.error(err);
            dispatch({type: 'chande_status', payload: 'error'});
        }
    }

    const handleChangeCredentials = () => dispatch({type: 'chande_status', payload: 'get_creds'});

    return <Box maxWidth='max-content' paddingLeft={10} paddingRight={10} paddingTop={5} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <Typography variant="beta">To store data from "uploads" folder in Google Drive press "Store Data" button</Typography>
            <Box style={{display: 'flex', gap: '1rem'}}>
                <Button onClick={handleUploadData} startIcon={<CloudUpload />}>Upload Data</Button>
                <Button onClick={() => setIsGetVisible(true)} startIcon={<Download />}>Get Data</Button>
                <Button onClick={() => setIsDeleteVisible(true)} startIcon={<Trash />}>Delete Data</Button>
                <Button onClick={handleChangeCredentials} startIcon={<Rotate />}>Change Credentials</Button>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="pi">* If files or folders from "uploads" folder have doubles somewhere on Google Drive, they wouldn't be saved.</Typography>
                <Typography variant="pi">** If you delete files in Media Library, you also should manually delete this files(all versions) on Google Drive.</Typography>
                <Typography variant="pi">*** Available main data formats: jpg, png, webp, gif, mp4, svg, docx, pdf, txt, zip, xlsx, json</Typography>
            </Box>
            <Dialog onClose={() => setIsGetVisible(false)} title="Confirmation" isOpen={isGetVisible}>
                <DialogBody icon={<ExclamationMarkCircle />}>
                    <Flex direction="column" alignItems="center" gap={2}>
                    <Flex justifyContent="center">
                        <Typography id="confirm-description">Are you sure? You will replace all data with data from Google Drive?</Typography>
                    </Flex>
                    </Flex>
                </DialogBody>
                <DialogFooter startAction={<Button onClick={() => setIsGetVisible(false)} variant="tertiary">
                        Cancel
                    </Button>} endAction={<Button onClick={handleGetData} variant="danger-light" startIcon={<Download />}>
                        Confirm
                    </Button>} />
            </Dialog>
            <Dialog onClose={() => setIsDeleteVisible(false)} title="Confirmation" isOpen={isDeleteVisible}>
                <DialogBody icon={<ExclamationMarkCircle />}>
                    <Flex direction="column" alignItems="center" gap={2}>
                    <Flex justifyContent="center">
                        <Typography id="confirm-description">Are you sure? You will delete all info in uploads folder?</Typography>
                    </Flex>
                    </Flex>
                </DialogBody>
                <DialogFooter startAction={<Button onClick={() => setIsDeleteVisible(false)} variant="tertiary">
                        Cancel
                    </Button>} endAction={<Button onClick={handleDeleteData} variant="danger-light" startIcon={<Trash />}>
                        Confirm
                    </Button>} />
            </Dialog>
        </Box>
}

export default PluginOptions;