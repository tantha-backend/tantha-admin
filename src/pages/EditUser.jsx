import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import Button from "../components/ui/Button";
import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";

import UserForm from "../components/users/UserForm";
import userService from "../services/userService";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userService.getUserById(id);
      const payload = response?.data || response;
      const userData = payload?.user || payload;

      setUser(userData);

      setInitialValues({
        name: userData?.name || "",
        email: userData?.email || "",
        role: userData?.role || "user",
        status: userData?.status || "active",
        isPremium: Boolean(userData?.isPremium),
        premiumExpiresAt: userData?.premiumExpiresAt
          ? new Date(userData.premiumExpiresAt).toISOString().slice(0, 10)
          : "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error(error?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleBack = () => {
    navigate("/users");
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      await userService.updateUser(id, {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        isPremium: values.isPremium,
        premiumExpiresAt: values.isPremium
          ? values.premiumExpiresAt || null
          : null,
      });

      toast.success("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error("Update user error:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState title="Loading user..." />;
  }

  if (!user || !initialValues) {
    return (
      <EmptyState
        title="User not found"
        description="The user may have been deleted or does not exist."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit User</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Update user profile, role, premium access, and account status.
          </p>
        </div>

        <Button variant="secondary" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Users
        </Button>
      </div>

      <SectionCard>
        <UserForm
          initialValues={initialValues}
          loading={saving}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      </SectionCard>
    </div>
  );
};

export default EditUser;
