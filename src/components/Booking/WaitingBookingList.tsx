import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../ultils/urlApi";
import { BookingData, DataType, token } from "../constant/constant";
import { Button, Card, Descriptions, List, Modal, Tag } from "antd";
import "./Booking.css";
import { formatDate, formatTime } from "../ultils/ultils";
import DetailBookingWait from "./DetailBookingWait";
import { handleError, handleSuccess } from "../ultils/ultilsApi";
import { showPopup } from "../ultils/Popup";

const WaitingBookingList = () => {
  const [listBooking, setListBooking] = useState<BookingData[]>([]);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/admin/view_booking_pending", {
          params: {
            page: currentPage,
            per_page: perPage,
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setListBooking(response.data.data.list_bookings);
          setTotalItems(response.data.data.total_items);
          setPerPage(response.data.data.per_page);
        });
    } catch (error) {
      const { message, errors }: any = handleError(error);
      const messageErrors = message + " " + errors;
      showPopup(false, messageErrors);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
};
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };
  const customLabelStyle = {
    fontWeight: "bold",
    marginRight: "8px",
    color: "black",
  };
  const customContentStyle = {
    display: "flex",
    justifyContent: "end",
    marginRight: 100,
  };
  const [selectBooking, setSelectBooking] = useState<BookingData>();
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false);
  const [isModalAccept, setIsModalAccept] = useState<boolean>(false);
  const [isModalReject, setIsModalReject] = useState<boolean>(false);
  const handelViewDetail = (status: boolean) => {
    setIsModalDetail(status);
  };
  const handleViewDetail = (booking: BookingData) => {
    setSelectBooking(booking);
    handelViewDetail(true);
  };
  const handleActionAccept = (status: boolean) => {
    setIsModalAccept(status);
  };
  const handleSelectAccept = (booking: BookingData) => {
    setSelectBooking(booking);
    handleActionAccept(true);
  };
  const handleActionReject = (status: boolean) => {
    setIsModalReject(status);
  };
  const handleSelectReject = (booking: BookingData) => {
    setSelectBooking(booking);
    handleActionReject(true);
  };
  const handleReject = async () => {
    if (selectBooking) {
      try {
        setLoading(true);
        await axios
          .put(
            url + "/v1/bookings/" + selectBooking.booking_id + "/reject",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": true,
              },
            }
          )
          .then((response) => {
            setListBooking(response.data.data.list_bookings);
            const { message } = handleSuccess(response);
            showPopup(true, message);
            handleActionReject(false);
            getData();
          });
      } catch (error: any) {
        const { message, errors }: any = handleError(error);
        const messageErrors = message + " " + errors;
        showPopup(false, messageErrors);
      }
    }
  };
  const handleAccept = async () => {
    if (selectBooking) {
      try {
        await axios
          .put(
            url + "/v1/bookings/" + selectBooking.booking_id + "/accept",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            setListBooking(response.data.data.list_bookings);
            const { message } = handleSuccess(response);
            showPopup(true, message);
            handleActionAccept(false);
            getData();
          });
      } catch (error: any) {
        const { message, errors }: any = handleError(error);
        const messageErrors = message + " " + errors;
        showPopup(false, messageErrors);
      }
    }
  };

  return (
    <div>
      <div className="header-component">
        <h1 className="component-name">List of waiting booking</h1>
      </div>
      <List
        dataSource={listBooking}
        pagination={pagination}
        renderItem={(item: BookingData) => (
          <List.Item>
            <Card
              className="item-booking-wait"
              key={item.title}
              title={<div className="title-booking-wait">{item.title}</div>}
            >
              <div className="info-booking-wait">
                <Descriptions
                  className="detail-booking-wait"
                  layout="horizontal"
                  column={2}
                >
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="ROOM"
                  >
                    {item.room_name}{" "}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="DATE"
                  >
                    {formatDate(item.time_start)}{" "}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="CREATER"
                  >
                    {item.creator_name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="TOTAL PARTICIPATIONS"
                  >
                    {item.user_name}{" "}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="TIME START"
                  >
                    {formatTime(item.time_start)}{" "}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={customLabelStyle}
                    contentStyle={customContentStyle}
                    label="TIME END"
                  >
                    {formatTime(item.time_end)}{" "}
                  </Descriptions.Item>
                </Descriptions>
                <div className="group-btn-action">
                  <Button
                    className="btn-action"
                    style={{ backgroundColor: "#ff9999" }}
                    onClick={() => {
                      handleViewDetail(item);
                    }}
                  >
                    VIEW DETAIL
                  </Button>
                  <Button
                    className="btn-action"
                    style={{ backgroundColor: "#009900" }}
                    onClick={() => {
                      handleSelectAccept(item);
                    }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    className="btn-action"
                    style={{ backgroundColor: "#ff0000" }}
                    onClick={() => {
                      handleSelectReject(item);
                    }}
                  >
                    REJECT
                  </Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        open={isModalDetail}
        onCancel={() => handelViewDetail(false)}
        width={"80%"}
        footer={[]}
      >
        <DetailBookingWait
          onChange={handelViewDetail}
          onSucces={handleAccept}
          onReject ={handleReject}
          selectBooking={selectBooking}
        />
      </Modal>

      <Modal
        title="Reject booking"
        open={isModalReject}
        onOk={handleReject}
        onCancel={() => handleActionReject(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Confirm reject this booking ??</p>
      </Modal>

      <Modal
        title="Accept booking"
        open={isModalAccept}
        onOk={handleAccept}
        onCancel={() => handleActionAccept(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Confirm accept this booking ??</p>
      </Modal>
    </div>
  );
};

export default WaitingBookingList;
