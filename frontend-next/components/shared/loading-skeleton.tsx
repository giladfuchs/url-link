export const HomeCTALoading = () => (
  <div style={{ width: "20rem", height: "35rem", textAlign: "center" }}>
    <div
      className="skeleton"
      style={{ width: "100%", height: "3.5rem", marginTop: "2rem" }}
    />

    <div
      className="skeleton"
      style={{
        width: "60%",
        height: "2.5rem",
        margin: "1rem auto 0",
      }}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
        margin: "2rem 0",
      }}
    >
      <div
        className="skeleton"
        style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
      />
      <div
        className="skeleton"
        style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
      />
    </div>
    <div
      className="skeleton"
      style={{ width: "100%", height: "3.5rem", margin: "2rem 0" }}
    />
    <div
      className="skeleton"
      style={{ width: "100%", height: "3.5rem", margin: "2rem 0" }}
    />
  </div>
);

export const LoadingPage = () => (
  <div
    style={{
      width: "100%",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      padding: "2rem 1rem",
    }}
  >
    <div className="skeleton" style={{ width: "40%", height: "3rem" }} />
    <div className="skeleton" style={{ width: "60%", height: "1.75rem" }} />
    <div className="skeleton" style={{ width: "80%", height: "1.75rem" }} />
    <div className="skeleton" style={{ width: "90%", height: "1.75rem" }} />

    <div className="skeleton" style={{ width: "70%", height: "12rem" }} />

    <div className="skeleton" style={{ width: "50%", height: "2.25rem" }} />
    <div className="skeleton" style={{ width: "70%", height: "2.25rem" }} />
    <div className="skeleton" style={{ width: "30%", height: "2.25rem" }} />
  </div>
);
