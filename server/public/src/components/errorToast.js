export function showErrorToast(message, duration = 3000) {
  const popup = document.createElement("div");

  popup.textContent =
    message instanceof Error ? message.message : String(message);

  Object.assign(popup.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "orangered",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "9999",
    pointerEvents: "none",
    transition: "opacity 0.2s ease-in-out",
  });

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 200);
  }, duration);
}
