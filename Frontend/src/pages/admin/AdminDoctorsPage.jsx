import { Link, useNavigate } from "react-router-dom";
import AdminPortalLayout from "../../features/admin/AdminPortalLayout";
import useAdminPortal, { getDoctorRecordId } from "../../features/admin/useAdminPortal";

function AdminDoctorsPage() {
  const navigate = useNavigate();
  const { doctors, error, handleDeleteDoctor, isLoading, message } = useAdminPortal();

  return (
    <AdminPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      // subtitle="Admin endpoints are now connected to live API calls."
      title="Doctors Management"
    >
      <section className="admin-doctors-page">
        <article className="white-panel admin-directory-panel">
          <div className="admin-table-head">
            <h2>Doctor Directory</h2>
            <div className="admin-directory-actions">
              <Link className="btn-primary" to="/admin/doctors/new">
                + Add New Doctor
              </Link>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={getDoctorRecordId(doctor) || doctor.email}>
                  <td>{doctor.name || "-"}</td>
                  <td>{doctor.specialty || "-"}</td>
                  <td>{doctor.email || "-"}</td>
                  <td>{doctor.contactNumber || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-outline"
                        onClick={() => {
                          const id = getDoctorRecordId(doctor);
                          if (id) navigate(`/admin/doctors/${id}/edit`);
                        }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="action-danger"
                        onClick={() => handleDeleteDoctor(getDoctorRecordId(doctor))}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!doctors.length ? (
                <tr>
                  <td colSpan="5">No doctors found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </article>
      </section>
    </AdminPortalLayout>
  );
}

export default AdminDoctorsPage;
