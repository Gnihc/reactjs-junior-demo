import "./style.css"
export default function ImageDetail({ imageData }) {
    const url = "/" + imageData.ImageURL
    return (<>
        <div className="image-detail">
            <img className="image-detail__background" src={url}>
            </img>
            <img className="image-detail__image" src={url}>
            </img>
        </div>
    </>)
}