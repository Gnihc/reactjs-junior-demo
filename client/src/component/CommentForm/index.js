import { Combobox } from 'react-widgets';
import { imageTheme } from "../../data/imageTheme.js"
import "./commentStyle.css"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useState,useRef } from 'react';

let clearForm;
let submitting = false;
const handleSubmit = async (e) => {
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

export default ({ visible, onClick }) => {
    return (<>
        <div id="upload-form" onClick={onClick} className={visible && "visible" || ""}>
            <form id="upload-inner-form" onSubmit={(e) => handleSubmit(e)} className="inner-frame" onClick={(event) => event.stopPropagation()}>
                <div className="inner-frame__wrapper" onDrop={(e)=>e.preventDefault()}>
                    <label className="form__label">
                        Đăng bình luận
                    </label>
                    <label className="form__input-label">
                        Nội dung
                    </label>
                    <textarea placeholder='Nhập nội dung bình luận'>

                    </textarea>
                    <input type="submit" className="submitButton" value="Đăng" />
                </div>
            </form>
        </div>
    </>)
}