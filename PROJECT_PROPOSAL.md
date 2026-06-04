# Đề tài giữa kỳ: Dkron

## 1. Dự án đã chọn

Dkron - Distributed, fault tolerant job scheduling system.

Link dự án gốc:
https://github.com/distribworks/dkron

## 2. Mục đích

Dkron là hệ thống lập lịch công việc phân tán. Hệ thống cho phép nhiều node cùng tham gia xử lý các công việc định kỳ.

## 3. Chức năng chính

- Tạo và quản lý job định kỳ.
- Chạy job trên nhiều node.
- Hỗ trợ cụm phân tán.
- Có khả năng chịu lỗi khi một node gặp sự cố.
- Có giao diện quản lý job.

## 4. Ứng dụng thực tế

Dkron có thể dùng để:
- Backup database định kỳ.
- Gửi email tự động.
- Tạo báo cáo hằng ngày.
- Đồng bộ dữ liệu.
- Xử lý các tác vụ nền trong hệ thống phân tán.

## 5. Hai tính năng mới dự kiến phát triển

### Tính năng 1: Phân nhóm job

Thêm trường group cho job để phân loại các job theo nhóm như backup, report, email.

### Tính năng 2: Theo dõi node và lịch sử chạy job

Ghi nhận job đã chạy ở node nào, thời gian nào, trạng thái thành công hay thất bại.