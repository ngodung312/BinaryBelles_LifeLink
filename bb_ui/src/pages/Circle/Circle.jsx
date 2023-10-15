import { Button, Col, Row, Select, Card, Image, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react'
import Webcam from "react-webcam";
import { CameraOutlined, SendOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../context/axiosConfig';

import '../../assets/scss/Circle.scss';

export const Circle = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [newImg, setNewImg] = useState({});
    const [captions, setCaptions] = useState([]);
    const [selectedCap, setSelectedCap] = useState("");
    const [imgGallery, setImgGallery] = useState([
        {
            "name": "img1",
            "description": "So beautiful!",
            "url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
            "album_id": 0,
        },
        {
            "name": "img2",
            "description": "Awesome!",
            "url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
            "album_id": 0,
        },
        {
            "name": "img3",
            "description": ":))))",
            "url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
            "album_id": 0,
        },
    ]);

    const onChange = (value) => {
        setSelectedCap(value);
        // console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        // console.log('search:', value);
    };

    // create a capture function
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        let imgData = {
            "name": `${Date.now()}_bb_friends`,
            "description": "New Img",
            "url": imageSrc,
            "album_id": 0,
        }
        setNewImg(imgData)
        setImgSrc(imageSrc);

        axiosInstance.post("/v1/images/", {
            // "access_token": currentUser.data.token,
            ...imgData,
            "from_ui": 1
        }).then((res) => {
            // console.log(res.data);
            let newCaptions = [];
            for (let i = 0; i < res.data["captions"].length; i++) {
                newCaptions.push({
                    value: res.data["captions"][i],
                    label: res.data["captions"][i]
                })
            }
            setCaptions(newCaptions);
        }).catch((err) => {
            message.error("Save Failed!");
        });
    }, [webcamRef]);

    const saveImg = () => {
        let imgData = {...newImg, "description": selectedCap};
        setImgGallery([imgData, ...imgGallery]);
        setImgSrc(null);
        message.success("Save Succeed!");
    }

    return (
        <div className='circle'>
            <Row justify="space-between">
                <Col span={18}>
                    <div className="container camera">
                        {imgSrc ? (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <img src={imgSrc} alt="webcam" className='cap-area cap-img' />
                                <div>
                                    <div className='d-flex flex-row justify-content-center align-items-center'>
                                        <Select
                                            className="mx-2"
                                            size="large"
                                            showSearch
                                            placeholder="Say something..."
                                            optionFilterProp="children"
                                            onChange={onChange}
                                            onSearch={onSearch}
                                            options={captions}
                                        />
                                        <Button type="primary" size="large" onClick={saveImg}
                                        >
                                            <SendOutlined />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <Webcam className='cap-area webcam' ref={webcamRef} />

                                <Button className="mx-2" type="primary" size="large" onClick={capture}>
                                    <CameraOutlined />
                                </Button>
                            </div>
                        )}

                    </div>
                </Col>
                <Col span={5}>
                    <div className="container gallery">
                        {imgGallery.map((img, index) => (
                            <div key={index}>
                                <div className='images'>
                                    <Image
                                        src={img.url}
                                        style={{
                                            borderRadius: "1.25rem"
                                        }}
                                    />
                                    <h5>{img.description}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    )
}
