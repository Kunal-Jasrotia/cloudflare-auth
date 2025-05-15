const LoginPage = () => {
  return (
    <>
      <button onClick={() => (window.location.href = "/google")}>
        Login with Google
      </button>
    </>
  );
};

export default LoginPage;
