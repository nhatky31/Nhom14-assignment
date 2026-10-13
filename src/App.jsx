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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>Thông Tin Nhóm 14</h2>
        <ul>
          <li><strong>Huỳnh Nhật Ký</strong>DH52200965</li>
          <li><strong>Ái Thảo</strong> DH52201474</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo họ tên..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '250px' }}
        />
        
        <select onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px' }}>
          <option value="hoten">Sắp xếp theo Họ tên</option>
          <option value="quocgia">Sắp xếp theo Quốc gia</option>
          <option value="id">Sắp xếp theo ID</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '8px' }}>
          <option value="asc">Tăng dần (A-Z / Nhỏ-Lớn)</option>
          <option value="desc">Giảm dần (Z-A / Lớn-Nhỏ)</option>
        </select>

        <button onClick={() => setViewMode('table')} style={{ padding: '8px', cursor: 'pointer' }}>Table View</button>
        <button onClick={() => setViewMode('grid')} style={{ padding: '8px', cursor: 'pointer' }}>Grid View</button>
      </div>

      {viewMode === 'table' ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#ddd' }}>
              <th>ID</th>
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
                    <td style={{ textAlign: 'center' }}>{item.id}</td>
                    <td><strong>{item.hoten}</strong></td>
                    <td>{item.diachi}</td>
                    <td>{item.quocgia}</td>
                    <td>{item.phone}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy dữ liệu phù hợp.</td>
                </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {processedData.length > 0 ? (
              processedData.map((item) => (
                <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#333' }}>{item.hoten}</h3>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>ID:</strong> {item.id}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Q.Gia:</strong> {item.quocgia}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>SĐT:</strong> {item.phone}</p>
                  <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>{item.diachi}</p>
                </div>
              ))
          ) : (
              <p>Không tìm thấy dữ liệu phù hợp.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;