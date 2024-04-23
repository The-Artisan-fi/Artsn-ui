'use client';
import '../../../styles/DashboardProfile.scss';
import { useState } from 'react';
import { Upload, Input, message } from 'antd';
import ImgCrop from 'antd-img-crop';

import { MdOutlineFileUpload } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { FaCopy } from 'react-icons/fa';

const Profile = () => {
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div className="profile">
      <div className="profile__image-upload">
        <ImgCrop rotationSlider>
          <Upload
            style={{ color: '#fff' }}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && (
              <MdOutlineFileUpload style={{ fontSize: '2.5rem' }} />
            )}
          </Upload>
        </ImgCrop>
        {fileList.length < 1 && <p className="p-4">Upload Profile Picture</p>}
      </div>
      <div className="profile__input-row">
        <div className="profile__input-col">
          <p className="caption-3">FULL NAME</p>
          <Input size="large" placeholder="Enter Your Name" />
        </div>
        <div className="profile__input-col">
          <p className="caption-3">USERNAME</p>
          <Input size="large" placeholder="Enter Your Username" />
        </div>
      </div>

      <div className="profile__input-row">
        <div className="profile__input-col">
          <p className="caption-3">EMAIL</p>
          <Input
            suffix={<FaLock />}
            size="large"
            placeholder="Enter Your Email"
            value={'leo.donateac22@gmail.com'}
            type="email"
            disabled={true}
          />
        </div>
        <div className="profile__input-col">
          <p className="caption-3">WALLET (ACCOUNT)</p>
          <Input
            suffix={
              <FaCopy
                onClick={() => {
                  message.success('Copied!');
                }}
                style={{ cursor: 'pointer', color: 'white' }}
              />
            }
            value={'0x473895634895hjfgd7834sdgyerterhgr'}
            size="large"
            placeholder="Enter Your"
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;