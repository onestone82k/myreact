import { useEffect, useState, useCallback } from "react";
import { Link } from 'react-router-dom';

interface Target {
  idx: number;
  biz_no: string;
  corp_nm: string;
}

interface MessageResponse {
  message: Target[];
}

function ApiPage() {
  const [data, setData] = useState<Target[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 불러오기 로직을 함수로 분리 (재사용 가능하도록)
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // 브라우저 캐시를 강제로 무시하도록 URL 끝에 현재 시간을 붙입니다.
    fetch(`/api/message?t=${new Date().getTime()}`)
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 오류");
        return res.json();
      })
      .then((json: any) => {
        if (json && Array.isArray(json.message)) {
          setData(json.message);
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 컴포넌트가 처음 마운트될 때 한 번 실행
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>API 통신 결과</h1>
      
      {/* 다시 불러오기 버튼 추가 */}
      <button 
        onClick={fetchData} 
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        🔄 최신 데이터 다시 불러오기
      </button>

      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ 
          margin: '0 auto', 
          textAlign: 'left', 
          borderCollapse: 'collapse', 
          width: '80%', 
          maxWidth: '600px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>인덱스</th>
              <th style={{ padding: '12px' }}>사업자번호</th>
              <th style={{ padding: '12px' }}>기업명</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  등록된 기업 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{item.idx}</td>
                  <td style={{ padding: '12px' }}>{item.biz_no}</td>
                  <td style={{ padding: '12px' }}>{item.corp_nm}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}

export default ApiPage;