function Google() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    const getGoogleAuthUrl = async () => {
      const response = await fetch("/api/google");
      const data = await response.json();

      window.location.href = data.url;
    };

    getGoogleAuthUrl();
  } else {
    const handleGoogleCallback = async () => {
      const response = await fetch("/api/google/callback?code=" + code);
      const data = await response.json();

      console.log(data);
      if (data.token) localStorage.setItem("token", data.token);
      window.location.href = "/";
    };

    handleGoogleCallback();
  }

  return <div></div>;
}

export default Google;
