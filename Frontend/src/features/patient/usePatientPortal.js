import { useEffect, useMemo, useState } from "react";
import {
  bookAppointment,
  cancelAppointment,
  getDoctorDetails,
  getDoctors,
  getMyAppointments,
  getPatientDashboardData,
  getPatientNotifications,
  getPatientProfile,
  markNotificationAsRead,
  rescheduleAppointment,
  updatePatientProfile,
} from "../../api/patientApi";
import { resolveEntityId, toArray, unwrapApiPayload } from "../../utils/dataAdapters";

const getDoctorNameFromAppointment = (item) =>
  item?.doctorId?.name || item?.doctor || item?.doctorName || "Not assigned";
const getDoctorSpecialtyFromAppointment = (item) =>
  item?.doctorId?.specialty || item?.specialty || "Specialty unavailable";

const formatDateDisplay = (value) => {
  if (!value) return "-";
  const dateObj = new Date(value);
  if (!Number.isNaN(dateObj.getTime())) {
    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
  return String(value).split("T")[0];
};

const formatTimeDisplay = (value) => {
  if (!value) return "-";
  const normalized = String(value).trim();
  if (/^\d{2}:\d{2}$/.test(normalized)) {
    const [hourRaw, minute] = normalized.split(":");
    const hourNum = Number(hourRaw);
    const period = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${minute} ${period}`;
  }
  return normalized;
};

const formatAvailability = (availability) => {
  if (!availability) return "Availability not provided";
  if (Array.isArray(availability)) {
    if (!availability.length) return "No slots configured";
    return `${availability.length} schedule slot(s)`;
  }
  return String(availability);
};

const getLocalDateKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getAppointmentDateKey = (item) => {
  const raw = item?.date;
  if (!raw) return null;
  if (typeof raw === "string") {
    const dateOnly = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (dateOnly) return dateOnly[1];
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return getLocalDateKey(parsed);
};

const getAppointmentDateTime = (item) => {
  const dateKey = getAppointmentDateKey(item);
  if (!dateKey) return null;
  const timeStr = String(item?.time || "00:00").trim();
  const timeMatch = /^(\d{1,2}):(\d{2})/.exec(timeStr);
  const hour = timeMatch ? Number(timeMatch[1]) : 0;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;
  const [y, m, d] = dateKey.split("-").map(Number);
  const dateTime = new Date(y, m - 1, d, hour, minute, 0, 0);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
};

const filterAppointmentsByTab = (items, tab) => {
  const now = new Date();
  const todayKey = getLocalDateKey(now);

  if (tab === "today") {
    return items.filter((item) => getAppointmentDateKey(item) === todayKey);
  }

  if (tab === "past") {
    return items.filter((item) => {
      const key = getAppointmentDateKey(item);
      if (!key) return false;
      if (key < todayKey) return true;
      if (key > todayKey) return false;
      const dt = getAppointmentDateTime(item);
      return dt ? dt < now : false;
    });
  }

  if (tab === "upcoming") {
    return items.filter((item) => {
      const key = getAppointmentDateKey(item);
      if (!key) return false;
      if (key > todayKey) return true;
      if (key < todayKey) return false;
      const dt = getAppointmentDateTime(item);
      return dt ? dt >= now : true;
    });
  }

  return items;
};

function usePatientPortal({ doctorId } = {}) {
  const [dashboardData, setDashboardData] = useState({
    latestAppointment: null,
    recentAppointments: [],
    topSpecialists: [],
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [fetchedAppointments, setFetchedAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTargetId, setRescheduleTargetId] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredDoctors = useMemo(() => {
    if (!doctorFilter) return doctors;
    const wanted = doctorFilter.toLowerCase().trim();
    return doctors.filter((doctor) => {
      const specialty = String(doctor?.specialty || "").toLowerCase().trim();
      if (!specialty) return false;
      if (specialty === wanted) return true;
      if (wanted === "cardiology" && specialty.includes("cardio")) return true;
      if (wanted === "neurology" && specialty.includes("neuro")) return true;
      if (wanted === "pediatrics" && specialty.includes("pediatric")) return true;
      return false;
    });
  }, [doctorFilter, doctors]);

  const appointments = useMemo(
    () => filterAppointmentsByTab(fetchedAppointments, appointmentFilter),
    [appointmentFilter, fetchedAppointments]
  );

  const records = useMemo(() => {
    if (dashboardData.recentAppointments?.length) {
      return dashboardData.recentAppointments;
    }
    return appointments;
  }, [appointments, dashboardData.recentAppointments]);

  const specialists = useMemo(
    () => dashboardData.topSpecialists || [],
    [dashboardData.topSpecialists]
  );

  const latestAppointment = useMemo(() => {
    if (dashboardData.latestAppointment) return dashboardData.latestAppointment;
    return appointments[0] || null;
  }, [appointments, dashboardData.latestAppointment]);

  const loadPortalData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [dashboard, doctorsRes, appointmentsRes, profileRes, notificationsRes] =
        await Promise.all([
          getPatientDashboardData(),
          getDoctors(doctorFilter),
          getMyAppointments(),
          getPatientProfile(),
          getPatientNotifications(),
        ]);

      const dashboardPayload = unwrapApiPayload(dashboard);
      const doctorsPayload = unwrapApiPayload(doctorsRes);
      const appointmentsPayload = unwrapApiPayload(appointmentsRes);
      const profilePayload = unwrapApiPayload(profileRes);
      const notificationsPayload = unwrapApiPayload(notificationsRes);

      setDashboardData({
        latestAppointment: dashboardPayload?.latestAppointment || null,
        recentAppointments: toArray(dashboardPayload?.recentAppointments),
        topSpecialists: toArray(dashboardPayload?.topSpecialists),
      });
      setDoctors(toArray(doctorsPayload?.doctors || doctorsPayload?.items || doctorsPayload));
      setFetchedAppointments(
        toArray(
          appointmentsPayload?.appointments ||
            appointmentsPayload?.items ||
            appointmentsPayload
        )
      );
      setProfile(profilePayload || null);
      setNotifications(
        toArray(
          notificationsPayload?.notifications ||
            notificationsPayload?.items ||
            notificationsPayload
        )
      );
    } catch (loadError) {
      setError(loadError.message || "Failed to load patient portal data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [doctorFilter]);

  useEffect(() => {
    if (!doctorId) {
      setSelectedDoctor(doctors[0] || null);
      return;
    }

    const cached = doctors.find(
      (doctor) => String(resolveEntityId(doctor)) === String(doctorId)
    );
    if (cached) {
      setSelectedDoctor(cached);
      return;
    }

    const loadDoctor = async () => {
      try {
        const doctorDetail = await getDoctorDetails(doctorId);
        const payload = unwrapApiPayload(doctorDetail);
        setSelectedDoctor(payload?.doctor || payload);
      } catch {
        setSelectedDoctor(null);
      }
    };

    loadDoctor();
  }, [doctorId, doctors]);

  const openRescheduleModal = (appointment) => {
    const appointmentId = resolveEntityId(appointment);
    if (!appointmentId) return;
    setRescheduleTargetId(appointmentId);
    setRescheduleForm({
      date: appointment.date || new Date().toISOString().slice(0, 10),
      time: appointment.time || "10:00",
    });
    setShowRescheduleModal(true);
  };

  const handleBookAppointment = async () => {
    const selectedDoctorId = resolveEntityId(selectedDoctor);
    if (!selectedDoctorId) return false;
    try {
      await bookAppointment({
        doctorId: selectedDoctorId,
        date: bookingForm.date,
        time: bookingForm.time,
      });
      setMessage("Appointment booked successfully.");
      setShowBookingModal(false);
      setAppointmentFilter("upcoming");
      return true;
    } catch (bookError) {
      setError(bookError.message || "Failed to book appointment.");
      return false;
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!appointmentId) return;
    try {
      await cancelAppointment(appointmentId);
      setMessage("Appointment cancelled.");
      await loadPortalData();
    } catch (cancelError) {
      setError(cancelError.message || "Failed to cancel appointment.");
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!rescheduleTargetId) return;
    try {
      await rescheduleAppointment(rescheduleTargetId, {
        date: rescheduleForm.date,
        time: rescheduleForm.time,
      });
      setMessage("Appointment rescheduled.");
      setShowRescheduleModal(false);
      setRescheduleTargetId(null);
      await loadPortalData();
    } catch (rescheduleError) {
      setError(rescheduleError.message || "Failed to reschedule appointment.");
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      await updatePatientProfile(profile);
      setMessage("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (profileError) {
      setError(profileError.message || "Failed to update profile.");
    }
  };

  const handleMarkRead = async (notificationId) => {
    if (!notificationId) return;
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.filter((item) => resolveEntityId(item) !== notificationId)
      );
    } catch {
      // Non-blocking on purpose.
    }
  };

  return {
    appointments,
    appointmentFilter,
    bookingForm,
    dashboardData,
    doctorFilter,
    doctors,
    error,
    filteredDoctors,
    formatAvailability,
    formatDateDisplay,
    formatTimeDisplay,
    getAppointmentId: resolveEntityId,
    getDoctorId: resolveEntityId,
    getDoctorNameFromAppointment,
    getDoctorSpecialtyFromAppointment,
    getNotificationId: resolveEntityId,
    handleBookAppointment,
    handleCancelAppointment,
    handleMarkRead,
    handleRescheduleAppointment,
    handleSaveProfile,
    isEditingProfile,
    isLoading,
    latestAppointment,
    loadPortalData,
    message,
    notifications,
    openRescheduleModal,
    profile,
    records,
    rescheduleForm,
    selectedDoctor,
    setAppointmentFilter,
    setBookingForm,
    setDoctorFilter,
    setError,
    setIsEditingProfile,
    setMessage,
    setProfile,
    setShowBookingModal,
    setShowRescheduleModal,
    setRescheduleForm,
    showBookingModal,
    showRescheduleModal,
    specialists,
  };
}

export default usePatientPortal;
