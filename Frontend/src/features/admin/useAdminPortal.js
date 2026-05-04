import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createDoctor,
  deleteDoctor,
  getAdminDashboardOverview,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from "../../api/adminApi";
import { resolveEntityId, toArray, unwrapApiPayload } from "../../utils/dataAdapters";

const EMPTY_FORM = {
  id: "",
  name: "",
  email: "",
  password: "",
  specialty: "",
  contactNumber: "",
  availability: [],
};

export const getDoctorRecordId = (doctor) => resolveEntityId(doctor);

function useAdminPortal({ editDoctorId } = {}) {
  const navigate = useNavigate();
  const [overview, setOverview] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    recentDoctors: [],
  });
  const [doctors, setDoctors] = useState([]);
  const [doctorForm, setDoctorForm] = useState(EMPTY_FORM);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const totalDoctorsCount = useMemo(
    () => overview.totalDoctors || doctors.length,
    [doctors.length, overview.totalDoctors]
  );

  const loadAdminData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [overviewRes, doctorsRes] = await Promise.all([
        getAdminDashboardOverview(),
        getAllDoctors(),
      ]);
      const overviewPayload = unwrapApiPayload(overviewRes);
      const doctorsPayload = unwrapApiPayload(doctorsRes);

      setOverview({
        totalDoctors: overviewPayload?.totalDoctors ?? 0,
        totalPatients: overviewPayload?.totalPatients ?? 0,
        totalAppointments: overviewPayload?.totalAppointments ?? 0,
        recentDoctors: toArray(
          overviewPayload?.recentDoctors || overviewPayload?.doctors
        ),
      });
      setDoctors(
        toArray(doctorsPayload?.doctors || doctorsPayload?.items || doctorsPayload)
      );
    } catch (loadError) {
      setError(loadError.message || "Failed to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (!editDoctorId) {
      setDoctorForm(EMPTY_FORM);
      setEditingDoctorId(null);
      return;
    }

    let cancelled = false;
    setError("");
    setMessage("");

    (async () => {
      try {
        const details = await getDoctorById(editDoctorId);
        const detailsPayload = unwrapApiPayload(details);
        const doctor = detailsPayload?.doctor || detailsPayload;
        const resolvedDoctorId = getDoctorRecordId(doctor) || editDoctorId;
        if (cancelled) return;
        setDoctorForm({
          id: resolvedDoctorId || "",
          name: doctor.name || "",
          email: doctor.email || "",
          password: "",
          specialty: doctor.specialty || "",
          contactNumber: doctor.contactNumber || "",
          availability: doctor.availability || [],
        });
        setEditingDoctorId(resolvedDoctorId);
      } catch (editError) {
        if (!cancelled) {
          setError(editError.message || "Failed to load doctor details.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editDoctorId]);

  const handleCreateOrUpdateDoctor = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        name: doctorForm.name,
        email: doctorForm.email,
        password: doctorForm.password,
        specialty: doctorForm.specialty,
        contactNumber: doctorForm.contactNumber,
        availability: doctorForm.availability,
      };

      if (editingDoctorId) {
        await updateDoctor(editingDoctorId, {
          name: payload.name,
          email: payload.email,
          specialty: payload.specialty,
          contactNumber: payload.contactNumber,
          availability: payload.availability,
        });
        setMessage("Doctor updated successfully.");
      } else {
        await createDoctor(payload);
        setMessage("Doctor created successfully.");
      }

      setDoctorForm(EMPTY_FORM);
      setEditingDoctorId(null);
      await loadAdminData();
      navigate("/admin/doctors");
    } catch (submitError) {
      setError(submitError.message || "Failed to save doctor.");
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!doctorId) {
      setError("Doctor id is missing. Please refresh and try again.");
      return;
    }

    setError("");
    setMessage("");
    try {
      await deleteDoctor(doctorId);
      setMessage("Doctor deleted successfully.");
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete doctor.");
    }
  };

  return {
    doctorForm,
    doctors,
    editingDoctorId,
    error,
    handleCreateOrUpdateDoctor,
    handleDeleteDoctor,
    isLoading,
    loadAdminData,
    message,
    overview,
    setDoctorForm,
    totalDoctorsCount,
  };
}

export default useAdminPortal;
