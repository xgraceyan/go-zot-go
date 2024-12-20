import React, { useState } from "react";
import "./Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Route } from "./routes/Route";
import { PlaceSearch } from "./PlaceSearch";
import { CustomRoute } from "./routes/CustomRoute";
import { PlaceSearchForm } from "./PlaceSearchForm";
import axios from "axios";

const Sidebar = (props) => {
  const [activeStop, setActiveStop] = useState(null); // For stops
  const [menuOpen, setMenuOpen] = useState(false); // State for the menu
  const [selectedIcons, setSelectedIcons] = useState([]); // For multiple active transportation icons
  const [filtersOpen, setFiltersOpen] = useState(false); // For filter dropdown visibility
  const [modalOpen, setModalOpen] = useState(false); // For Add New modal visibility
  const [reviewModalOpen, setReviewModalOpen] = useState(false); // For Review modal visibility
  const [selectedStop, setSelectedStop] = useState(null); // To track selected stop for reviews
  const [routes, setRoutes] = useState([]); // To store dynamically added stops
  const [destination, setDestination] = useState("");

  const [formDestination, setFormDestination] = useState({});
  const [formCost, setFormCost] = useState("");
  const [formDuration, setFormDuration] = useState("");

  const [formFields, setFormFields] = useState([
    { field: "route1", value: {"to":"","from":"","mode":"","type":"","duration":"","cost":""} },
  ]);

  /*const [reviews, setReviews] = useState({
    1: [
      { name: "Rebecca", text: "Great stop!", rating: 5 },
      { name: "Joshua", text: "Very convenient.", rating: 4 },
    ],
    2: [
      { name: "Michael", text: "Crowded but useful.", rating: 3 },
      { name: "Sophia", text: "Nice scenery.", rating: 4 },
    ],
    3: [
      { name: "Liam", text: "Clean and spacious.", rating: 5 },
      { name: "Olivia", text: "Good for families.", rating: 4 },
    ],
  });*/
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([])

  // Toggle active stop
  const toggleStop = (stop) => {
    setActiveStop(activeStop === stop ? null : stop);
    console.log("STOP>>", activeStop);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle icon click
  const toggleIcon = (iconName) => {
    if (selectedIcons.includes(iconName)) {
      setSelectedIcons(selectedIcons.filter((icon) => icon !== iconName));
    } else {
      setSelectedIcons([...selectedIcons, iconName]);
    }
  };

  // Handle form input changes
  const handleInputChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  // Handle form input changes to steps
  const handleStepChange = (index, new_value, detail) => {
    if (detail.includes("end location")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.to = new_value;
      setFormFields(updatedFields);
    } else if (detail.includes("start location")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.from = new_value;
      setFormFields(updatedFields);
    } else if (detail.includes("travel mode")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.mode = new_value;
      setFormFields(updatedFields);
    } else if (detail.includes("mode details")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.type = new_value;
      setFormFields(updatedFields);
    } else if (detail.includes("duration")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.duration = new_value;
      setFormFields(updatedFields);
    } else if (detail.includes("cost")) {
      const updatedFields = [...formFields];
      updatedFields[index].value.cost = new_value;
      setFormFields(updatedFields);
    }
  }

  // Add a new field
  const handleAddField = () => {
    setFormFields([
      ...formFields,
      { field: "route" + (formFields.length + 1), value: {"to":"","from":"","mode":"","type":"","duration":"","cost":""} },
    ]);
  };

  // Remove a field
  const handleRemoveField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  // Handle form submission to add a new route
  const handleAddRoute = () => {
    if (
      formFields.some((field) => field.value.to == "") ||
      formFields.some((field) => field.value.from == "") ||
      formDestination == "" ||
      formCost == "" ||
      formDuration == ""
    ) {
      alert("Please fill out all fields before adding a route.");
      return;
    }

    var route = [];
    formFields.forEach((field) => {
      route.push(JSON.stringify(field));
    });

    var formData = new FormData();
    formData.append("destination_lat", formDestination.geometry.location.lat());
    formData.append("destination_lon", formDestination.geometry.location.lng());
    formData.append("destination", formDestination.name);
    formData.append("route", route);
    formData.append("cost", formCost);
    formData.append("duration", formDuration);

    axios({
      method: "post",
      url: "/api/custom_routes",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    const newRoute = formFields.map((field) => field.value).join(" -> ");
    setRoutes([...routes, newRoute]); // Add the new route to the list
    setModalOpen(false); // Close modal after adding
    setFormFields([{ field: "route1", value: {"to":"","from":"","mode":"","type":"","duration":"","cost":""} }]); // Reset fields
  };

  // Open review modal for reviews
  const openReviewModal = (stop) => {
    setSelectedStop(stop);
    setReviewModalOpen(true);
    props.fetchReviews(setReviews);
    setSelectedReviews([])
    for (let review of reviews) {
      console.log(review["routeId"],review["routeId"] == activeStop)
      if (review["routeId"] == activeStop){
        setSelectedReviews([...selectedReviews,review])
      }
    }
    setReviews(selectedReviews)
    console.log("activeStop>>",activeStop)
    console.log("selectedReviews>>",selectedReviews)
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setReviewModalOpen(false);
    setSelectedStop(null);
  };

  console.log("REVIEWS>>",reviews)

  return (
    <>
      {/* Menu Bar */}
      <div className={`menu-bar ${menuOpen ? "open" : ""}`}>
        <span className="close-menu-btn" onClick={toggleMenu}>
          &times;
        </span>
        <h2>Transportation Types</h2>

        {/* Walking Icon */}
        <div
          className={`menu-item ${
            selectedIcons.includes("walking") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("walking")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/walking.png"
            alt="Walking"
          />
          <span className="menu-label">Walking</span>
        </div>

        {/* Train Icon */}
        <div
          className={`menu-item ${
            selectedIcons.includes("train") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("train")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/train.png"
            alt="Train"
          />
          <span className="menu-label">Train</span>
        </div>

        {/* Bus Icon */}
        <div
          className={`menu-item ${
            selectedIcons.includes("bus") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("bus")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/bus.png"
            alt="Bus"
          />
          <span className="menu-label">Bus</span>
        </div>

        {/* Car Icon */}
        <div
          className={`menu-item ${
            selectedIcons.includes("car") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("car")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/car.png"
            alt="Car"
          />
          <span className="menu-label">Car</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Search Bar */}
        <h1>Go Zot Go!</h1>
        <div className="search-bar">
          <button className="menu-btn" onClick={toggleMenu}>
            ☰
          </button>
          <PlaceSearch setLoc={props.setLoc} setDestination={setDestination} fetchRoutes={props.fetchRoutes} />
          <button className="secondary-button" onClick={props.fetchRoutes}>
            Go
          </button>
        </div>

        {/* Filter and Add New Buttons */}
        <div className="action-buttons">
          <button
            className="filter-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
          </button>

          <button className="popup-btn" onClick={() => setModalOpen(true)}>
            Add New
          </button>
        </div>

          {/* Filter Dropdown */}
          {filtersOpen && (
          <div className="filter-dropdown">
            <label>
              <input type="checkbox" />
              Price
            </label>
            <label>
              <input type="checkbox" />
              Rating
            </label>
            <label>
              <input type="checkbox" />
              Distance
            </label>
          </div>
        )}

        {/* Stops with Dropdowns */}
        <div className="suggestions">
          {props.routes.map((route,index) => {
            if (route.overview_polyline) {
              return (
                <CustomRoute
                  key={"route.overview_polyline"+index}
                  functions={{ activeStop, toggleStop, openReviewModal }}
                  data={route}
                  destination={destination}
                />
              );
            } else {
              return (
                <Route
                  key={route.id}
                  functions={{ activeStop, toggleStop, openReviewModal }}
                  data={route} // destination, route, time, notes
                />
              );
            }
          })}
        </div>
      </div>

      {/* Add New Route Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              Add New Route
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{overflow:"scroll"}}>
              <p style={{ marginBottom: 10 }}>
                Fill in route details from UCI to destination
              </p>
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div
                  style={{
                    flex: 1,
                    marginRight: "10px",
                    background: "white",
                    color: "black",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <PlaceSearchForm setFormVal={setFormDestination} placeholder={"Enter a destination"}/>
                </div>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Enter cost in dollars, e.g. 1.21"
                  required
                  style={{
                    marginBottom: "10px",
                    background: "white",
                    color: "black",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "98%",
                  }}
                  onChange={(e) => {
                    setFormCost(e.target.value);
                  }}
                />
                <input
                  type="text"
                  placeholder="Enter duration, e.g. 1 hr 20 min"
                  required
                  style={{
                    marginBottom: "10px",
                    background: "white",
                    color: "black",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "98%",
                  }}
                  onChange={(e) => {
                    setFormDuration(e.target.value);
                  }}
                />
              </div>
              {formFields.map((field, index) => (
                <div
                  key={"formField"+index}
                  style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}
                >
                  {/* <input
                    type="text"
                    placeholder="Enter step instructions, e.g. Metrolink from Tustin Station to LA Union Station"
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      background: "white",
                      color: "black",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  />

                  <input
                    type="text"
                    placeholder={
                      field.field === "starting"
                        ? "Enter starting point"
                        : field.field === "destination"
                        ? "Enter destination"
                        : "Additional info"
                    }
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      background: "white",
                      color: "black",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  /> */}
                  <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}>
                    <p style={{ marginBottom: 10 }}>
                      Step {index+1}
                    </p>
                    {index >= 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        style={{
                          background: "#ff4b4b",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          marginLeft: "10px"
                        }}
                      >
                        -
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px" }}>
                    {/*<div
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px"
                      }}
                    >
                    <PlaceSearchForm setFormVal={handleStepChange} placeholder={"Enter start location"} index={index}/>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "10px"
                      }}
                    >
                    <PlaceSearchForm setFormVal={handleStepChange} placeholder={"Enter end location"} index={index}/>
                    </div>*/}
                    <input
                      type="text"
                      placeholder="Enter start location"
                      value={field.value.from}
                      onChange={(e) => handleStepChange(index, e.target.value, "Enter start location")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter end location"
                      value={field.value.to}
                      onChange={(e) => handleStepChange(index, e.target.value, "Enter end location")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter travel mode"
                      value={field.value.mode}
                      onChange={(e) => handleStepChange(index, e.target.value, "Enter travel mode")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Travel mode details"
                      value={field.value.type}
                      onChange={(e) => handleStepChange(index, e.target.value, "Travel mode details")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter duration"
                      value={field.value.duration}
                      onChange={(e) => handleStepChange(index, e.target.value, "Enter duration")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter cost"
                      value={field.value.cost}
                      onChange={(e) => handleStepChange(index, e.target.value, "Enter cost")}
                      style={{
                        flex: 1,
                        marginRight: "10px",
                        marginBottom: "10px",
                        background: "white",
                        color: "black",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddField}
                style={{
                  background: "#0064A4",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                + Add Step
              </button>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleAddRoute}
                style={{
                  background: "#0064A4",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={closeModal}
                style={{
                  background: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              Reviews
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {selectedReviews?.map((review, index) => {
                return <div
                  key={"review"+index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    marginBottom: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>{review.name}</strong>
                    <span>
                      {"★".repeat(review.stars)}
                      {"☆".repeat(5 - review.stars)}
                    </span>
                  </div>
                  <p>{review.comments}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#0064A4",
                      }}
                    >
                      👍
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ff4b4b",
                      }}
                    >
                      👎
                    </button>
                  </div>
                </div>
              })}
              {!selectedReviews?.length && <p>No reviews available.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
