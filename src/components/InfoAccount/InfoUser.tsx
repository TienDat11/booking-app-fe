import { Button, Descriptions, DescriptionsProps, Flex, Image, Modal } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { url } from '../ultils/urlApi';
import { DataType } from '../constant/constant';
import getCookie from '../route/Cookie';
import FormEdit from '../UserManager/FormEdit';
import './InfoAccount.css'

const InfoUser = () => {
  const [infoUser, setInfoUser] = useState<DataType>()
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const id = getCookie("id");
  const token = getCookie("token")
  const getData = async () => {
    try {
      await axios
        .get(url + "/v1/users/" + id, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setInfoUser(response.data.data);
        });
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleEditUser = (editUser: DataType) => {
    if (editUser) {
      setInfoUser((prevUser) => ({
        ...prevUser,
        ...editUser
      }));

    }
  };
  const handleShowModal = () => {
    handleModalEditUser(true)

  }
  const handleModalEditUser = (status: boolean) => {
    setIsModalEditOpen(status);
  };
  const customLabelStyle = {
    fontWeight: 'bold',
    marginRight: '8px',
    color: 'black'
  };
  const customContentStyle = {
    display: 'flex',
    justifyContent: 'end',
    marginRight: 50
  };
  return (
    <>
      <h1 className='component-name'>Account information</h1>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Descriptions style={{ width: 500, paddingRight: 100 }} layout="horizontal" column={1} >
          <Descriptions.Item contentStyle={customContentStyle} labelStyle={customLabelStyle} label="User Name"> {infoUser?.user_name}</Descriptions.Item>
          <Descriptions.Item contentStyle={customContentStyle} labelStyle={customLabelStyle} label="Email">{infoUser?.email} </Descriptions.Item>
          <Descriptions.Item contentStyle={customContentStyle} labelStyle={customLabelStyle} label="Phone number"> {infoUser?.phone_number}</Descriptions.Item>
          <Descriptions.Item >
            <div className='btn-edit-info'>
              <Button style={{ marginTop: 20 }} type="primary" htmlType="submit" onClick={() => handleModalEditUser(true)}>Edit</Button>
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Image width={200}
          src="https://www.kindpng.com/picc/m/421-4212275_transparent-default-avatar-png-avatar-img-png-download.png"
        />
      </div>
      <Modal
        title="Edit User Information"
        open={isModalEditOpen}
        destroyOnClose={true}
        footer={[]}
        onCancel={() => handleModalEditUser(false)}
        style={{ width: "500px", textAlign: "center" }}
      >
        <FormEdit onModalEditUser={handleModalEditUser} data={infoUser} onEditUser={handleEditUser} />
      </Modal>
    </>
  )
}

export default InfoUser
