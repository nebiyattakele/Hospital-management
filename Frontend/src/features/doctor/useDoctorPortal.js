import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDoctorAppointments,
  getDoctorDashboardStats,
  getDoctorNotifications,
  getDoctorProfile,
  updateAppointmentStatus,
  updateDoctorProfile,
} from "../../api/doctorApi";
import { changePasswordRequest } from "../../api/authApi";
import { resolveEntityId, toArray, unwrapApiPayload } from "../../utils/dataAdapters";

export const STATUS_TO_STYLE = {
  completed: "completed",
  accepted: "confirmed",
  confirmed: "confirmed",
  arrived: "completed",
  rejected: "booked",
  cancelled: "booked",
  pending: "booked",
  booked: "booked",
};

export const FILTERS = ["all", "today", "upcoming"];

function getLocalDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getItemDateKey(item) {
  const raw = item?.date;
  if (!raw) return null;
  if (typeof raw === "string") {
    const dateOnly = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (dateOnly) return dateOnly[1];
  }
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return getLocalDateKey(parsed);
  }
  return null;
}

function getItemDateTime(item) {
  const dateKey = getItemDateKey(item);
  if (!dateKey) return null;
  const timeStr = String(item?.time || "00:00").trim();
  const match = /^(\d{1,2}):(\d{2})/.exec(timeStr);
  const h = match ? Number(match[1]) : 0;
  const min = match ? Number(match[2]) : 0;
  const [y, mo, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, mo - 1, d, h, min, 0, 0);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function matchesToday(item) {
  const key = getItemDateKey(item);
  return key != null && key === getLocalDateKey();
}

function matchesUpcoming(item, now = new Date()) {
  const key = getItemDateKey(item);
  if (!key) return false;
  const todayKey = getLocalDateKey(now);
  if (key > todayKey) return true;
  if (key < todayKey) return false;
  const dt = getItemDateTime(item);
  if (!dt) return true;
  return dt >= now;
}

function filterAppointmentsByTab(items, tab) {
  if (tab === "all") return items;
  if (tab === "today") return items.filter(matchesToday);
  if (tab === "upcoming") return items.filter((item) => matchesUpcoming(item));
  return items;
}

export const getAppointmentItemId = (item) => resolveEntityId(item);

export const getPatientName = (item) =>
  item?.patientId?.name || item?.patient?.name || item?.patient || item?.patientName || "-";

export const getPatientEmail = (item) =>
  item?.patientId?.email || item?.patient?.email || item?.email || "-";

function useDoctorPortal() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedAppointments, setFetchedAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    upcomingAppointmentsCount: 0,
    recentAppointments: [],
  });
  const [dataError, setDataError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    specialty: "",
    contactNumber: "",
    availability: [],
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const recentAppointments = useMemo(
    () => dashboardStats.recentAppointments || [],
    [dashboardStats.recentAppointments]
  );
  const appointments = useMemo(
    () => filterAppointmentsByTab(fetchedAppointments, activeFilter),
    [activeFilter, fetchedAppointments]
  );

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(appointments.length / pageSize));
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return appointments.slice(start, start + pageSize);
  }, [appointments, currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const loadDoctorData = useCallback(async () => {
    setDataError("");
    setIsLoading(true);
    try {
      const [stats, appointmentData, alertData, profile] = await Promise.all([
        getDoctorDashboardStats(),
        getDoctorAppointments(),
        getDoctorNotifications(),
        getDoctorProfile(),
      ]);
      const statsPayload = unwrapApiPayload(stats);
      const appointmentsPayload = unwrapApiPayload(appointmentData);
      const alertsPayload = unwrapApiPayload(alertData);
      const profilePayload = unwrapApiPayload(profile);

      setDashboardStats({
        totalAppointments: statsPayload?.totalAppointments ?? 0,
        upcomingAppointmentsCount: statsPayload?.upcomingAppointmentsCount ?? 0,
        recentAppointments: toArray(statsPayload?.recentAppointments),
      });
      setFetchedAppointments(
        toArray(
          appointmentsPayload?.appointments ||
            appointmentsPayload?.items ||
            appointmentsPayload
        )
      );
      setNotifications(
        toArray(alertsPayload?.notifications || alertsPayload?.items || alertsPayload)
      );
      setProfileForm({
        name: profilePayload?.name || "",
        specialty: profilePayload?.specialty || "",
        contactNumber: profilePayload?.contactNumber || "",
        availability: profilePayload?.availability || [],
      });
    } catch (error) {
      setDataError(error.message || "Failed to load doctor dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctorData();
  }, [loadDoctorData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, fetchedAppointments.length]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    try {
      const payload = {
        name: profileForm.name,
        specialty: profileForm.specialty,
        contactNumber: profileForm.contactNumber,
        availability: profileForm.availability,
      };
      await updateDoctorProfile(payload);
      setMessage("Profile updated successfully.");
      setShowEditProfile(false);
    } catch (error) {
      setFormError(error.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setMessage("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setFormError("Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormError("New password and confirm password must match.");
      return;
    }

    try {
      const result = await changePasswordRequest({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage(result?.message || "Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (error) {
      setFormError(error.message || "Failed to change password.");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      if (!id) {
        setFormError("Appointment id is missing.");
        return;
      }
      await updateAppointmentStatus(id, {
        status,
        notes: "Please bring your previous medical reports.",
      });
      setMessage(`Appointment ${status.toLowerCase()} successfully.`);
      await loadDoctorData();
    } catch (error) {
      setFormError(error.message || "Failed to update appointment status.");
    }
  };

  return {
    activeFilter,
    setActiveFilter,
    appointments,
    fetchedAppointments,
    currentPage,
    setCurrentPage,
    goToPreviousPage,
    goToNextPage,
    dashboardStats,
    dataError,
    formError,
    setFormError,
    handlePasswordSubmit,
    handleProfileSubmit,
    handleStatusUpdate,
    isLoading,
    loadDoctorData,
    message,
    notifications,
    paginatedAppointments,
    passwordForm,
    setPasswordForm,
    profileForm,
    setProfileForm,
    recentAppointments,
    setShowChangePassword,
    setShowEditProfile,
    showChangePassword,
    showEditProfile,
    totalPages,
  };
}

export default useDoctorPortal;
