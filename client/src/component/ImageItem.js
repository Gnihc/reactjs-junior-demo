import "./ImageList.css"
import React, { useState, useRef, useEffect } from "react"
const iconsFolder = "/assets/icons/"

function DisplayStat({ imgData, dataKey, icon, formatMethod}) {
    return (<div className="image-stats__stat">
        <img alt="" src={iconsFolder + icon}></img>
        <span className="stat">{!!formatMethod ? formatMethod(imgData[dataKey]) : imgData[dataKey]}</span>
    </div>)
}

const useImageLoaded = () => {
    const [dimension, setDimension] = useState(null)
    const ref = useRef()

    const onLoad = (e) => {
        const { width, naturalWidth, naturalHeight } = e;
        setDimension(width * (naturalHeight / naturalWidth))
    }

    useEffect(() => {
        if (ref.current && ref.current.complete) {
            onLoad(ref.current)
        }
    })

    return [ref, dimension, onLoad]
}
function formatDate(rawDate) {
    const date = new Date(rawDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2,'0');

    return `${hour}:${minute} ${day}-${month}-${year}`;
}

function ImageItem({ imgData }) {
    const [ref, dimension, onLoad] = useImageLoaded()
    const [isHovered, setHovered] = useState(false);
    const style = { justifyContent: isHovered && dimension && dimension < 150 ? "center" : "flex-start" };
    return (
        <div className="image-list--wrapper">
            <div className="image-list__image-item"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={style}
            >

                <img alt=""
                    className="image-list__image-item__image"
                    ref={ref}
                    src={imgData.ImageURL}
                    style={{ height: isHovered && dimension ? (dimension + "px") : "" }}
                    onClick={() => { window.location.href = "/image/" + imgData.id }}
                    onLoad={(e) => onLoad(e.target)}>
                </img>

                <div className="image-bottom-bar">
                    <div className="image-stats">
                        <DisplayStat imgData={imgData} dataKey="Likes" icon="like.svg" />
                        <DisplayStat imgData={imgData} dataKey="comments" icon="comment.svg" />
                    </div>
                    <div className="image-stats">
                        <DisplayStat imgData={imgData} dataKey="createdAt" formatMethod={formatDate} icon="date.svg" />
                    </div>
                </div>

            </div>
        </div>)
}


export default ImageItem;