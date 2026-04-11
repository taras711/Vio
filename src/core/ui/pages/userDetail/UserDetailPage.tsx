import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UsersService } from "@src/services/users";
import { useAuth } from "@auth/AuthContext";
import type { UserData } from "@src/types/users";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    UsersService.get(id).then(res => setUserData(res.data));
  }, [id]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-6">

      <div className="space-y-2">
        <div><strong>ID:</strong> {userData.id}</div>
        <div><strong>Email:</strong> {userData.email}</div>
        <div><strong>Name:</strong> {userData.name}</div>
        <div><strong>Role:</strong> {userData.role}</div>
      </div>

      {user?.permissions.includes("users.superadmin") && (
        <div className="mt-6">
          <Link
            to={`/users/${id}/admin`}
            className="text-blue-600 underline"
          >
            Open superadmin Tools
          </Link>
        </div>
      )}
    </div>
  );
}