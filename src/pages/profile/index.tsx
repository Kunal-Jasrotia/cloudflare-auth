import { useEffect, useState } from "react";

type UserPayload = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
};
function Profile() {
  const [user, setUser] = useState<UserPayload | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("token");
    const response = fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user}`,
      },
    });
    response
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data.user);
      })
      .catch((err) => console.log(err));
  }, []);
  return <div>{user && JSON.stringify(user)}</div>;
}

export default Profile;
