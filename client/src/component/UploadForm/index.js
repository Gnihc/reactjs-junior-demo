import { Combobox } from 'react-widgets';
import { imageTheme } from "../../data/imageTheme.js"
import "./uploadStyle.css"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useState,useRef } from 'react';

let clearForm;
let submitting = false;
const handleSubmit = async (e, resetList) => {
    if (submitting) { return; }
    submitting = true;
    e.preventDefault()


    const promise = new Promise(async (resolve,reject) => {
        try {
            const formData = new FormData(e.currentTarget);
            formData.set("topic", imageTheme.find((theme) => theme.title === formData.get("topic")).id)
            const response = await fetch('./submitImage', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) { throw new Error(response.statusText) }
            document.getElementById("upload-inner-form").reset()
            resetList(Math.random(0))
            clearForm();
            resolve();
        } catch (error) {
            console.error('Error submitting form:', error);
            reject();
        }
        finally {
            submitting = false;
        }
    })
    toast.promise(promise, {
        pending: "Đang tải ảnh lên...",
        error: "Đăng ảnh thất bại.",
        success: "Đăng ảnh thành công!"
    })
}

export const UploadForm = ({ visible, onClick, reloadList }) => {
    const [comboboxValue, setComboboxValue] = useState(imageTheme[0]);
    const inputRef = useRef(null);
    clearForm = function () {
        setComboboxValue(imageTheme[0]);
        onClick();
    }
    const handleDrop = function(e){
        e.preventDefault();
        inputRef.current.files = e.dataTransfer.files;
    }
    return (<>
        <div id="upload-form" onClick={onClick} className={visible && "visible" || ""}>
            <form id="upload-inner-form" onSubmit={(e) => handleSubmit(e, reloadList)} className="inner-frame" onClick={(event) => event.stopPropagation()}>
                <div className="inner-frame__wrapper" onDrop={(e)=>e.preventDefault()}>
                    <label className="form__label">
                        Tải Ảnh Lên
                    </label>
                    <label className="form__input-label">
                        Chủ đề Ảnh
                    </label>
                    <Combobox
                        className="form__input-box"
                        data={imageTheme}
                        name="topic"
                        textField='title'
                        title="Chủ đề Ảnh"
                        defaultValue={comboboxValue}
                    />
                    <div onDrop={handleDrop} id="image-upload">
                        <span>Kéo thả hoặc Nhấn vào để chọn Ảnh</span>
                        <span>( Hỗ trợ file png, gif, jpeg  )</span>
                        <input type="file" ref={inputRef} name="file" accept="image/png, image/gif, image/jpeg"></input>
                    </div>
                    <input type="submit" className="submitButton" value="Tải Lên" />
                </div>
            </form>
        </div>
    </>)
}