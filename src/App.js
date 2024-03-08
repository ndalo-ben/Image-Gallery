import './App.css'
import { useEffect, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { message } from "antd";
import { Bars } from 'react-loader-spinner'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const [img, setImg] = useState("");
  const [allImages, setAllImages] = useState([])

  const imagebase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
    return data;
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const image = await imagebase64(file)
    setImg(image);
  }

  const fetchImages = async () => {
    setIsLoading(true)
    const res = await fetch("http://localhost:8080/")
    const data = await res.json()
    setAllImages(data.data)
    setIsLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (img) {
      const res = await fetch("http://localhost:8080/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ img: img }),
      })
      const data = await res.json();
      console.log(data);
      if (data.success) {
        message.success("Image uploaded successfully!", 2)
        setImg("")
        fetchImages()
      }
    }

  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <>
      <div className="imageContainer">
        <form>
          <label htmlFor="uploadImage">
            <div className="uploadBox">
              <input
                type="file"
                id="uploadImage"
                onChange={handleImageUpload}
              />

              {img ? <img src={img} alt="" /> : <MdCloudUpload />}
            </div>
          </label>
          <div className="btn">
            <button onClick={handleSubmit}>Upload</button>
          </div>
        </form>
        {isLoading ? <div className="loading">
          <Bars
            height="40"
            width="40"
            color="#4fa94d"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          Images Loading please wait...
        </div> : (
          <div className='allImages'>
            {
              allImages.map((image, index) => {
                return (
                  <div key={index}>
                    <img
                      src={image.image}
                      alt=""
                      width={"250px"}
                      height={"180px"}
                    />
                  </div>
                )
              })
            }
          </div>
        )}
      </div>
    </>
  );
}             
