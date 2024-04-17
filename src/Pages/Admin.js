import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "jspdf-autotable";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/";

export default function Admin() {
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    color: "",
    size: "",
    add: "",
    quan: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    color: "",
    size: "",
    add: "",
    quan: "",
    _id: "",
  });
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getFetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(BASE_URL);
      setDataList(data.data);
    } catch (error) {
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  return (
    <>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Color</th>
              <th>Size</th>
              <th>Adding</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {dataList
              .filter(
                (el) =>
                  el.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  el.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  el.add.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  el.quan.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((el) => (
                <tr key={el._id}>
                  <td>{el.color}</td>
                  <td>{el.size}</td>
                  <td>{el.add}</td>
                  <td>{el.quan}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
