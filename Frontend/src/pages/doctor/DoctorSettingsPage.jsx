import DoctorPortalLayout from "../../features/doctor/DoctorPortalLayout";
import useDoctorPortal, {
  DOCTOR_AVAILABILITY_STEP_MINUTES,
  PROFILE_WEEK_DAYS,
} from "../../features/doctor/useDoctorPortal";

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
    addWeeklyPeriod,
    removeWeeklyPeriod,
    updateWeeklyPeriod,
    weeklyRangeDraft,
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
                ? `${profileForm.availability.length} day(s) with availability`
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
              <div className="form-block">
                <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem", color: "#334155" }}>
                  Weekly availability for patients
                </h3>
                <p className="subtle-text" style={{ marginBottom: "0.65rem" }}>
                  Add work periods per day (for example morning{" "}
                  <strong>08:00 → 12:00</strong> and afternoon <strong>14:00 → 18:00</strong>). Bookable
                  times are generated every <strong>{DOCTOR_AVAILABILITY_STEP_MINUTES} minutes</strong> inside
                  each period. Leave a day with no periods if you are off.
                </p>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {PROFILE_WEEK_DAYS.map((dayLabel) => (
                    <div key={dayLabel} className="doctor-availability-day">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{dayLabel}</strong>
                        <button
                          className="btn-secondary"
                          onClick={() => addWeeklyPeriod(dayLabel)}
                          type="button"
                        >
                          Add period
                        </button>
                      </div>
                      {(weeklyRangeDraft[dayLabel] || []).length === 0 ? (
                        <p className="subtle-text" style={{ margin: "0.35rem 0 0" }}>
                          No periods — patients cannot book this weekday.
                        </p>
                      ) : null}
                      {(weeklyRangeDraft[dayLabel] || []).map((row, idx) => (
                        <div className="two-col-fields" key={`${dayLabel}-${idx}`}>
                          <label>
                            From
                            <input
                              type="time"
                              step={60 * DOCTOR_AVAILABILITY_STEP_MINUTES}
                              value={row.start}
                              onChange={(e) =>
                                updateWeeklyPeriod(dayLabel, idx, "start", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            To
                            <input
                              type="time"
                              step={60 * DOCTOR_AVAILABILITY_STEP_MINUTES}
                              value={row.end}
                              onChange={(e) =>
                                updateWeeklyPeriod(dayLabel, idx, "end", e.target.value)
                              }
                            />
                          </label>
                          <button
                            className="btn-secondary"
                            onClick={() => removeWeeklyPeriod(dayLabel, idx)}
                            style={{ gridColumn: "1 / -1", justifySelf: "start" }}
                            type="button"
                          >
                            Remove period
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
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
