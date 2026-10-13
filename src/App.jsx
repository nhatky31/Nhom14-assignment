import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Sắp xếp mặc định theo Tên
  const [sortOrder, setSortOrder] = useState('asc'); // Tăng dần
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetch('https://6a830a1ecb486d2434033464.mockapi.io/nguoidung')
      .then((res) => res.json())
      .then((result) => {
        // KHẮC PHỤC YÊU CẦU ĐỀ BÀI: 
        // Dữ liệu API là người dùng (không có giá). Ta sẽ tự sinh ra trường 'Giá' và 'Tên' để thỏa mãn yêu cầu đề bài.
        const formattedData = result.map(item => ({
            ...item,
            name: item.hoten, // Đổi 'hoten' thành 'name' cho chuẩn yêu cầu "Tên"
            price: parseInt(item.id) * 150000 // Tự tạo ra 1 mức giá giả định dựa vào ID (VD: ID 1 = 150.000đ)
        }));
        setData(formattedData);
      })
      .catch((err) => console.error("Lỗi fetch data:", err));
  }, []);

  // Xử lý Lọc và Sắp xếp
  const processedData = data
    .filter((item) => {
      // Tìm kiếm theo tên (sản phẩm, người dùng)
      const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch; 
    })
    .sort((a, b) => {
      // Sắp xếp theo Giá (số) hoặc Tên (chuỗi)
      if (sortBy === 'price') {
          if (sortOrder === 'asc') return a.price - b.price;
          return b.price - a.price;
      } else {
          let valA = a.name || '';
          let valB = b.name || '';
          if (sortOrder === 'asc') return valA.localeCompare(valB);
          return valB.localeCompare(valA);
      }
    });

  // Hàm định dạng tiền tệ VNĐ cho đẹp
  const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container py-4" style={{ fontFamily: 'Arial' }}>
      
      {/* THÔNG TIN NHÓM VÀ HÌNH CHỤP CODE */}
      <div className="card mb-4 shadow-sm border-0 bg-light">
        <div className="card-body">
            <h2 className="card-title text-primary mb-3">Thông Tin Nhóm 14</h2>
            <ul className="list-group list-group-flush bg-transparent mb-3">
              <li className="list-group-item bg-transparent"><strong>Huỳnh Nhật Ký</strong> DH52200965</li>
              <li className="list-group-item bg-transparent"><strong>Nguyễn Ái Phương Thảo</strong> DH52201474</li>
            </ul>
            
            <hr />
            <h5 className="text-secondary mb-3">Hình chụp mã nguồn (Yêu cầu đề bài)</h5>
            <div className="text-center">
                {/* Đảm bảo bạn đã lưu ảnh code vào thư mục public với tên code-screenshot.png */}
                <img 
                    src="../public/image.png" 
                    alt="Hình chụp code VS Code" 
                    className="img-fluid rounded shadow" 
                    style={{ maxHeight: '350px', objectFit: 'contain' }}
                />
            </div>
        </div>
      </div>

      {/* BỘ LỌC VÀ ĐIỀU KHIỂN (Đúng chuẩn Tên / Giá) */}
      <div className="row g-3 mb-4 align-items-center bg-white p-3 rounded shadow-sm">
        <div className="col-md-4">
            <input 
              type="text" 
              className="form-control"
              placeholder="Tìm kiếm theo tên (người dùng/sản phẩm)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        
        <div className="col-md-2">
            <select className="form-select" onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
              <option value="name">Sắp xếp theo: Tên</option>
              <option value="price">Sắp xếp theo: Giá</option>
            </select>
        </div>

        <div className="col-md-3">
            <select className="form-select" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="asc">Tăng dần (A-Z / Thấp - Cao)</option>
              <option value="desc">Giảm dần (Z-A / Cao - Thấp)</option>
            </select>
        </div>

        <div className="col-md-3 text-end">
            <div className="btn-group" role="group">
                <button 
                    onClick={() => setViewMode('table')} 
                    className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}>
                    Table View
                </button>
                <button 
                    onClick={() => setViewMode('grid')} 
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}>
                    Grid View
                </button>
            </div>
        </div>
      </div>

      {/* HIỂN THỊ DỮ LIỆU */}
      {viewMode === 'table' ? (
        <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover table-bordered mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">ID</th>
                  <th>Tên (Sản phẩm / Người dùng)</th>
                  <th className="text-danger text-end">Giá</th>
                  <th>Quốc gia</th>
                  <th>Thông tin thêm (Địa chỉ/SĐT)</th>
                </tr>
              </thead>
              <tbody>
                {processedData.length > 0 ? (
                    processedData.map((item) => (
                    <tr key={item.id}>
                        <td className="text-center">{item.id}</td>
                        <td className="fw-bold text-primary">{item.name}</td>
                        <td className="text-danger fw-bold text-end">{formatPrice(item.price)}</td>
                        <td><span className="badge bg-secondary">{item.quocgia}</span></td>
                        <td>
                            <small className="d-block text-muted">📞 {item.phone}</small>
                            <small className="d-block text-muted">📍 {item.diachi}</small>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">Không tìm thấy kết quả nào.</td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
      ) : (
        <div className="row g-4">
          {processedData.length > 0 ? (
              processedData.map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">{item.name}</h5>
                            <h4 className="text-danger fw-bold my-2">{formatPrice(item.price)}</h4>
                            <p className="card-text mb-1 mt-3">
                                <strong>Quốc gia:</strong> <span className="badge bg-secondary">{item.quocgia}</span>
                            </p>
                            <p className="card-text mb-1">
                                <small><strong>SĐT:</strong> {item.phone}</small>
                            </p>
                            <p className="card-text text-muted">
                                <small><strong>ĐC:</strong> {item.diachi}</small>
                            </p>
                        </div>
                        <div className="card-footer bg-transparent border-0 text-end">
                            <small className="text-muted">ID: #{item.id}</small>
                        </div>
                    </div>
                </div>
              ))
          ) : (
              <div className="col-12 text-center py-4 text-muted">Không tìm thấy kết quả nào.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;