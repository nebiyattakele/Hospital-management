import PatientPortalLayout from "../../features/patient/PatientPortalLayout";
import usePatientPortal from "../../features/patient/usePatientPortal";

function PatientNotificationsPage() {
  const {
    error,
    getNotificationId,
    handleMarkRead,
    isLoading,
    message,
    notifications,
  } = usePatientPortal();

  return (
    <PatientPortalLayout
      error={error}
      isLoading={isLoading}
      message={message}
      notificationCount={notifications.length}
      subtitle="Review and manage your unread alerts."
      title="Notifications"
    >
      <section className="settings-page-content">
        <article className="white-panel settings-section">
          <div className="settings-head">
            <h3>Unread Notifications</h3>
          </div>
          <div className="settings-notification-list">
            {notifications.map((notification) => (
              <div
                className="settings-notification-item"
                key={getNotificationId(notification) || notification.title}
              >
                <div className="settings-notification-content">
                  <p>{notification.message || notification.text || "No details provided."}</p>
                </div>
                {getNotificationId(notification) ? (
                  <button
                    className="notification-mark-btn"
                    onClick={() => handleMarkRead(getNotificationId(notification))}
                    type="button"
                  >
                    Mark as Read
                  </button>
                ) : null}
              </div>
            ))}
            {!notifications.length ? (
              <p className="subtle-text">No unread notifications.</p>
            ) : null}
          </div>
        </article>
      </section>
    </PatientPortalLayout>
  );
}

export default PatientNotificationsPage;
