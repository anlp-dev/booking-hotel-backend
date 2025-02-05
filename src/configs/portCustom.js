const find = require('find-process'); // Đảm bảo đã import thư viện find-process

// Biến lưu port cũ
let previousPort = null;

// Hàm kill process đang chiếm port
async function killPort(port) {
    if (!port) return;
    try {
        const list = await find('port', port);
        if (list.length > 0) {
            console.log(`🔴 Đang đóng process cũ trên port ${port}...`);
            list.forEach(proc => process.kill(proc.pid, 'SIGTERM')); // Kill process theo PID
            console.log(`✅ Đã đóng process cũ trên port ${port}.`);
        } else {
            console.log(`⚠️ Không tìm thấy process nào trên port ${port}.`);
        }
    } catch (error) {
        console.log(`⚠️ Lỗi khi tìm process: ${error.message}`);
    }
}

// Hàm khởi động server mới
async function startServer(app) {
    // Chọn port random từ 3000-9999
    let portCustom = Math.floor(Math.random() * (9999 - 3000 + 1)) + 3000;

    // Kill port cũ trước khi khởi động server mới
    await killPort(previousPort);

    // Cập nhật port mới vào biến global
    previousPort = portCustom;

    // Khởi động server
    app.listen(portCustom, () => {
        console.log(`🚀 Server đang chạy tại http://localhost:${portCustom}`);
    });
}

module.exports = {startServer};
