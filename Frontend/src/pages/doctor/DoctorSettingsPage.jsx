import DoctorPortalLayout from "../../features/doctor/DoctorPortalLayout";
import useDoctorPortal from "../../features/doctor/useDoctorPortal";

function DoctorSettingsPage() {
  const {
    formError,
    handlePasswordSubmit,
    handleProfileSubmit,
    message,
    passwordForm,
    profileForm,
    setFormError,
    setPasswordForm,
    setProfileForm,
    setShowChangePassword,
    setShowEditProfile,
    showChangePassword,
    showEditProfile,
  } = useDoctorPortal();

  return (
    <DoctorPortalLayout
      profileName={profileForm.name}
      profileSpecialty={profileForm.specialty}
    >
      <section className="doctor-profile-page">
        <article className="white-panel doctor-profile-card">
          <div className="doctor-profile-main">
            <div className="doctor-detail-avatar" />
            <div>
              <h2>{profileForm.name || "Doctor Profile"}</h2>
              <p>{profileForm.specialty || "Specialty not set"}</p>
            </div>
          </div>
          <div className="doctor-profile-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setShowEditProfile((prev) => !prev);
                setShowChangePassword(false);
                setFormError("");
              }}
              type="button"
            >
              Edit Profile
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setShowChangePassword((prev) => !prev);
                setShowEditProfile(false);
                setFormError("");
              }}
              type="button"
            >
              Change Password
            </button>
          </div>
        </article>

        <article className="white-panel doctor-contact-grid">
          <div>
            <h3>Contact Information</h3>
            <p>Contact Number: {profileForm.contactNumber || "-"}</p>
          </div>
          <div>
            <h3>Availability</h3>
            <p>
              {profileForm.availability?.length
                ? `${profileForm.availability.length} day(s) configured`
                : "No availability set"}
            </p>
          </div>
        </article>

        {message ? <p className="success-text">{message}</p> : null}
        {formError ? <p className="error-text">{formError}</p> : null}

        {showEditProfile ? (
          <article className="white-panel">
            <h3>Edit Profile</h3>
            <form onSubmit={handleProfileSubmit}>
              <label>
                Full Name
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </label>
              <label>
                Specialty
                <input
                  type="text"
                  value={profileForm.specialty}
                  onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                />
              </label>
              <div className="two-col-fields">
                <label>
                  Contact Number
                  <input
                    type="text"
                    value={profileForm.contactNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <button className="btn-primary" type="submit">
                Save Profile
              </button>
            </form>
          </article>
        ) : null}

        {showChangePassword ? (
          <article className="white-panel">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <label>
                Current Password
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Confirm New Password
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </label>
              <button className="btn-primary" type="submit">
                Update Password
              </button>
            </form>
          </article>
        ) : null}
      </section>
    </DoctorPortalLayout>
  );
}

export default DoctorSettingsPage;
