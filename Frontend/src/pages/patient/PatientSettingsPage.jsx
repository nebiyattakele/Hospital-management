import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientSettingsPage() {
  const {
    error,
    handleSaveProfile,
    isEditingProfile,
    isLoading,
    loadPortalData,
    message,
    notifications,
    profile,
    setIsEditingProfile,
    setProfile,
  } = usePatientPortal();

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Manage your profile details."
      title="Settings"
    >
      <section className="settings-page-content">
        <article className="white-panel settings-section">
          <div className="settings-head">
            <h3>Profile</h3>
            {!isEditingProfile ? (
              <button onClick={() => setIsEditingProfile(true)} type="button">
                Edit Profile
              </button>
            ) : (
              <button onClick={handleSaveProfile} type="button">
                Save
              </button>
            )}
          </div>
          <div className="settings-grid">
            <div>
              <small>Full Name</small>
              {isEditingProfile ? (
                <input
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, name: event.target.value }))
                  }
                  type="text"
                  value={profile?.name || ""}
                />
              ) : (
                <p>{profile?.name || "N/A"}</p>
              )}
            </div>
            <div>
              <small>Email</small>
              {isEditingProfile ? (
                <input
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, email: event.target.value }))
                  }
                  type="email"
                  value={profile?.email || ""}
                />
              ) : (
                <p>{profile?.email || "N/A"}</p>
              )}
            </div>
            <div>
              <small>Age</small>
              {isEditingProfile ? (
                <input
                  min="0"
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, age: Number(event.target.value) }))
                  }
                  type="number"
                  value={profile?.age || ""}
                />
              ) : (
                <p>{profile?.age || "N/A"}</p>
              )}
            </div>
            <div>
              <small>Gender</small>
              {isEditingProfile ? (
                <input
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, gender: event.target.value }))
                  }
                  type="text"
                  value={profile?.gender || ""}
                />
              ) : (
                <p>{profile?.gender || "N/A"}</p>
              )}
            </div>
            <div>
              <small>Address</small>
              {isEditingProfile ? (
                <input
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, address: event.target.value }))
                  }
                  type="text"
                  value={profile?.address || ""}
                />
              ) : (
                <p>{profile?.address || "N/A"}</p>
              )}
            </div>
            <div>
              <small>Phone Number</small>
              {isEditingProfile ? (
                <input
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      contactNumber: event.target.value,
                    }))
                  }
                  type="text"
                  value={profile?.contactNumber || ""}
                />
              ) : (
                <p>{profile?.contactNumber || "N/A"}</p>
              )}
            </div>
          </div>
          {isEditingProfile ? (
            <div className="button-row" style={{ padding: "0 0.9rem 0.9rem" }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setIsEditingProfile(false);
                  loadPortalData();
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </article>

      </section>
    </PatientPortalLayout>
  );
}

export default PatientSettingsPage;
