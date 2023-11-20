import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
import ImageDetail from "../../component/ImageDetail"
import CommentForm from "../../component/CommentForm"
import NotFound from "../NotFound"
import ReactDOM from 'react-dom'
import "./Style.css"
import "./Stat.Style.css"

const StatButton = function ({ name, icon, text, active, onClick }) {
  return (
    <div class={`stat-button stat-button__${name}-button`}>
      <div onClick={onClick} class="stat__icon">
        <img class="stat__icon--main" src={"/assets/icons/" + icon + ".svg"}></img>
        <img class={`stat__icon--filled ${active ? "active" : ""}`} src={"/assets/icons/" + icon + "_filled.svg"}></img>
      </div>
      <span>
        {text}
      </span>
    </div>
  )
}
const UserProfile = function () {
  return (
    <div class="profile-section">
      <img src="/assets/icons/user.svg">
      </img>
      <div class="user-info">
        Random User
      </div>
      <div class="circle-end">

      </div>
      <div class="middle-rectangle">

      </div>
    </div>
  )
}
const handleLike = async (imageId) => {
  const response = await fetch(`/likeImage?imageId=${imageId}`, {
    method: 'POST',
  });
  return response;
}
const getDownloadName = function (imageData) {
  if (!!!imageData) return "";

  let split = imageData.ImageURL.split("/");
  return split[split.length - 1];
}

export default function () {
  const param = useParams()["*"]

  if (!param || isNaN(parseInt(param))) {
    return <NotFound />
  }

  const [imageData, setimageData] = useState(null)
  const [commentActive, setCommentActive] = useState(false)
  const [likeActive, setLikeActive] = useState(false)
  const [openedForm, setOpenedForm] = useState(false)
  const [likeAmount, setlikeAmount] = useState("loading...")

  const handleLikeClick = async () => {
    if (likeActive || !imageData){return;}
    setlikeAmount(parseInt(likeAmount)+1)
    setLikeActive(true);
  }
  const handleCommentClick = () => {
    setCommentActive(!commentActive)
    if (!commentActive) {
      setOpenedForm(true);
    }
  }

  if (imageData == null) {
    setimageData(false)
    fetch(`../imageDetail?id=${param}`).then(response => response.json()).then(data => {
      setimageData(data)
      setlikeAmount(data.Likes)
    })
  }

  return (
    <div className="image-post">
      <div className="top-bar">
        <UserProfile />
        <div class="action-buttons">
          <a href={imageData ? "/" + imageData.ImageURL : ""} download="" style={{ display: "hidden" }}>
            <button id="save-button">
              Save
            </button>
          </a>
        </div>
      </div>
      <div className="image-wrapper">
        {!!imageData ? <ImageDetail imageData={imageData} /> : "loading..."}
      </div>
      <h1 id="image-name">{!!imageData ? getDownloadName(imageData) : "Loading..."}</h1>
      <div className="stat-section">
        <StatButton text={likeAmount} active={likeActive} onClick={handleLikeClick} name="like" icon="heart" />
        <StatButton text="0" onClick={handleCommentClick} active={commentActive} name="comment" icon="pcomment" />
      </div>
      {ReactDOM.createPortal(
        <CommentForm visible={openedForm} onClick={() => { setOpenedForm(!openedForm); setCommentActive(false) }} />,
        document.getElementById('root') // Specify the root element's ID
      )}
    </div>
  )
}
