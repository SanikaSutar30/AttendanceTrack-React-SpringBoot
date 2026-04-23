import { useState } from "react";
import AdminMenu from "./AdminMenu";

function AddSubject() {
  const [form, setForm] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:8091/subject/add-subject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.text(); // assuming backend returns text

      if (response.ok && data === "Subject Added") {
        setSuccess("Subject added successfully!");
        setForm({ name: "" });
      } else {
        setError(data || "Failed to add subject.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />

      <div className="flex justify-center items-center py-12 px-4">
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6"
        >
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Add Subject
          </h2>

          {/* Subject Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Subject Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={inputHandler}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter subject name"
              required
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSubject;
