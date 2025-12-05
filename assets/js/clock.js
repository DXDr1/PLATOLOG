function updateDigitalClock() {
    const now = new Date();

    // Lấy giờ Bangkok
    const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Bangkok",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    // Tạo object theo giờ Bangkok
    const bkk = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    // Lấy thứ tiếng Anh (Không viết hoa)
    const weekday = bkk.toLocaleDateString("en-US", {
        weekday: "short"
    }); // Mon, Tue, Wed...

    // Lấy ngày / tháng dạng chữ / năm
    const day = String(bkk.getDate()).padStart(2, "0");

    const month = bkk
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(); // JAN, FEB, DEC...

    const year = bkk.getFullYear(); // full year 2025

    const dateString = `${day}/${month}/${year}`;

    const clockElement = document.getElementById("bkk_clock");

    if (clockElement) {
        clockElement.textContent = `Local Time: ${weekday} - ${dateString} - ${timeString}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateDigitalClock();
    setInterval(updateDigitalClock, 1000);
});
