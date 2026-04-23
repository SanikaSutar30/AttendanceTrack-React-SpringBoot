import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    fetch("http://localhost:8091/user/get-all-users")
      .then(async (res) => {
        const text = await res.text();
        console.log("RAW RESPONSE:", text); // IMPORTANT

        try {
          return JSON.parse(text);
        } catch (err) {
          throw new Error("Not JSON response", err);
        }
      })
      .then((data) => {
        console.log("Users:", data);
        setUsers(data);
        setError("");
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setError("Failed to fetch users");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDeleteUser = (username) => {
    if (!window.confirm(`Delete user: ${username}?`)) return;

    fetch(
      `http://localhost:8091/user/delete-user-by-username?username=${username}`,
      { method: "DELETE" },
    )
      .then(async (res) => {
        if (res.ok) {
          alert("User deleted successfully!");
          fetchUsers();
        } else {
          const msg = await res.text();
          alert("Delete failed: " + msg);
        }
      })
      .catch(() => alert("Error deleting user"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />

      <h1 className="text-3xl font-bold text-center my-6 text-gray-800">
        All Users
      </h1>

      <div className="p-4">
        {/* Loading */}
        {loading && (
          <p className="text-center text-lg text-gray-600">Loading users...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Table */}
        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 transition`}
                  >
                    <td className="px-4 py-2 border text-center">
                      {user.username}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {user.firstName}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {user.lastName}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {user.email}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {user.role || "N/A"}
                    </td>

                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/update-user/${user.username}`)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition cursor-pointer"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No users */}
        {!loading && users.length === 0 && !error && (
          <p className="text-center text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default AllUser;
