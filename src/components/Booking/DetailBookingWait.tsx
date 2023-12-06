import React, { useEffect, useState } from "react";
import { BookingData, DataType, token } from "../constant/constant";
import { Button, Card, Descriptions, Table } from "antd";
import { formatDate, formatTime } from "../ultils/ultils";
import "./Booking.css";
import axios from "axios";
import { url } from "../ultils/urlApi";
import { handleError } from "../ultils/ultilsApi";
import { showPopup } from "../ultils/Popup";
import { ColumnsType } from "antd/es/table";

interface DetailBookingWaitProps {
  selectBooking: BookingData | undefined;
  onChange: (status: boolean) => void;
  onSucces: (booking: BookingData | undefined) => Promise<void>;
  onReject: (booking: BookingData | undefined) => Promise<void>
}
const DetailBookingWait: React.FC<DetailBookingWaitProps> = ({
  selectBooking,
  onChange,
  onSucces,
  onReject
}) => {
  const [loading, setLoading] = useState<boolean>(false);
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
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  const getUser = async () => {
    if (selectBooking) {
      try {
        setLoading(true);
        const userPromises = selectBooking.user_ids.map(async (userId) => {
          const response = await axios.get(url + "/v1/users/" + userId, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data.data;
        });
        const userDataArray = await Promise.all(userPromises);
        setListUsers(userDataArray);
        console.log(userDataArray);
      } catch (error) {
        const { message, errors }: any = handleError(error);
        const messageErrors = message + " " + errors;
        showPopup(false, messageErrors);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      align: "center",
      title: "User ID",
      key: "user_id",
      dataIndex: "user_id",
    },
    {
      align: "center",
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      align: "center",
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      align: "center",
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
  ];

  return (
    <>
      <Card
        className="item-booking-wait"
        key={selectBooking!.title}
        title={<div className="title-booking-wait">{selectBooking!.title}</div>}
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
              {selectBooking!.room_name}
            </Descriptions.Item>
            <Descriptions.Item
              labelStyle={customLabelStyle}
              contentStyle={customContentStyle}
              label="DATE"
            >
              {formatDate(selectBooking!.time_start)}
            </Descriptions.Item>
            <Descriptions.Item
              labelStyle={customLabelStyle}
              contentStyle={customContentStyle}
              label="CREATER"
            >
              {selectBooking!.creator_name}
            </Descriptions.Item>
            <Descriptions.Item
              labelStyle={customLabelStyle}
              contentStyle={customContentStyle}
              label="TOTAL PARTICIPATIONS"
            >
              {selectBooking!.user_name}{" "}
            </Descriptions.Item>
            <Descriptions.Item
              labelStyle={customLabelStyle}
              contentStyle={customContentStyle}
              label="TIME START"
            >
              {formatTime(selectBooking!.time_start)}{" "}
            </Descriptions.Item>
            <Descriptions.Item
              labelStyle={customLabelStyle}
              contentStyle={customContentStyle}
              label="TIME END"
            >
              {formatTime(selectBooking!.time_end)}{" "}
            </Descriptions.Item>
          </Descriptions>
          <div className="group-btn-action">
            <Button
              className="btn-action"
              style={{ backgroundColor: "#009900" }}
              onClick={() => {
                onSucces(selectBooking);
                onChange(false)
              }}
            >
              ACCEPT
            </Button>
            <Button
              className="btn-action"
              style={{ backgroundColor: "#ff0000" }}
              onClick={() => {
                onReject(selectBooking);
                onChange(false)
              }}
            >
              REJECT
            </Button>
          </div>
        </div>
      </Card>
      <Table className="list-user" columns={columns} dataSource={listUsers} />
    </>
  );
};

export default DetailBookingWait;
