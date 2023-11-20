import "./ImageList.css"
import ImageItem from "./ImageItem.js"
import React, { useEffect, useState } from "react"
const root = document.getElementById("root")




const ImageList = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const orderQuery = queryParams.get("orderBy")

  const apiOrderQuery = orderQuery != null ? `&${orderQuery}=1` : ""
  const topicQuery = queryParams.get("selectedTheme")
  const apiTopicQuery = topicQuery != null ? `&topic=${topicQuery}` : ""

  const [page, setPage] = useState(1)
  const [imageData, setimageData] = useState(null)
  const [fetchingNewData, setFetchingNewData] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  if (imageData == null && !fetchingNewData) {
    setFetchingNewData(true)
    fetch(`./api?page=${page}${apiOrderQuery}${apiTopicQuery}`).then(response => response.json()).then(data => {
      setimageData(data)
    }).finally(() => {
      setFetchingNewData(false)
    })
  }

  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const atBottom = scrollTop + clientHeight > scrollHeight - 100;
      setIsBottom(atBottom);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])
  useEffect(() => {
    let noMoreData = false;
    if (fetchingNewData == false && (root.clientHeight < window.outerHeight || isBottom) && imageData != null) {
      setFetchingNewData(true)
      fetch(`./api?page=${page + 1}${apiOrderQuery}${apiTopicQuery}`).then(response => response.json()).then(data => {
        setimageData(imageData.concat(data))
        setPage(page + 1)
        noMoreData = data.length < 1
      }).finally(() => {
        if (noMoreData) {
          setFetchingNewData(null)
          return;
        }
        setFetchingNewData(false)
      })
    }
  });

  return (
    <>
      <div className="image-list">
        {!!(imageData) ? imageData.map((img, key) => <ImageItem key={key} imgData={img}></ImageItem>) : "loading..."}
        {imageData != null && fetchingNewData && "loading..." || ""}
      </div>
    </>
  )
}
export default ImageList