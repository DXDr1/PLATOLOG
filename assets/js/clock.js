// Tạo Date theo giờ Bangkok (GMT+7), KHÔNG phụ thuộc máy
function getBangkokDate() {
    const now = new Date();

    // ms theo UTC
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;

    // Bangkok = UTC + 7h
    const bkkMs = utcMs + 7 * 60 * 60 * 1000;

    return new Date(bkkMs);
}


// ===== DIGITAL CLOCK (Bangkok, có seconds) =====
function updateDigitalClock() {
    const bkk = getBangkokDate();

    // Weekday (mon, tue, wed...)
    const weekday = bkk.toLocaleDateString("en-US", {
        weekday: "short"
    });

    // Day (dd)
    const day = String(bkk.getDate()).padStart(2, "0");

    // Month (JAN, FEB,...)
    const month = bkk
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase();

    // Year
    const year = bkk.getFullYear();

    const dateString = `${day}/${month}/${year}`;

    // Time (12h, có seconds)
    const timeString = bkk.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const clockElement = document.getElementById("bkk_clock");

    if (clockElement) {
        clockElement.textContent =
            `Local Time: ${weekday} - ${dateString} - ${timeString}`;
    }

    // sync width workinghours/officetime nếu có
    if (typeof syncSubHeaderWidths === "function") {
        syncSubHeaderWidths();
    }
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    updateDigitalClock();
    setInterval(updateDigitalClock, 1000);
});
