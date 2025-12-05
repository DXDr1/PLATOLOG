// ====== LOGO MỚI KHI SCROLL ======
const SCROLLED_LOGO_SVG = `
<a href="index.html">
    <img src="assets/img/PLATO4.svg" class="platologo">
</a>
`;

window.addEventListener("load", () => {
    const header       = document.querySelector(".header_bar");
    const logoContainer = document.querySelector(".logo_container");
    const checkbox     = document.getElementById("sidebar_active");
    const menuItems    = document.querySelectorAll(".link");
    const subHeader    = document.querySelector(".sub_header");
    const imgs         = document.querySelectorAll(".runner");
    const container    = document.querySelector(".slideshow");

    let originalLogoHtml = null;

    // ========== HIỆU ỨNG KHI SCROLL ==========
    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;



        // ĐỔI LOGO KHI SCROLL
        if (logoContainer) {
            if (originalLogoHtml === null) {
                originalLogoHtml = logoContainer.innerHTML;
            }
            logoContainer.innerHTML =
                scrollY > 0 ? SCROLLED_LOGO_SVG : originalLogoHtml;
        }

        // ĐỔI MÀU MENU BUTTON (qua class body.scrolled)
        document.body.classList.toggle("scrolled", scrollY > 0);
    });

    // ========== TẮT SIDEBAR KHI CLICK LINK / ESC ==========
    if (checkbox) {
        menuItems.forEach(item => {
            item.addEventListener("click", () => {
                checkbox.checked = false;
            });
        });

        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                checkbox.checked = false;
            }
        });
    }

    // ========== SUB_HEADER AUTO SLIDE (GIỮ HOVER) ==========
    if (subHeader) {
        let state = 0; // 0 = workinghours, 1 = officetime

        function loopSlide() {
            // nếu đang hover thì pause
            if (subHeader.matches(":hover")) {
                setTimeout(loopSlide, 300);
                return;
            }

            state = state === 0 ? 1 : 0;
            subHeader.classList.toggle("show-officetime", state === 1);

            setTimeout(loopSlide, 3000);
        }

        // delay vòng đầu 1.5s
        setTimeout(loopSlide, 1500);
    }

    // ========== SLIDESHOW HÌNH CHẠY TỪ TRÁI QUA PHẢI ==========
    if (imgs.length && container) {
        const SPEED_DVW = 10; // 10dvw / giây
        let speedPxPerSecond = 0;

        function updateSpeed() {
            const vw = Math.max(
                document.documentElement.clientWidth || 0,
                window.innerWidth || 0
            );
            speedPxPerSecond = SPEED_DVW * (vw / 100); // d.vw → px
        }

        updateSpeed();
        window.addEventListener("resize", updateSpeed);

        let currentIndex = 0;
        let x = 0;
        let lastTime = null;

        function startImage(index) {
            currentIndex = index;

            imgs.forEach((img, i) => {
                img.style.opacity = i === currentIndex ? "1" : "0";
                img.style.position = "absolute";
            });

            const img = imgs[currentIndex];
            const imgWidth = img.clientWidth || img.naturalWidth || 200;

            x = -imgWidth;
            img.style.left = x + "px";
        }

        function loop(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const dt = (timestamp - lastTime) / 1000; // ms → s
            lastTime = timestamp;

            const img = imgs[currentIndex];
            const containerWidth = container.clientWidth;

            x += speedPxPerSecond * dt;
            img.style.left = x + "px";

            const imgWidth = img.clientWidth || img.naturalWidth || 200;
            if (x > containerWidth) {
                const nextIndex = (currentIndex + 1) % imgs.length;
                startImage(nextIndex);
            }

            requestAnimationFrame(loop);
        }

        startImage(0);
        requestAnimationFrame(loop);
    }
});


// ===== CUSTOM SCROLLBAR + AUTO-HIDE =====
document.addEventListener("DOMContentLoaded", () => {
    const bar   = document.getElementById("custom-scrollbar");
    const thumb = document.getElementById("custom-thumb");
    const doc   = document.documentElement;

    if (!bar || !thumb) return;

    let hideTimer = null;
    let dragging  = false;
    let startY    = 0;
    let startThumbTop = 0;

    function updateThumb() {
        const scrollHeight = doc.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollTop    = doc.scrollTop;

        // không đủ dài để scroll → ẩn thanh
        if (scrollHeight <= clientHeight) {
            bar.style.display = "none";
            return;
        } else {
            bar.style.display = "block";
        }

        const trackHeight = clientHeight;
        let thumbHeight = (clientHeight / scrollHeight) * trackHeight;
        const minHeight = 40;
        if (thumbHeight < minHeight) thumbHeight = minHeight;

        const maxThumbTop  = trackHeight - thumbHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        const thumbTop     = maxScrollTop ? (scrollTop / maxScrollTop) * maxThumbTop : 0;

        thumb.style.height = thumbHeight + "px";
        thumb.style.top    = thumbTop + "px";
    }

    function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            if (!dragging) bar.classList.remove("visible");
        }, 2000); // 2s không activity → ẩn
    }

    function showBar() {
        bar.classList.add("visible");
        scheduleHide();
    }

    // scroll → cập nhật + hiện
    window.addEventListener("scroll", () => {
        updateThumb();
        showBar();
    });

    // resize → cập nhật lại
    window.addEventListener("resize", () => {
        updateThumb();
    });

    // hover thanh → hiện
    bar.addEventListener("mouseenter", () => {
        showBar();
    });

    // rời thanh → bắt đầu đếm 2s ẩn
    bar.addEventListener("mouseleave", () => {
        scheduleHide();
    });

    // click vào track (phần rỗng) để nhảy đến vị trí
    bar.addEventListener("mousedown", (e) => {
        if (e.target === thumb) return; // để mousedown trên thumb cho drag xử lý

        const rect         = bar.getBoundingClientRect();
        const clickY       = e.clientY - rect.top;
        const clientHeight = window.innerHeight;
        const scrollHeight = doc.scrollHeight;
        const thumbHeight  = thumb.offsetHeight;

        const maxThumbTop  = clientHeight - thumbHeight;
        const maxScrollTop = scrollHeight - clientHeight;

        let newThumbTop = clickY - thumbHeight / 2;
        if (newThumbTop < 0) newThumbTop = 0;
        if (newThumbTop > maxThumbTop) newThumbTop = maxThumbTop;

        const newScrollTop = maxThumbTop
            ? (newThumbTop / maxThumbTop) * maxScrollTop
            : 0;

        doc.scrollTop = newScrollTop;
        updateThumb();
        showBar();
    });

    // drag thumb
    thumb.addEventListener("mousedown", (e) => {
        e.preventDefault();
        dragging = true;
        showBar();

        startY        = e.clientY;
        startThumbTop = thumb.offsetTop;

        function onMove(ev) {
            const clientHeight = window.innerHeight;
            const scrollHeight = doc.scrollHeight;
            const thumbHeight  = thumb.offsetHeight;
            const maxThumbTop  = clientHeight - thumbHeight;
            const maxScrollTop = scrollHeight - clientHeight;

            let newTop = startThumbTop + (ev.clientY - startY);
            if (newTop < 0) newTop = 0;
            if (newTop > maxThumbTop) newTop = maxThumbTop;

            thumb.style.top = newTop + "px";

            const newScrollTop = maxThumbTop
                ? (newTop / maxThumbTop) * maxScrollTop
                : 0;

            doc.scrollTop = newScrollTop;
        }

        function onUp() {
            dragging = false;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            scheduleHide();
        }

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    });

    // khởi tạo lần đầu
    updateThumb();
    showBar();
});
