import "./style.css"
import { useState } from "react"
import ReactDOM from 'react-dom';
import { UploadForm } from "../UploadForm";
const uploadIcon = "/assets/icons/upload.svg"


export default function ({reloadList}) {
    const [openedForm, setOpenedForm] = useState(false)
    return (
        <div className="upload-button-wrapper">
            <button onClick={() => setOpenedForm(!openedForm)} className="upload-button">
                <img alt="Upload" src={uploadIcon}>
                </img>
            </button>
            {ReactDOM.createPortal(
                <UploadForm reloadList={reloadList} visible={openedForm} onClick={() => setOpenedForm(!openedForm)} />,
                document.getElementById('root') // Specify the root element's ID
            )}
        </div>
    )
}