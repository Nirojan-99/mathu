import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../App.css";
import img1 from "./image/stu.jpeg";

const Formtable = ({
  handleSubmit,
  handleOnChange,
  handleclose,
  loading,
  rest,
}) => {
  const [showOptions, setShowOptions] = useState({
    color: false,
    size: false,
    quan: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleOptions = (column) => {
    setShowOptions({
      ...showOptions,
      [column]: !showOptions[column],
    });
  };

  return (
    <div className="addContainer">
      <img src={img1} alt="Your image description" className="form-image" />{" "}
      {/* Add image */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="color">Color:</label>
        <select
          id="color"
          name="color"
          onChange={handleOnChange}
          value={rest.color}
        >
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="yello">Yello</option>
          <option value="green">Green</option>
        </select>
        <label htmlFor="size">Size:</label>
        {showOptions.size ? (
          <select
            id="size"
            name="size"
            onChange={handleOnChange}
            value={rest.size}
          >
            {Array.from({ length: 31 }, (_, i) => 35 + i).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="size"
            name="size"
            onClick={() => toggleOptions("size")}
            value={rest.size}
            readOnly
          />
        )}
        <label htmlFor="add">Adding:</label>
        <select id="add" name="add" onChange={handleOnChange} value={rest.add}>
          <option value="UV protection">UV protection</option>
          <option value="Cooling">Cooling</option>
          <option value="Blue light blocking">Blue light blocking</option>
          <option value="Anti-Reflective Coating">
            Anti-Reflective Coating
          </option>
        </select>
        <label htmlFor="quan">Quantity:</label>
        <input
          type="number"
          id="quan"
          name="quan"
          onChange={handleOnChange}
          value={rest.quan}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Formtable;
