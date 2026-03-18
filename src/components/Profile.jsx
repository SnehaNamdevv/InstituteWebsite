import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://institute-backend-0ncp.onrender.com";
export default function Profile({ dark, setActiveSection }) {

  const [student, setStudent] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const API =
    `${BASE_URL}/student/allStudents`;

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {

    const loggedStudent = JSON.parse(localStorage.getItem("student"));
    if (!loggedStudent) return;

    const res = await fetch(API);
    const data = await res.json();

    const currentStudent = data.students.find(
      (s) => s.email === loggedStudent.email
    );

    setStudent(currentStudent);
    setName(currentStudent?.fullName || "");
    setPhone(currentStudent?.contactNo || "");
    setAddress(currentStudent?.address || "");
  };

  const handleSave = async () => {

    if (!student) return;

    setMessage("Updating profile...");

    const res = await fetch(
`${BASE_URL}/student/updateStudent/${student.studentID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          contactNo: phone,
          address: address
        })
      }
    );

    if (res.ok) setMessage("Profile updated successfully ✅");
    else setMessage("Update failed");
  };

  return (

    <div className="space-y-6">

      {/* Back Button */}
   <button
  onClick={() => setActiveSection("Dashboard")}
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
>
  ← Back 
</button>

      {/* Profile Header */}
      <div
        className={`rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between
        ${dark ? "bg-slate-800 text-white" : "bg-white"}
        `}
      >

        <div className="flex items-center gap-4">

          <div className="relative">

            <img
              src={`https://ui-avatars.com/api/?name=${student?.fullName || "Student"}`}
              className="w-20 h-20 rounded-full"
            />

            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
              <Camera size={14} />
            </div>

          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {student?.fullName}
            </h2>

            <p className="text-sm opacity-70">
              {student?.email}
            </p>

            <p className="text-sm opacity-70">
              Student ID : {student?.studentID}
            </p>
          </div>

        </div>

        <div className="mt-4 md:mt-0 text-sm opacity-70">
          Dashboard Profile
        </div>

      </div>

      {/* Info Cards */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800 text-white" : "bg-white"}`}>
          <p className="text-xs opacity-70">Phone</p>
          <h3 className="font-semibold mt-1">{phone || "-"}</h3>
        </div>

        <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800 text-white" : "bg-white"}`}>
          <p className="text-xs opacity-70">Address</p>
          <h3 className="font-semibold mt-1">{address || "-"}</h3>
        </div>

        <div className={`rounded-xl p-4 shadow ${dark ? "bg-slate-800 text-white" : "bg-white"}`}>
          <p className="text-xs opacity-70">Email</p>
          <h3 className="font-semibold mt-1">{student?.email || "-"}</h3>
        </div>

      </div>

      {/* Edit Form */}

      <div className={`rounded-xl p-6 shadow ${dark ? "bg-slate-800 text-white" : "bg-white"}`}>

        <h3 className="text-lg font-semibold mb-4">
          Edit Profile
        </h3>

        {message && (
          <p className="text-sm text-green-500 mb-4">
            {message}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 dark:bg-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 dark:bg-slate-900"
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}