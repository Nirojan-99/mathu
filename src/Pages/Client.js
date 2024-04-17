import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import Formtable from "../components/Formtable";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/";

export default function Client() {
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

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}create`, formData);
      if (data.success) {
        alert(data.Message);
        getFetchData();
      }
    } catch (error) {
      alert("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}delete/${id}`);
      alert(response.data.message);
      getFetchData();
    } catch (error) {
      alert("Error deleting item. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.put(`${BASE_URL}update`, formDataEdit);
      if (data.data.success) {
        getFetchData();
        alert(data.data.message);
        setEditSection(false);
      }
    } catch (error) {
      alert("Error updating item. Please try again.");
    }
  };

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Color", "Size", "Adding", "Quantity"];
    const tableRows = [];

    dataList.forEach((item) => {
      const rowData = [item.color, item.size, item.add, item.quan];
      tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("table_data.pdf");
  };

  return (
    <>
      <div className="container">
        <button
          className="btn btn-view"
          onClick={() => setTableVisible(!tableVisible)}
        >
          Toggle Table
        </button>
        {tableVisible && (
          <>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={generatePDF} className="btn btn-download">
              Download PDF
            </button>
          </>
        )}
      </div>

      {tableVisible && (
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Size</th>
                <th>Adding</th>
                <th>Quantity</th>
                <th>Actions</th>
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
                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(el)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(el._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {editSection ? (
        <Formtable
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          handleClose={() => setEditSection(false)}
          rest={formDataEdit}
          loading={loading}
        />
      ) : (
        <Formtable
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          handleClose={() => setEditSection(false)}
          rest={formData}
          loading={loading}
        />
      )}
    </>
  );
}
