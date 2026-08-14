import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    rating: 5,
  });

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Dashboard Data
  // =========================

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userResponse = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setUser(userData);

        await fetchTrips();
      } catch (err) {
        console.error(err);
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =========================
  // Get Trips
  // =========================

  const fetchTrips = async () => {
  try {
    const response = await api.get("/trips");

    setTrips(response.data);
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || "Failed to load trips."
    );
  }
};

      

  // =========================
  // Form Input
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Open Add Modal
  // =========================

  const openAddModal = () => {
    setEditingTrip(null);

    setFormData({
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      rating: 5,
    });

    setShowModal(true);
  };

  // =========================
  // Open Edit Modal
  // =========================

  const openEditModal = (trip) => {
    setEditingTrip(trip);

    setFormData({
      title: trip.title || "",
      destination: trip.destination || "",
      startDate: trip.startDate
        ? trip.startDate.split("T")[0]
        : "",
      endDate: trip.endDate
        ? trip.endDate.split("T")[0]
        : "",
      description: trip.description || "",
      rating: trip.rating || 5,
    });

    setShowModal(true);
  };

  // =========================
  // Create / Update Trip
  // =========================

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (new Date(formData.endDate) < new Date(formData.startDate)) {
    alert("End date cannot be before start date.");
    return;
  }

  setFormLoading(true);

  try {
    const payload = {
      ...formData,
      rating: Number(formData.rating),
    };

    if (editingTrip) {
      await api.put(`/trips/${editingTrip._id}`, payload);
    } else {
      await api.post("/trips", payload);
    }

    setShowModal(false);

    await fetchTrips();

    setFormData({
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      rating: 5,
    });
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message || "Unable to connect to the server."
    );
  } finally {
    setFormLoading(false);
  }
};

  // =========================
  // Delete Trip
  // =========================

  const handleDelete = async (tripId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this trip?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`/trips/${tripId}`);

    await fetchTrips();
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message || "Failed to delete trip."
    );
  }
};

  // =========================
  // Logout
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =========================
  // Date Formatter
  // =========================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Statistics
  // =========================

  const averageRating =
    trips.length > 0
      ? (
          trips.reduce(
            (sum, trip) => sum + Number(trip.rating || 0),
            0
          ) / trips.length
        ).toFixed(1)
      : "—";

  const destinationCount = new Set(
    trips.map((trip) => trip.destination)
  ).size;

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">
        <div className="brand">
          <span className="brand-icon">✈</span>
          <span>TripVault</span>
        </div>

        <div className="nav-right">

          {user && (
            <div className="user-info">
              <div className="avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="user-details">
                <span className="user-name">
                  {user.name}
                </span>

                <span className="user-email">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="dashboard-content">

        {/* Welcome */}

        <section className="welcome-section">

          <div>
            <p className="welcome-label">
              YOUR TRAVEL SPACE
            </p>

            <h1>
              Welcome back{user ? `, ${user.name}` : ""} 👋
            </h1>

            <p className="welcome-text">
              Keep track of your adventures, memories and upcoming journeys.
            </p>
          </div>

          <button
            className="add-trip-btn"
            onClick={openAddModal}
          >
            <span>+</span>
            Add New Trip
          </button>

        </section>

        {/* ================= STATISTICS ================= */}

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">🗺️</div>

            <div>
              <span className="stat-label">
                Total Trips
              </span>

              <h2>{trips.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>

            <div>
              <span className="stat-label">
                Average Rating
              </span>

              <h2>{averageRating}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌍</div>

            <div>
              <span className="stat-label">
                Destinations
              </span>

              <h2>{destinationCount}</h2>
            </div>
          </div>

        </section>

        {/* ================= TRIPS ================= */}

        <section className="trips-section">

          <div className="section-header">

            <div>
              <h2>Your Trips</h2>

              <p>
                Your personal collection of adventures
              </p>
            </div>

            <span className="trip-count">
              {trips.length}{" "}
              {trips.length === 1 ? "Trip" : "Trips"}
            </span>

          </div>

          {loading && (
            <div className="state-card">
              <div className="spinner"></div>
              <p>Loading your adventures...</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-card error-state">
              <div className="state-icon">
                ⚠️
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            trips.length === 0 && (
              <div className="state-card empty-state">

                <div className="empty-icon">
                  ✈️
                </div>

                <h3>
                  No trips yet
                </h3>

                <p>
                  Your next adventure is waiting to be added.
                </p>

                <button
                  className="add-trip-btn"
                  onClick={openAddModal}
                >
                  + Create Your First Trip
                </button>

              </div>
            )}

          {!loading &&
            !error &&
            trips.length > 0 && (
              <div className="trip-grid">

                {trips.map((trip) => (
                  <article
                    className="trip-card"
                    key={trip._id}
                  >

                    <div className="trip-card-top">

                      <div className="destination-icon">
                        📍
                      </div>

                      <span className="rating">
                        ⭐ {trip.rating || "N/A"}
                      </span>

                    </div>

                    <div className="trip-card-body">

                      <p className="destination">
                        {trip.destination}
                      </p>

                      <h3>
                        {trip.title}
                      </h3>

                      <div className="trip-date">
                        <span>📅</span>

                        <span>
                          {formatDate(trip.startDate)}
                          {" — "}
                          {formatDate(trip.endDate)}
                        </span>
                      </div>

                      {trip.description && (
                        <p className="trip-description">
                          {trip.description}
                        </p>
                      )}

                    </div>

                    <div className="trip-card-footer">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditModal(trip)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(trip._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                ))}

              </div>
            )}

        </section>

      </main>

      {/* ================= MODAL ================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="trip-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>
                  {editingTrip
                    ? "Edit Trip"
                    : "Add New Trip"}
                </h2>

                <p>
                  {editingTrip
                    ? "Update your travel details."
                    : "Save the details of your next adventure."}
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form
              className="trip-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="form-group">
                  <label>
                    Trip Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Goa Adventure"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Destination
                  </label>

                  <input
                    type="text"
                    name="destination"
                    placeholder="e.g. Goa, India"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="form-group">

                <label>
                  Rating
                </label>

                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="5">
                    ⭐⭐⭐⭐⭐ Excellent
                  </option>

                  <option value="4">
                    ⭐⭐⭐⭐ Great
                  </option>

                  <option value="3">
                    ⭐⭐⭐ Good
                  </option>

                  <option value="2">
                    ⭐⭐ Average
                  </option>

                  <option value="1">
                    ⭐ Poor
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Tell us about your trip..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-trip-btn"
                  disabled={formLoading}
                >
                  {formLoading
                    ? "Saving..."
                    : editingTrip
                    ? "Update Trip"
                    : "Create Trip"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Dashboard;