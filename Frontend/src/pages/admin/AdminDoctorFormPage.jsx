import { useParams } from "react-router-dom";
import AdminPortalLayout from "../../features/admin/AdminPortalLayout";
import useAdminPortal from "../../features/admin/useAdminPortal";

function AdminDoctorFormPage() {
  const { doctorId } = useParams();
  const editDoctorId = doctorId || null;

  const {
    doctorForm,
    editingDoctorId,
    error,
    handleCreateOrUpdateDoctor,
    isLoading,
    message,
    setDoctorForm,
  } = useAdminPortal({ editDoctorId });

  const title = editingDoctorId ? "Edit Doctor" : "Register Practitioner";

  return (
    <AdminPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      subtitle="Admin endpoints are now connected to live API calls."
      title={title}
    >
      <section className="admin-add-doctor-page">
        <article className="white-panel add-doctor-form-card">
          <form onSubmit={handleCreateOrUpdateDoctor}>
            <div className="form-block">
              <h3>Doctor Information</h3>
              <label>
                Full Name
                <input
                  onChange={(event) =>
                    setDoctorForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                  type="text"
                  value={doctorForm.name}
                />
              </label>
              <div className="two-col-fields">
                <label>
                  Professional Email
                  <input
                    onChange={(event) =>
                      setDoctorForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                    type="email"
                    value={doctorForm.email}
                  />
                </label>
                <label>
                  Contact Number
                  <input
                    onChange={(event) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        contactNumber: event.target.value,
                      }))
                    }
                    required
                    type="text"
                    value={doctorForm.contactNumber}
                  />
                </label>
              </div>
            </div>

            <div className="form-block">
              <h3>Credentials</h3>
              <div className="two-col-fields">
                <label>
                  Medical Specialty
                  <input
                    onChange={(event) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        specialty: event.target.value,
                      }))
                    }
                    required
                    type="text"
                    value={doctorForm.specialty}
                  />
                </label>
                <label>
                  Password {editingDoctorId ? "(optional for update)" : ""}
                  <input
                    onChange={(event) =>
                      setDoctorForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    required={!editingDoctorId}
                    type="password"
                    value={doctorForm.password}
                  />
                </label>
              </div>
            </div>

            <button className="btn-primary wide register-doctor-btn" type="submit">
              {editingDoctorId ? "Update Doctor" : "Create Doctor"}
            </button>
          </form>
        </article>
      </section>
    </AdminPortalLayout>
  );
}

export default AdminDoctorFormPage;
