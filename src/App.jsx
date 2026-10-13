import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hoten'); // Sửa mặc định thành hoten
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetch('https://6a830a1ecb486d2434033464.mockapi.io/nguoidung')
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Lỗi fetch data:", err));
  }, []);

  // Xử lý Lọc và Sắp xếp với dữ liệu thực tế
  const processedData = data
    .filter((item) => {
      // Tìm kiếm theo trường 'hoten' (Họ tên)
      const nameMatch = item.hoten?.toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch; 
    })
    .sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';

      // So sánh chuỗi có hỗ trợ tiếng Việt
      if (typeof valA === 'string' && typeof valB === 'string') {
         if (sortOrder === 'asc') {
            return valA.localeCompare(valB);
         } else {
            return valB.localeCompare(valA);
         }
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="container py-4" style={{ fontFamily: 'Arial' }}>
      {/* THÔNG TIN NHÓM */}
      <div className="card mb-4 shadow-sm border-0 bg-light">
        <div className="card-body">
            <h2 className="card-title text-primary mb-3">Thông Tin Nhóm 14</h2>
            <ul className="list-group list-group-flush bg-transparent">
              <li className="list-group-item bg-transparent"><strong>Huỳnh Nhật Ký</strong> DH52200965</li>
              <li className="list-group-item bg-transparent"><strong>Nguyễn Ái Phương Thảo</strong> DH52201474</li>
            </ul>
        </div>
      </div>

      {/* BỘ LỌC VÀ ĐIỀU KHIỂN */}
      <div className="row g-3 mb-4 align-items-center bg-white p-3 rounded shadow-sm">
        <div className="col-md-4">
            <input 
              type="text" 
              className="form-control"
              placeholder="Tìm kiếm theo họ tên..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        
        <div className="col-md-2">
            <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
              <option value="hoten">Sắp xếp theo Họ tên</option>
              <option value="quocgia">Sắp xếp theo Quốc gia</option>
              <option value="id">Sắp xếp theo ID</option>
            </select>
        </div>

        <div className="col-md-2">
            <select className="form-select" onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Tăng dần (A-Z)</option>
              <option value="desc">Giảm dần (Z-A)</option>
            </select>
        </div>

        <div className="col-md-4 d-flex gap-2">
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
            {/* Nút bấm mới được thêm vào */}
            <a
                className="btn btn-success"
                href="/image.png"
                target="_blank"
                rel="noreferrer"
            >
                Hình ảnh code
            </a>
        </div>
      </div>

      {/* HIỂN THỊ DỮ LIỆU */}
      {viewMode === 'table' ? (
        <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover table-bordered mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">ID</th>
                  <th>Họ tên</th>
                  <th>Địa chỉ</th>
                  <th>Quốc gia</th>
                  <th>Số điện thoại</th>
                </tr>
              </thead>
              <tbody>
                {processedData.length > 0 ? (
                    processedData.map((item) => (
                    <tr key={item.id}>
                        <td className="text-center">{item.id}</td>
                        <td className="fw-bold">{item.hoten}</td>
                        <td>{item.diachi}</td>
                        <td><span className="badge bg-secondary">{item.quocgia}</span></td>
                        <td>{item.phone}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">Không tìm thấy dữ liệu phù hợp.</td>
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
                    <div className="card h-100 shadow-sm border-0 hover-card">
                        <div className="card-body">
                            <h5 className="card-title text-primary text-truncate">{item.hoten}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">ID: {item.id}</h6>
                            <p className="card-text mb-1">
                                <strong>Quốc gia:</strong> <span className="badge bg-secondary">{item.quocgia}</span>
                            </p>
                            <p className="card-text mb-1">
                                <small><strong>SĐT:</strong> {item.phone}</small>
                            </p>
                            <p className="card-text text-muted">
                                <small>{item.diachi}</small>
                            </p>
                        </div>
                    </div>
                </div>
              ))
          ) : (
              <div className="col-12 text-center py-4 text-muted"><img src="/image.png" alt="Hình ảnh code" /></div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;