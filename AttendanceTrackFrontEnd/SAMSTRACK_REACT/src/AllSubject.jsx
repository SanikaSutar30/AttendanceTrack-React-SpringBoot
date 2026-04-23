import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch subjects
  const fetchSubjects = () => {
    setLoading(true);
    fetch("http://localhost:8091/subject/get-all-subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error("Error fetching subjects:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Delete subject
  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    fetch(`http://localhost:8091/subject/delete-subject/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((msg) => {
        if (msg === "deleted") {
          setSubjects(subjects.filter((s) => s.id !== id));
        } else {
          alert("Subject not found");
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // Start editing
  const startEditing = (subject) => {
    setEditingId(subject.id);
    setName(subject.name);
  };

  // Update subject
  const updateSubject = () => {
    if (!name.trim()) {
      alert("Subject name cannot be empty");
      return;
    }
    fetch("http://localhost:8091/subject/update-subject", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, name }),
    })
      .then((res) => res.json())
      .then(() => {
        setSubjects(
          subjects.map((s) => (s.id === editingId ? { ...s, name } : s)),
        );
        setEditingId(null);
        setName("");
      })
      .catch((err) => console.error("Update error:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />

      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">All Subjects</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full border border-gray-300 shadow-lg bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Subject Name</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((sub, index) => (
                <tr
                  key={sub.id}
                  className={`text-center ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="border px-4 py-2">{sub.id}</td>

                  <td className="border px-4 py-2">
                    {editingId === sub.id ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      sub.name
                    )}
                  </td>

                  <td className="border px-4 py-2 space-x-2">
                    {editingId === sub.id ? (
                      <>
                        <button
                          onClick={updateSubject}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => {
                            setEditingId(null);
                            setName("");
                          }}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(sub)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {subjects.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AllSubject;
