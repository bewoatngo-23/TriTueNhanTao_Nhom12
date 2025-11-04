# Trực Quan Hóa DFS - Ứng Dụng ReactJS

Ứng dụng React một trang để trực quan hóa thuật toán Tìm Kiếm Theo Chiều Sâu (DFS) bằng cách đọc dữ liệu đồ thị từ file text và hiển thị quá trình tìm kiếm từng bước.

## 🌍 **MỚI: Hỗ Trợ Đa Ngôn Ngữ (i18n)**

- **🇺🇸 English**: Giao diện tiếng Anh đầy đủ
- **🇻🇳 Tiếng Việt**: Giao diện tiếng Việt hoàn chỉnh
- **Chuyển Đổi Ngôn Ngữ**: Click cờ quốc gia ở header để đổi ngôn ngữ
- **Tự Động Phát Hiện**: Tự động phát hiện ngôn ngữ trình duyệt
- **Lưu Trữ**: Lưu lựa chọn ngôn ngữ trong localStorage

## Tính Năng

- 📁 **Tải File**: Tải lên file `.txt` chứa dữ liệu đồ thị
- 🔍 **Thuật Toán DFS**: Chạy Tìm Kiếm Theo Chiều Sâu với trực quan hóa từng bước
- 📊 **Bảng Tương Tác**: Xem từng bước hiển thị nút hiện tại, ngăn xếp và các nút đã thăm
- 🎯 **Hiển Thị Đường Đi**: Xem đường đi cuối cùng từ nút bắt đầu đến nút đích
- 🎨 **Giao Diện Đẹp**: Thiết kế hiện đại với Tailwind CSS
- 🌍 **Đa Ngôn Ngữ**: Hỗ trợ tiếng Việt và tiếng Anh
- ⚡ **Xử Lý Thời Gian Thực**: Tất cả tính toán diễn ra trên trình duyệt

## Khởi Động Nhanh

1. **Cài Đặt Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Khởi Động Server Phát Triển**
   ```bash
   npm start
   ```

3. **Mở Trình Duyệt**
   - Truy cập `http://localhost:3000`

## Định Dạng File Đồ Thị

Tạo file `.txt` với định dạng sau:

### Định Dạng Tiếng Anh:
```
A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
G:
I: G
K:
Start: A
Goal: G
```

### Định Dạng Tiếng Việt:
```
A: B,C,D
B: I,G
C: F,E
D: F
E: G,K
F: K
G:
I: G
K:
Trạng thái đầu: A; Trạng thái kết thúc: G
```

### Quy Tắc Định Dạng:
- Mỗi dòng đại diện cho một nút và các nút kề: `TênNút: NútKề1,NútKề2,NútKề3`
- Cho phép nút không có kề: `TênNút:`
- Phải bao gồm `Start: TênNút` hoặc `Trạng thái đầu: TênNút` để chỉ định nút bắt đầu
- Phải bao gồm `Goal: TênNút` hoặc `Trạng thái kết thúc: TênNút` để chỉ định nút đích
- Tên nút phân biệt chữ hoa/thường

## Cách Sử Dụng

1. **Tải File Đồ Thị**
   - Click nút "Chọn File"
   - Chọn file `.txt` chứa dữ liệu đồ thị
   - Ứng dụng sẽ phân tích và kiểm tra tính hợp lệ của đồ thị

2. **Chạy Thuật Toán DFS**
   - Click nút "Chạy Tìm Kiếm Theo Chiều Sâu"
   - Theo dõi quá trình thực hiện từng bước trong bảng
   - Xem kết quả đường đi cuối cùng

3. **Giải Thích Kết Quả**
   - **Bảng Các Bước**: Hiển thị từng lần lặp với nút hiện tại, trạng thái ngăn xếp và các nút đã thăm
   - **Hiển Thị Đường Đi**: Hiển thị đường đi cuối cùng nếu tồn tại, hoặc báo không tìm thấy đường đi

## Ví Dụ Kết Quả

Thuật toán DFS sẽ tạo ra kết quả như sau:

| Bước | Nút Hiện Tại | Ngăn Xếp | Đã Thăm |
|------|-------------|-------|---------|
| 1    | A           | []    | [A]     |
| 2    | B           | [C,D] | [A,B]   |
| 3    | I           | [G,C,D] | [A,B,I] |
| 4    | G           | [C,D] | [A,B,I,G] |

**Kết Quả Cuối Cùng**: ✅ Tìm thấy đường đi: A → B → I → G

## Cấu Trúc Dự Án

```
src/
├── App.jsx                 # Component ứng dụng chính (với i18n)
├── components/
│   ├── FileUpload.jsx      # Tải file và phân tích (với i18n)
│   ├── DFSTable.jsx        # Bảng trực quan hóa các bước (với i18n)
│   ├── PathDisplay.jsx     # Hiển thị đường đi cuối cùng (với i18n)
│   └── LanguageSwitcher.jsx # Component chuyển đổi ngôn ngữ (MỚI)
├── locales/                # File dịch thuật (MỚI)
│   ├── en.json             # Bản dịch tiếng Anh
│   └── vi.json             # Bản dịch tiếng Việt
├── utils/
│   └── dfs.js              # Thuật toán DFS và tiện ích đồ thị
├── i18n.js                 # Cấu hình i18n (MỚI)
├── index.js                # Điểm vào ứng dụng React (đã cập nhật)
└── index.css               # Kiểu dáng toàn cục với Tailwind
```

## Chi Tiết Thuật Toán

### Cài Đặt Tìm Kiếm Theo Chiều Sâu
- Sử dụng cấu trúc dữ liệu **ngăn xếp** (LIFO - Last In, First Out)
- Khám phá sâu nhất có thể dọc theo mỗi nhánh trước khi quay lui
- Duy trì **tập hợp đã thăm** để tránh chu trình
- Ghi lại từng bước để trực quan hóa

### Hàm Chính
- `parseGraph(text)`: Chuyển đổi file text thành danh sách kề
- `runDFS(graph, start, goal)`: Thực thi thuật toán DFS
- `validateGraph(graph, start, goal)`: Đảm bảo dữ liệu đầu vào hợp lệ

## Dependencies

- **React 18**: Framework frontend
- **Tailwind CSS**: Framework CSS utility-first
- **react-i18next**: Framework quốc tế hóa
- **i18next**: Thư viện quốc tế hóa cốt lõi
- **File Reader API**: Để đọc file đã tải lên

## File Ngôn Ngữ

Nằm trong `src/locales/`:
- `en.json`: Bản dịch tiếng Anh
- `vi.json`: Bản dịch tiếng Việt

## Xử Lý Lỗi

Ứng dụng xử lý nhiều tình huống lỗi:
- Định dạng file không hợp lệ
- Thiếu nút bắt đầu hoặc nút đích
- Không tìm thấy nút trong đồ thị
- Dữ liệu đồ thị trống hoặc có lỗi định dạng

## Tương Thích Trình Duyệt

- Chrome (khuyến nghị)
- Firefox
- Safari
- Edge

## File Mẫu

Bao gồm nhiều file mẫu:
- `sample-graph.txt`: Định dạng tiếng Anh
- `sample-graph-vietnamese.txt`: Định dạng tiếng Việt
- `sample-graph-complete-vi.txt`: Định dạng tiếng Việt hoàn chỉnh

Tất cả đều chứa cùng một đồ thị với 9 nút (A-K + G):
- Nút bắt đầu: A
- Nút đích: G
- Đường đi dự kiến: A → B → I → G

## Phát Triển

### Scripts Có Sẵn
- `npm start`: Chạy server phát triển
- `npm build`: Build cho production
- `npm test`: Chạy test suite

### Tùy Chỉnh
- Sửa đổi logic phân tích đồ thị trong `utils/dfs.js`
- Cập nhật kiểu dáng UI trong các file component
- Thêm tính năng mới bằng cách mở rộng các component hiện có
- Thêm ngôn ngữ mới bằng cách tạo file JSON trong `src/locales/`

### Thêm Ngôn Ngữ Mới
1. Tạo file JSON mới trong `src/locales/` (ví dụ: `fr.json`)
2. Thêm bản dịch theo cấu trúc giống như `en.json`
3. Import trong `src/i18n.js`
4. Thêm nút cờ mới trong `LanguageSwitcher.jsx`

## Hướng Dẫn Sử Dụng Chi Tiết

### Bước 1: Chuẩn Bị File Đồ Thị
- Tạo file `.txt` với editor bất kỳ
- Sử dụng một trong hai định dạng (tiếng Anh hoặc tiếng Việt)
- Đảm bảo có nút bắt đầu và nút đích

### Bước 2: Tải File
- Mở ứng dụng trong trình duyệt
- Click "Chọn File" hoặc "Choose File"
- Chọn file `.txt` đã chuẩn bị

### Bước 3: Chạy Thuật Toán
- Kiểm tra thông tin đồ thị hiển thị
- Click "Chạy Tìm Kiếm Theo Chiều Sâu"
- Theo dõi các bước trong bảng

### Bước 4: Phân Tích Kết Quả
- Xem bảng để hiểu quá trình DFS
- Kiểm tra đường đi tìm được (nếu có)
- Phân tích độ phức tạp và hiệu quả

## Giấy Phép

Dự án này được tạo ra cho mục đích giáo dục như một phần của bài tập môn học Trí Tuệ Nhân Tạo.

## Liên Hệ và Đóng Góp

- Repository: TriTueNhanTao_Nhom12
- Issues và Pull Requests được chào đón
- Vui lòng tuân thủ coding standards của dự án

---

**Chúc bạn học tập vui vẻ với thuật toán DFS! 🎯🚀**