function updateDigitalClock() {
    const now = new Date();

    // ===== TẤT CẢ LẤY THEO ASIA/BANGKOK =====

    // Weekday
    const weekday = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
        weekday: "short"
    });

    // Day
    const day = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
        day: "2-digit"
    });

    // Month (JAN)
    const month = now
        .toLocaleDateString("en-US", {
            timeZone: "Asia/Bangkok",
            month: "short"
        })
        .toUpperCase();

    // Year
    const year = now.toLocaleDateString("en-US", {
        timeZone: "Asia/Bangkok",
        year: "numeric"
    });

    const dateString = `${day}/${month}/${year}`;

    // Time WITH seconds
    const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"   // THÊM SECONDS
    });

    // Write to DOM
    const clockElement = document.getElementById("bkk_clock");
    if (clockElement) {
        clockElement.textContent =
            `Local Time: ${weekday} - ${dateString} - ${timeString}`;
    }

    // Sync width of workinghours + officetime
    if (typeof syncSubHeaderWidths === "function") {
        syncSubHeaderWidths();
    }
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    updateDigitalClock();
    setInterval(updateDigitalClock, 1000); // update mỗi giây
});
