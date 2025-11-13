import "../styles/Menu.css";

export default function Menu({
  isOpen,
  setIsOpen,
  selectedMenu,
  setSelectedMenu,
}) {
  if (!isOpen) return null;

  return (
    <div className="menu-overlay" onClick={() => setIsOpen(false)}>
      <div
        className={`menu-container ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-left">
          <button
            className={selectedMenu === "profile" ? "active" : ""}
            onClick={() => setSelectedMenu("profile")}
          >
            Profile
          </button>

          <button
            className={selectedMenu === "config" ? "active" : ""}
            onClick={() => setSelectedMenu("config")}
          >
            Configuration
          </button>

          <button
            className={selectedMenu === "billing" ? "active" : ""}
            onClick={() => setSelectedMenu("billing")}
          >
            Billing
          </button>
        </div>

        <div className="menu-right">
          <button className="close-menu-btn" onClick={() => setIsOpen(false)}>
            x
          </button>
          {selectedMenu === "profile" && (
            <div>
              <h2>Profile</h2>
              <p>Your profile info...</p>
            </div>
          )}

          {selectedMenu === "config" && (
            <div>
              <h2>Configuration</h2>
              <p>Your settings...</p>
            </div>
          )}

          {selectedMenu === "billing" && (
            <div>
              <h2>Billing</h2>
              <p>Your billing info...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
